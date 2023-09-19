import {       
    initializeUserForm,initializeclientForm} from './forms.js';
// Obtener referencias a elementos del DOM
const openChatButton = document.getElementById('openChatButton');
export const chatbot = document.querySelector('.chatbot');
const chatMinimizeButton = document.getElementById('minimizeButton');
const reloadButton = document.getElementById('reloadButton');
const chatInput = document.querySelector(".chat-input textarea");
export const sendChatBtn = document.querySelector(".chat-input span");
export const chatbox = document.querySelector(".chatbox");
const nameForm = document.getElementById("nameForm");

import RegistroFQRS from './RegistroFQRS.js';
import PreguntasFrecuentes from './PreguntasFrecuentes.js';
// Variables globales para el control del chat
let chatbotVisible = false;
let chatMinimized = false;
let conversationIndex = -1;
let optionsInput;
let userselectedOptionChecklist = "";
let userMessage = "";
let userName = ""; // Declarar userName aquí como variable global
let previousConversationIndex = -1; // Variable para almacenar la posición principal en la conversación
let checklistLi; // Variable global para guardar el checklist de habeas data
let selectedOption = "";
let conversacionFinalizada = false; // Variable de estado

const inputInitHeight = chatInput.scrollHeight;
// opciones de flujo
export const optionsMessages = [
    "Registro de FQRS",
    "Asesoria comercial",
    "Preguntas frecuentes"
];
export const conversation = [ // ARREGLO de Conversación con el bot
    { type: "salida", message: "¡Hola! Soy Lisa,👋 tu agente virtual. para comenzar por favor indícame los siguientes datos" },
    // ... otras conversaciones originales ...
].concat(
    RegistroFQRS,   
    PreguntasFrecuentes    
    );
export const createChatLi = (message, className) => { // Crea un elemento <li> para los mensajes del chat
    try {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = '';
        if (className === "salida") {
            chatContent = `<img src="${static_url}imagenes/ChatBot-AMI.png" alt="Imagen del Bot"><p>${message}</p>`;
        } else if (className === "entrada") {
            chatContent = `<img src="${static_url}imagenes/icono_cliente.png" alt="Imagen del usuario"><p>${message}</p>`;
        }           
        chatLi.innerHTML = chatContent;
        chatbox.appendChild(chatLi); // Agregar el chatLi al chatbox
        chatbox.scrollTo(0, chatbox.scrollHeight); // Asegurarse de desplazarse al final del chatbox
        return chatLi;
    } catch (error) {
        console.error("Error al crear el elemento <li> del chat:", error);
        return null;
    }
};
const createInitialMessage = () => { // Crea msj inicial
    const initialMessage = conversation[0].message;
    chatbox.appendChild(createChatLi(initialMessage, "salida"));
    initializeUserForm(); // También llama a la función aquí para mostrar el formulario
};
export const crearChecklist = () => { // Función para crear el checklist de aceptación de habeas data
    try {
        chatbox.appendChild(createChatLi("Para continuar, por favor acepta nuestra política de tratamiendo de datos", "salida"));
        checklistLi = document.createElement("li"); // Asignar valor en esta función
        checklistLi.classList.add("chat", "salida");
        const checklistContent = `
            <img src="${static_url}imagenes/ChatBot-AMI.png" alt="Imagen del Bot">
            <div class="checklist-container">
                <label><input type="radio" name="checklist" value="Acepto"> He leído y acepto la política de datos personales <a href="https://www.linalca.com/tratamiento-de-datos/" target="_blank"> Más información </a>.</label>
                <br>
                <button class="checklist-button"><b>Comencemos</b></button>
            </div>`;
        checklistLi.innerHTML = checklistContent;
        const checklistButton = checklistLi.querySelector(".checklist-button");
        checklistButton.addEventListener("click", handleChecklistSubmit);
        return checklistLi;
    } catch (error) {
        console.error("Error al crear el checklist:", error);
        return null; // O realiza algún manejo de error adecuado aquí
    }
};
export const handleChecklistSubmit = () => { // Función para manejar el envío del checklist
    try {
        const selectedOptionChecklist = document.querySelector('input[name="checklist"]:checked').value;
        conversation.push({ type: "entrada", message: `${selectedOptionChecklist}` });
        conversationIndex++;
        chatbox.appendChild(createChatLi("Acepto", "entrada"));
        // Mostrar el mensaje de continuar directamente
        chatbox.appendChild(createChatLi("¡Excelente! Gracias por confiar en nosotros, para continuar por favor selecciona la opción que necesites.", "salida"));
        // Eliminar el checklist del DOM
        checklistLi.remove();
        // Guardar la opción seleccionada en la variable userSelectedOption
        userselectedOptionChecklist = selectedOptionChecklist;
        // Presentar opciones y esperar la respuesta del usuario
        MostrarOpcionesIniciales(optionsMessages); // Pasar optionsMessages como argumento
    } catch (error) {
        console.error("Error en handleChecklistSubmit:", error);
    }
};
export const MostrarOpcionesIniciales = (options, showMenuPrincipalOption) => {
    try {
         // Mostrar el botón después de enviar
        chatInput.style.display = "none";
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options-container");
        optionsInput = document.createElement("div");
        optionsInput.classList.add("options-input");
        options.forEach((option) => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("option");
            optionDiv.textContent = option;
            optionDiv.addEventListener("click", () => ManOpcInicial(option));
            optionsInput.appendChild(optionDiv);
        });
        optionsContainer.appendChild(optionsInput);
        chatbox.appendChild(optionsContainer);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        if (showMenuPrincipalOption) {
            const menuPrincipalDiv = document.createElement("div");
            menuPrincipalDiv.classList.add("option");
            menuPrincipalDiv.textContent = "Menú principal";
            menuPrincipalDiv.addEventListener("click", () => ManSubOpc(() => {
            chatbox.appendChild(createChatLi("Elige una opción:", "salida"));
            MostrarOpcionesIniciales(optionsMessages, false); // No mostrar "Menú principal"
            }));
            optionsInput.appendChild(menuPrincipalDiv);
        }
    } catch (error) {
        console.error("Error al presentar opciones:", error);
    }
};
const ManOpcInicial = (opcionSeleccionada) => {
    try {
        console.log("Opción seleccionada:", opcionSeleccionada);
        optionsInput.style.display = "none";
        // Agregar el mensaje de selección al chatbox
        chatbox.appendChild(createChatLi(`${opcionSeleccionada}`, "entrada"));
        chatInput.style.display = "block";
        chatbox.scrollTo(0, chatbox.scrollHeight);
        conversationIndex++;
        selectedOption = opcionSeleccionada; // Actualizar la variable con la opción seleccionada

        if (selectedOption === "Registro de FQRS") {
            // Crear una instancia de RegistroFQRS para obtener las conversaciones
            const registroFQRSInstance = new RegistroFQRS();
            const selectedConversations = registroFQRSInstance.getConversation();

            // Agregar el mensaje "¿Cómo quieres registrar tu solicitud?" al chatbox
            chatbox.appendChild(createChatLi(selectedConversations[1].message, "salida"));

            // Mostrar las subopciones después del mensaje
            MostrarSubopciones(selectedConversations.slice(2)); // Cambio aquí

        }  else if (selectedOption === "Asesoria comercial") {
            // ... (código relacionado con la opción Comercial)
        } else if  (selectedOption === "Preguntas frecuentes") {
            // Crear una instancia de PreguntasFrecuentes para obtener las conversaciones
            const preguntasFrecuentesInstance = new PreguntasFrecuentes();
            const selectedConversations = preguntasFrecuentesInstance.getConversation();
            chatbox.appendChild(createChatLi("Selecciona la opción que necesitas", "salida"));

            // Mostrar las subopciones después del mensaje
            MostrarSubopciones(selectedConversations.slice(2));
            chatInput.style.display = "block";
            } else if (selectedOption === "Terminar chat") {
            chatbox.appendChild(createChatLi("¡Gracias por usar nuestro servicio! ¡Hasta luego!", "salida"));
            chatbotVisible = true;
        } else if (selectedOption === "Menú principal") {
            // Restablecer conversationIndex para comenzar desde el principio
            conversationIndex = -1;
            chatbox.appendChild(createChatLi("Para continuar por favor selecciona la opción que necesites", "salida"));
             // Mostrar nuevamente las opciones iniciales
             MostrarOpcionesIniciales(optionsMessages);
        } else {
            console.error("Opción no encontrada en el flujo de conversación.");
            return;
        }
    } catch (error) {
        console.error("Error en ManOpcInicial:", error);
    }
};
const MostrarSubopciones = (subopciones) => { 
    
    try {
        previousConversationIndex = conversationIndex;
        const subopcionesContainer = document.createElement("div");
        subopcionesContainer.classList.add("subopciones-container");
        optionsInput = document.createElement("div");
        optionsInput.classList.add("options-input");
        subopciones.forEach((subopcion) => {
            const subopcionDiv = document.createElement("div");
            subopcionDiv.classList.add("subopcion");
            subopcionDiv.textContent = subopcion.message;
            subopcionDiv.addEventListener("click", () => ManSubOpc(subopcion.handler));
            optionsInput.appendChild(subopcionDiv);
        });
        subopcionesContainer.appendChild(optionsInput);
        chatbox.appendChild(subopcionesContainer);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        chatInput.style.display = "block";
        sendChatBtn.style.display = "block";
    } catch (error) {
        console.error("Error al presentar subopciones:", error);
    }
};
const ManSubOpc = (subopcionHandler) => {
    try {
        
        previousConversationIndex = conversationIndex;
        subopcionHandler((message, showMenuPrincipalOption, showSubopciones, seleccion, message2, message3, message4, subSubopciones) => {
            console.log(seleccion)
            chatbox.appendChild(createChatLi(seleccion, "entrada"));                  
            chatbox.appendChild(createChatLi(message, "salida"));           
            chatInput.style.display = "block";
            chatbox.scrollTo(0, chatbox.scrollHeight);
            conversationIndex++;           
            if (seleccion === "Formulario web" ) {
                if (showMenuPrincipalOption) {
                    chatbox.appendChild(createChatLi("Te podemos ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            }  
            if (seleccion === "Como contactarnos" ) {
                chatbox.appendChild(createChatLi(message2, "salida"));
                if (showMenuPrincipalOption) {                    
                    chatbox.appendChild(createChatLi("Te podemos ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            }  

            if (seleccion === "Como formar parte de nuestro equipo." ) {
                if (showMenuPrincipalOption) {
                    chatbox.appendChild(createChatLi("Te podemos ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            } 

            if (seleccion === "Cuales son nuestras soluciones." ) {-
                chatbox.appendChild(createChatLi(message2, "salida"));
                chatbox.appendChild(createChatLi(message3, "salida"));
                chatbox.appendChild(createChatLi(message4, "salida"));
                if (showMenuPrincipalOption) {                    
                    chatbox.appendChild(createChatLi("Te podemos ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            }  
            if (seleccion === "Como recibir soporte tecnico" ) {
                if (showMenuPrincipalOption) {
                    chatbox.appendChild(createChatLi("Te podemos ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            }  
            if (seleccion === "Atencion personalizada" ) {
                if (showMenuPrincipalOption) {
                    chatbox.appendChild(createChatLi("Te puedo ayudar en algo más?", "salida"));
                    // Presentar la opción "Menú principal" y "Terminar chat" y esperar respuesta
                    MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
                }             
            }
            if (seleccion === "Formulario chat" ) {
                initializeclientForm();                
            }            
            if (seleccion === "Menú principal" ) {
                MostrarOpcionesIniciales(optionsMessages);           
            } 
            // Ocultar las subopciones
            const subopcionesContainer = document.querySelector(".subopciones-container");
            if (subopcionesContainer) {
                subopcionesContainer.style.display = "none"; // ocultar el contenedor de subopciones
            }
            if (showSubopciones) {
                // Mostrar subopciones nuevamente
                MostrarSubopciones(subopciones);                
            }  

            if (subSubopciones && subSubopciones.length > 0) {
                MostrarSubSubopciones(subSubopciones);
            } else {
                // Mostrar el cuadro de entrada para el usuario
                chatInput.style.display = "block";
            }


        });
    } catch (error) {
        console.error("Error en ManSubOpc:", error);
    }
};
const MostrarSubSubopciones = (subSubopciones) => {
    try {
        previousConversationIndex = conversationIndex;
        const subSubopcionesContainer = document.createElement("div");
        subSubopcionesContainer.classList.add("subsubopciones-container");
        subSubopciones.forEach((subSubopcion) => {
            const subSubopcionDiv = document.createElement("div");
            subSubopcionDiv.classList.add("subsubopcion");
            subSubopcionDiv.textContent = subSubopcion.message;
            subSubopcionDiv.addEventListener("click", () => ManSubSubOpc(subSubopcion.handler, subSubopcion.seleccion));
            subSubopcionesContainer.appendChild(subSubopcionDiv);
        });
        chatbox.appendChild(subSubopcionesContainer);
        chatInput.style.display = "none";
    } catch (error) {
        console.error("Error al presentar sub-subopciones:", error);
    }
};
const ManSubSubOpc = (subSubopcionHandler, subSubopcionSeleccion) => {
    try {
        previousConversationIndex = conversationIndex;
        subSubopcionHandler((message, showMenuPrincipalOption, showSubopciones, seleccion, subSubopciones) => {
            subopcion = subSubopcionSeleccion; // Actualiza el valor de subopcion
            chatbox.appendChild(createChatLi(seleccion, "entrada"));
            chatbox.appendChild(createChatLi(message, "salida"));
            chatInput.style.display = "block";
            chatbox.scrollTo(0, chatbox.scrollHeight);
            conversationIndex++;

            // ... Lógica adicional para mostrar opciones ...

            if (showSubopciones) {
                // Mostrar sub-subopciones nuevamente
                MostrarSubSubopciones(subSubopciones);
            }
            if (subSubopciones && subSubopciones.length > 0) {
                MostrarSubSubopciones(subSubopciones);
            } else {
                // Mostrar el cuadro de entrada para el usuario
                chatInput.style.display = "block";
            }


        });
    } catch (error) {
        console.error("Error en ManSubSubOpc:", error);
    }
};
const ManChat = async () => {
    console.log("Entrando en ManChat");
    try {
        if (conversacionFinalizada || conversationIndex < 0 || conversationIndex >= conversation.length) {
            return;
        }// Obtener la pregunta del usuario
        const userMessage = chatInput.value.trim();
        // Verificar si la conversación ya está finalizada
         if (conversacionFinalizada) {
            return;
        }
        // Verificar si el usuario escribió "asesor" o "Asesor"
        if (currentMessage.type === "entrada") {  
            if (userMessage!== '') {         
                // Mostrar "Escribiendo..." antes de enviar la solicitud a GPT
                chatbox.appendChild(createChatLi("Escribiendo...", "salida"));

                // Llamar a la función para obtener la respuesta de OpenAI
                const respuestaOpenAI = await obtenerRespuestaOpenAI(userMessage);

                // Eliminar el mensaje de "Escribiendo..."
                const escribiendoMessage = chatbox.querySelector(".chat.salida:last-child");
                escribiendoMessage.remove();

                // Mostrar la pregunta y la respuesta en el chatbox
                chatbox.appendChild(createChatLi(userMessage, "entrada"));
                chatbox.appendChild(createChatLi(respuestaOpenAI, "salida"));
                chatbox.appendChild(createChatLi("¿Te puedo ayudar en algo más?", "salida"));

                // Limpiar el input de la pregunta
                chatInput.value = '';
                chatbox.scrollTop = chatbox.scrollHeight;
            }
       
        }
        conversationIndex++;
        ManChat(); // Llamar recursivamente para continuar la conversación
        } catch (error) {
            console.error("Error en ManChat:", error);
        }
};


const obtenerRespuestaOpenAI = async (pregunta) => {
    try {
        const response = await fetch('/obtener_respuesta_openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pregunta }),
        });

        const responseData = await response.json();
        return responseData.respuesta;
    } catch (error) {
        console.error("Error al obtener respuesta de OpenAI:", error);
        return "Lo siento, ocurrió un error al obtener la respuesta.";
    }
};
// En el evento click del botón de enviar chat o cuando se presiona Enter en el input de chat
sendChatBtn.addEventListener('click', async (event) => {
    try {
        if (event === "Click") {
            event.preventDefault();
            const pregunta = chatInput.value.trim();
            if (pregunta === '') {
                return;
            }
            chatbox.appendChild(createChatLi(pregunta, "entrada"));
            // Mostrar "Escribiendo..." inmediatamente
            chatbox.appendChild(createChatLi("Escribiendo...", "salida"));
            chatInput.value = '';

            // Enviar la solicitud a OpenAI de manera asíncrona
            obtenerRespuestaOpenAI(pregunta)
                .then((respuesta) => {
                    // Eliminar el mensaje de "Escribiendo..."
                    const escribiendoMessage = chatbox.querySelector(".chat.salida:last-child");
                    escribiendoMessage.remove();

                    // Mostrar la pregunta y la respuesta en el chatbox
                    chatbox.appendChild(createChatLi(respuesta, "salida"));
                    chatbox.appendChild(createChatLi("Te puedo ayudar en algo más?", "salida"));

                    // Limpiar el input de la pregunta
                    
                    chatbox.scrollTop = chatbox.scrollHeight;
                })
                .catch((error) => {
                    console.error('Error al obtener la respuesta de OpenAI:', error);
                });
        }
    } catch (error) {
        console.error("Error en evento keydown del input de chat:", error);
    }
});


// Dentro del evento keydown del input de chat
chatInput.addEventListener("keydown", async (event) => {
    try {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            const pregunta = chatInput.value.trim();
            if (pregunta === '') {
                return;
            }
            chatbox.appendChild(createChatLi(pregunta, "entrada"));
            // Mostrar "Escribiendo..." inmediatamente
            chatbox.appendChild(createChatLi("Escribiendo...", "salida"));
            chatInput.value = '';

            // Enviar la solicitud a OpenAI de manera asíncrona
            obtenerRespuestaOpenAI(pregunta)
                .then((respuesta) => {
                    // Eliminar el mensaje de "Escribiendo..."
                    const escribiendoMessage = chatbox.querySelector(".chat.salida:last-child");
                    escribiendoMessage.remove();

                    // Mostrar la pregunta y la respuesta en el chatbox
                                      chatbox.appendChild(createChatLi(respuesta, "salida"));
                    chatbox.appendChild(createChatLi("Te puedo ayudar en algo más?", "salida"));

                    // Limpiar el input de la pregunta
                    
                    chatbox.scrollTop = chatbox.scrollHeight;
                })
                .catch((error) => {
                    console.error('Error al obtener la respuesta de OpenAI:', error);
                });
        }
    } catch (error) {
        console.error("Error en evento keydown del input de chat:", error);
    }
});

// Maneja el evento de minimizar o maximizar el chat
chatMinimizeButton.addEventListener('click', () => {
    try {
        chatbot.style.display = chatMinimized ? 'block' : 'none';
        chatMinimized = !chatMinimized;
        if (chatMinimized) {
            chatbotVisible = false;
        }
    } catch (error) {
        console.error("Error en evento click del botón Minimizar/Maximizar:", error);
    }
});
reloadButton.addEventListener('click', () => {  // Maneja el evento de hacer clic en el botón "Recargar"
    try {
        chatbox.innerHTML = ''; // Limpiar historial
        conversationIndex = 0; // Restablecer el índice de la conversación
        createInitialMessage(); // Agregar el mensaje inicial después de limpiar
    } catch (error) {
        console.error("Error en evento click del botón Recargar:", error);
    }
});
openChatButton.addEventListener('click', () => {    // Maneja el clic en el botón "Abrir Chat"
    if (!chatbotVisible) {
        if (conversationIndex === -1) {
            chatbox.innerHTML = '';
            createInitialMessage(); // Llama a la función aquí
        }
        chatbot.style.display = 'block';
        chatbotVisible = true;
        chatMinimized = false;
    } else {
        chatbot.style.display = 'none';
        chatbotVisible = false;
    }
});
// Función para enviar datos a SharePoint
export const enviarDatosASharePoint = async (formData) => {
    try {
        const response = await fetch('/enviar_formulario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response && response.ok) {
            return response; // Devolver la respuesta sin leer el JSON aquí
        } else {
            console.error('Error al enviar los datos a SharePoint');
        }
    } catch (error) {
        console.error('Error en enviarDatosASharePoint:', error);
        return error; // Manejar el error devolviendo el objeto error
    }
};
