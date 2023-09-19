class Subopcion {
    constructor(message, handler) {
        this.message = message;
        this.handler = handler;
    }
}

class RegistroFQRS {
    constructor() {
        this.conversation = [
            { type: "entrada", message: "Registro de FQRS" },
            { type: "salida", message: "¿Cómo quieres registrar tu solicitud?" },
            new Subopcion("Formulario web.", this.handleFormularioWeb.bind(this)), // Cambio aquí
            new Subopcion("Formulario chat.", this.handleChatLinalca.bind(this)),
            new Subopcion("Atención personalizada.", this.handleAtencionPersonalizada.bind(this)),
            new Subopcion("Menú principal.", this.handleMenuprincipal.bind(this)),
            
        ];
    }
    handleFormularioWeb(callback, showMenuOptions) {           
        const seleccion = `Formulario web`;        
        const message = `Puedes acceder al formulario web haciendo clic en el siguiente enlace: <a href="https://forms.office.com/r/MJBX5wD8pB" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Diligenciar formulario</a>`;
        callback(message, true, showMenuOptions, seleccion); // Pasar el tercer parámetro
     }

     handleChatLinalca(callback, showMenuOptions) {
        const seleccion = `Formulario chat`;  
        const message = `Para ayudarte en tu solicitud, ingresa los siguientes datos:`;              
        callback(message, true,showMenuOptions, seleccion); // Pasar el formulario
    }    

    handleAtencionPersonalizada(callback, showMenuOptions) {   
        
        const seleccion = `Atencion personalizada`;        
        const message = `Si deseas atención personalizada contáctete al nuestro número 3188195639 o por <a href="https://api.whatsapp.com/send/?phone=%2B573188195639&text=%C2%A1Hola%21+Estoy+navegando+en+www.linalca.com+y+solicito+m%C3%A1s+informaci%C3%B3n.&type=phone_number&app_absent=0" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Whatsapp web</a> en el horario de atención de lunes a viernes de 07:30 am a 05:45 pm`;
        callback(message, true, showMenuOptions, seleccion); // Pasar el tercer parámetro
     }   
            
    handleMenuprincipal(callback, showMenuOptions) {
        
        const seleccion = `Menú principal`;        
        const message = `Elige una opción:`;
        callback(message, true, showMenuOptions, seleccion); // Pasar el tercer parámetro
        
    }

    // Otras funciones de manejo de la conversación

    getConversation() {
        return this.conversation;
    }
}

export default RegistroFQRS;
