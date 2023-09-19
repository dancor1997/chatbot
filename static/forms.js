// forms.js
import { sendChatBtn,chatbox, createChatLi, conversation,crearChecklist, enviarDatosASharePoint, MostrarOpcionesIniciales} from './main.js';
//variables de elementos de entrada 
let nameInput; // Variable para el elemento de entrada del nombre
let celularCorInput;
let emailCorInput;
let descripcion;
let razonSocial;
let nomContacto;
let selectSolInput;
let userName = ""; // Declarar userName aquí como variable global
let checklistLi; // Variable global para guardar el checklist de habeas data
let clientSelectSol = "";
let clientRazonSocial = "";
let clientEmailCor = "";
let clientNomContacto = "";
let clientCelularCor = "";
let clientDescripcion = "";

export const createUserForm = (chatInput, sendChatBtn) => {
    chatInput.style.display = "none";
    sendChatBtn.style.display = "none";
    const form = document.createElement("form");
    form.id = "userInfoForm";
    form.classList.add("form");
    const nameLabel = createLabel("Ingresa tu nombre:");
    const nameInput = createInput("text", "name", true, "Nombre"); // Crear nameInput aquí
    const submitButton = createSubmitButton("Enviar");
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(submitButton);
    return form;
};

export const createClientForm = (chatInput, sendChatBtn,) => {    // Crea formulario del cliente
    chatInput.style.display = "none";
    sendChatBtn.style.display = "none";
    const form = document.createElement("form");
    form.id = "clientInfoForm";
    form.classList.add("form");      
    // Crear la lista desplegable del tipo de solicitud
    const selectSol = createLabel("Seleccione el tipo de solicitud.");
    const selectSolOptions = ["Felicitacion", "Queja", "Reclamo", "Solicitud"];
    const selectSolInput = createSelectInput(selectSolOptions, "tipoSolicitud", "Seleccione el tipo de solicitud."); // Asignamos el id "tipoSolicitud"
    // Crear la lista desplegable del tipo de documento de identificacion   
    razonSocial = createInput("text", "razon social", true, "Nombre/Razón social."); // Asignar a la variable
    nomContacto = createInput("text", "nombre contacto", true, "Nombre de contacto."); // Asignar a la variable   
    emailCorInput = createInput("email", "email corporativo", true, "Email corporativo."); // Asignar a la variable
    const celularCorInput = createInput("tel", "celular corporativo", true, "Número de celular corporativo.");
    
    // Agregar la validación personalizada para el campo de celular
    celularCorInput.addEventListener("input", validarCelular);

    function validarCelular(event) {
        const celularValue = event.target.value;
        
        // Expresión regular para validar que comienza con el número 3 y tiene exactamente 10 dígitos
        const celularPattern = /^3\d{9}$/;

        if (celularPattern.test(celularValue)) {
            event.target.setCustomValidity(""); // La entrada es válida
        } else {
            event.target.setCustomValidity("El número de celular debe comenzar con 3 y tener 10 dígitos."); // Establece un mensaje de error personalizado
        }
    }

    descripcion = createTextarea("desc",  true, "Descripción solicitud."); // Asignar a la variable
    const submitButton = createSubmitButton("Enviar");




    form.appendChild(selectSol);
    form.appendChild(selectSolInput);    
    form.appendChild(razonSocial);
    form.appendChild(nomContacto);
    form.appendChild(emailCorInput);
    form.appendChild(celularCorInput);
    form.appendChild(descripcion);
    form.appendChild(submitButton);
    return form;
};

const createLabel = (text) => { // Función para crear un label
    const label = document.createElement("label");
    label.style.fontWeight = "bold";
    label.textContent = text;
    return label;
};
const createInput = (type, id, required, placeholder) => {   
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.required = required;
    input.placeholder = placeholder;
    return input;
};
// Función para crear un select input
const createSelectInput = (options, id, placeholder) => {
    const select = document.createElement("select");
    // Agregar la opción de fondo
    const placeholderOption = document.createElement("option");
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = placeholder || "Seleccione"; // Puedes personalizar el mensaje aquí
    select.appendChild(placeholderOption);
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        select.appendChild(optionElement);
    });
    // Asignar el id al select
    select.id = id;
    return select;
};
const createTextarea = (id, required, placeholder) => {
    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.required = required;
    textarea.placeholder = placeholder;
    return textarea;
};

// Función para crear un botón de envío
const createSubmitButton = (text) => {
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = text;
    button.classList.add("enviar-button");
    return button;
};
export const initializeUserForm = () => { // Función para inicializar el formulario de usuario
    try {
        const userForm = createUserForm(chatInput, sendChatBtn);
        chatbox.appendChild(userForm);
        userForm.addEventListener("submit", EnvInfUsuario);
    } catch (error) {
        console.error("Error al inicializar el formulario de usuario:", error);
        // Realiza algún manejo de error adecuado aquí, como mostrar un mensaje de error al usuario
    }
};
export const initializeclientForm = () => {    // Función para inicializar el formulario de cliente
    try {
        const clientForm = createClientForm(chatInput, sendChatBtn);
        chatbox.appendChild(clientForm);
        clientForm.addEventListener("submit", EnvInfCliente);
    } catch (error) {
        console.error("Error al inicializar el formulario de cliente:", error);
        // Realiza algún manejo de error adecuado aquí, como mostrar un mensaje de error al usuario
    }
};

export const EnvInfUsuario = async (event) => {    //Funcion para enviar datos del formulario del usuario
    event.preventDefault();
    try {
        const nameInput = document.getElementById("name");        
        userName = nameInput.value.trim(); // Asignar el valor a la variable global userName    
        console.log("userName:", userName);        
        const UserForm = document.getElementById("userInfoForm");
        UserForm.style.display = 'none';    
        const formData = {
            NombreUsuario: userName,           
        };   
        chatbox.appendChild(createChatLi(`${userName}`, "entrada"));     
        chatbox.appendChild(createChatLi(`Hola ${userName}, gusto en conocerte!`, "salida"));
        const checklistLi = crearChecklist();
        chatbox.appendChild(checklistLi);
    } catch (error) {
        console.error("Error al manejar el envío del formulario de usuario:", error);
    }
};

export const EnvInfCliente = async (event) => {    //Funcion para enviar datos del formulario del cliente
    event.preventDefault(); 
    try {             
        const razonSocial = document.getElementById("razon social").value.trim();
        const nomContacto = document.getElementById("nombre contacto").value.trim();
        const emailCorInput = document.getElementById("email corporativo").value.trim();
        const celularCorInput = document.getElementById("celular corporativo").value.trim();
        const descripcion = document.getElementById("desc").value.trim();
        const selectSolInput = document.getElementById("tipoSolicitud").value.trim();                    
        clientSelectSol = selectSolInput.value;
        clientRazonSocial = razonSocial;      
        clientNomContacto = nomContacto;
        clientEmailCor = emailCorInput;
        clientCelularCor = celularCorInput;        
        clientDescripcion = descripcion;
        const clientForm = document.getElementById("clientInfoForm");
        clientForm.style.display = 'none'; 
        // Crea un objeto con los valores
        const formData = {            
            clientSelectSol: selectSolInput,
            clientRazonSocial:  razonSocial,   
            clientNomContacto: nomContacto,    
            clientEmailCor: emailCorInput,
            clientCelularCor: celularCorInput,
            clientDescripcion: descripcion            
        };            
        console.log("formData:", formData); // Verifica los datos en formData        
        const response = await enviarDatosASharePoint(formData);
        chatbox.appendChild(createChatLi("formulario enviado!", "entrada"));                
        if (response && response.ok) {
            const responseData = await response.json(); // Leer el JSON aquí
            const newItemId = responseData.new_item_id;
            chatbox.appendChild(createChatLi(`Estimado(a) ${userName} Se formalizo en el sistema de gestión la FQRS ${newItemId} se estará dando gestión y respuesta a esta en los próximos 3 días hábiles.`, "salida"));
            chatbox.appendChild(createChatLi("Si desea conocer más información a cerca de su solicitud, comuníquese al siguiente número celular 3188195639 de lunes a viernes en el horario de 7:30 am a 5:45 pm. Gracias por su darnos su comentario, su opinión es muy importante para nosotros. ", "salida"));
            chatbox.appendChild(createChatLi("Te puedo ayudar en algo más?", "salida"));
            MostrarOpcionesIniciales(["Menú principal", "Terminar chat"]);
        } else {
            console.error('Error al enviar los datos a SharePoint');
        }
    } catch (error) {
        console.error("Error al manejar el envío del formulario de cliente:", error);
        // Realiza algún manejo de error adecuado aquí, como mostrar un mensaje de error al usuario
    }
};

