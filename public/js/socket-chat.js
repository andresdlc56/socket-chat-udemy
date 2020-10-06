var socket = io();

//Capturando la url
var params = new URLSearchParams(window.location.search);

//Si en los parametros de la url no hay una cadena de caracteres igual a nombre o sala, retorna un error
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

//Obteniendo el nombre del usuario
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //Emitir un mensaje al server con la info del usuario que se conecto
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios Conectados: ', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuarios
//Es decir: cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    console.log(personas);
});

socket.on('usuarioConectado', function(mensaje) {
    console.log(mensaje);
});

//Mensajes Privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado: ', mensaje);
})