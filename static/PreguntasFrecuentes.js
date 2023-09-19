class Subopcion {
    constructor(message, handler) {
        this.message = message;
        this.handler = handler;
    }
}
class PreguntasFrecuentes {
    constructor() {
        this.conversation = [
            { type: "entrada", message: "Preguntas frecuentes" },
            { type: "salida", message: "Selecciona la opción que necesitas" },
            new Subopcion("Cómo contactarnos.", this.handleComoContactarnos.bind(this)), // Cambio aquí
            new Subopcion("Cómo recibir soporte técnico.", this.handleRecibirSoporteTecnico.bind(this)),
            new Subopcion("Cuales son nuestras soluciones.", this.handleNuestrasSoluciones.bind(this)),
            new Subopcion("Cómo formar parte de nuestro equipo.", this.handleNuestroEquipo.bind(this)),
            new Subopcion("Menú principal", this.handleMenuprincipal.bind(this)),// ... otras conversaciones y subopciones ...
        ];
    }
    handleComoContactarnos(callback, showMenuOptions) {   
        
        const seleccion = `Como contactarnos`;     
        const message = `🏙️ Servicio al Cliente
Para consultas de servicio al cliente, contáctanos:
📧 Correo: servicioalcliente@linalca.com     
📞 Teléfono: +57 318 8195639
💬 WhatsApp: <a href="https://api.whatsapp.com/send/?phone=%2B573188195639&text=%C2%A1Hola%21+Estoy+navegando+en+www.linalca.com+y+solicito+m%C3%A1s+informaci%C3%B3n." target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Whatsapp Web</a>
        `;   
        const message2 = `🛍️ Ventas
Para consultas de ventas, contáctanos:
📧 Correo: ventas@linalca.com      
📞 Teléfono: +57 300 7167811
💬 WhatsApp: <a href="https://api.whatsapp.com/send/?phone=%2B573007167811&text=%C2%A1Hola%21+Estoy+navegando+en+www.linalca.com+y+solicito+m%C3%A1s+informaci%C3%B3n.&type=phone_number&app_absent=0" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Whatsapp Web</a>
        `;
        callback(message, true, showMenuOptions, seleccion, message2); 
     }
     handleRecibirSoporteTecnico(callback, showMenuOptions) {
        const seleccion = `Como recibir soporte tecnico`;  
        const message = `Si necesitas registrar casos y recibir asistencia de nuestra mesa de ayuda, ingresa a <a href="https://itsupport.linalca.com:9443/USDKv8/#!/login/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">nuestro portal de soporte</a>. Allí podrás crear y gestionar tus solicitudes de manera conveniente y eficiente. Si tienes alguna pregunta adicional o necesitas más información también puedes comunicarte al numero +57 (601) 635 10 55 opc. 1 y al correo electrónico solicitudes@linalca.com. 💼🔧👨‍💻`;              
        
            const message2 = `<a href="${static_url}imagenes/CanalesDeComunicacion.png" target="_blank"><img src="${static_url}imagenes/CanalesDeComunicacion.png" alt="Canales de comunicación" style="width: 250px; height: auto;"></a>`;
            
        callback(message, true,showMenuOptions, seleccion, message2);
    }    
             
    handleNuestrasSoluciones(callback, showMenuOptions) {        
        const seleccion = `Cuales son nuestras soluciones.`;        
        const message = `🏙️ RENTING DE TECNOLOGÍA
        Nuestro modelo DaaS (Device as a Service), es una solución completa que combina, software, hardware y una gestión proactiva de servicios, e infraestructura adaptativa.  <a href="https://www.linalca.com/daas/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Mas información</a> ! 🚀 `;
        const message2 = `🤝 DISPOSITIVOS 360 IT
        Brindamos soluciones y equipamiento a la medida de sus necesidades con precios competitivos, y las marcas más reconocidas del mercado, con los más altos estándares de calidad y logísticos. <a href="https://www.linalca.com/soluciones-integrales-2/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Mas información</a> ! 🚀 `;   
        const message3 = ` 📈 GESTIÓN DE SOLUCIONES IT
        Acompañamos su transformación digital y tecnológica, brindándole soluciones de servicios tecnológicos para la optimización tiempos, recursos y procesos, aumentando la productividad y ahorro de costos del área de IT. <a href="https://www.linalca.com/proyectos-y-servicios/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Mas información</a> ! 🚀 `;
        const message4 = ` 📈 SUSCRIPCIONES
        Somos aliados con los líderes mundiales del mercado de software con el objetivo de ayudarlos en su trasformación digital. <a href="https://www.linalca.com/proyectos-y-servicios/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Mas información</a> ! 🚀 `;
       
        callback(message, true, showMenuOptions, seleccion, message2, message3, message4); // Pasar el tercer parámetro
        
    }

    handleNuestroEquipo(callback, showMenuOptions) {        
        const seleccion = `Como formar parte de nuestro equipo.`;        
        const message = `🌟¡Únete a Nuestro Equipo Tecnológico! 🌟
        Somos líderes en tecnología con más de 180 profesionales apasionados y altamente calificados. 🚀 Si buscas un desafío emocionante,
        ¡Tu talento es lo que necesitamos! 💼💡
        Registra tu hoja de vida en  <a href="https://empleo.linalca.com/" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold; font-size: 16px;">Nuestra página web</a> prepárate para el futuro. 📝💼
        ¡O envíanos tu hoja de vida a trabajaconnosotros@linalca.com y nos pondremos en contacto contigo.🤝🌟
        Juntos construiremos innovación.`;
        callback(message, true, showMenuOptions, seleccion); // Pasar el tercer parámetro
            }

    handleMenuprincipal(callback, showMenuOptions) {        
                const seleccion = `Menú principal`;        
                const message = `Para continuar por favor selecciona la opción que necesites`;
                callback(message, true, showMenuOptions, seleccion); // Pasar el tercer parámetro
                
            }

    getConversation() {
        return this.conversation;
    }
}

export default PreguntasFrecuentes;
