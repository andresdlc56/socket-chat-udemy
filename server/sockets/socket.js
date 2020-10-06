const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    //Escuchando el evento "entrarChat" proveniente del cliente
    client.on('entrarChat', (data, callback) => {
        //Si no existe la propiedad nombre o sala en el usuario
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El Nombre y la Sala son Necesarios'
            });
        }

        //Uniendome a una sala 
        client.join(data.sala);

        //Si existe la propiedad nombre en el usuario
        /*
            Ejecutando la funcion definida en la clase Usuarios para agregar persona a la lista de personas
            que pertenecen al chat    
        */
        usuarios.agragarPersona(client.id, data.nombre, data.sala);

        //Emitiendo evento a todos los usuarios que pertenecen a la misma sala para que vean a todas las personas conectadas en esa sala
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        //Emitir evento que notifique que un usuario espeficico se conecto
        client.broadcast.to(data.sala).emit('usuarioConectado', { usuario: 'Administrador', mensaje: `${data.nombre} se acaba de conectar` });

        //Retornar las personas que estan conectadas a una sala especifica
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //Escuchando evento "crearMensaje proveniente del cliente"
    client.on('crearMensaje', (data) => {
        //Obteniendo la info del usuario que emitio este evento
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        //Emitiendo "mensaje" a todos los usuarios de una sala especifica
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        //Emitir evento a todos en el chat para informar que un usuario se desconecto de una sala en especifico
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //Mensaje Privado
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        //Enviando mensaje Privado a un usuario especifico
        client.broadcast.to(data.remitente).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});