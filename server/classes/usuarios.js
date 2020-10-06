class Usuarios {
    constructor() {
        //Personas conectadas al chat
        this.personas = [];
    }

    agragarPersona(id, nombre, sala) {
        //Creando una persona con las propiedades recibidas
        let persona = { id, nombre, sala }

        //Empujando la persona al arreglo personas
        this.personas.push(persona);

        //Retornando todas las personas del chat
        return this.personas;
    }

    //metodo para obtener la info de una persona por el id
    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];

        /*
            Si encuentra una persona que cumpla con la propiedad, retornara un objeto
            si no retornara undefined
        */
        return persona;
    }

    //Metodo para obtener a todas las personas
    getPersonas() {
        return this.personas;
    }

    //Metodo para obtener a todas las personas de una sala especifica
    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    //Metodo para remover a una persona de las personas que estan conectadas al chat
    //Puede que se hayan desconectado por se fue la luz, se fastidio, etc...
    borrarPersona(id) {
        //Obteniendo la info de la persona que sera borrada
        let personaBorrada = this.getPersona(id);

        /*
            Retorna todas las personas del arreglo "personas" cuyo id sea diferente al 
            id de la persona que se quiere eliminar y asignar esas personas encontradas
            al arreglo personas
        */
        this.personas = this.personas.filter(persona => persona.id != id);

        //Retornando a la persona borrada
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}