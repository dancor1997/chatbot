from flask import Flask, render_template, request, jsonify
from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
import sqlite3
import openai
import numpy as np
import pickle
from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity

app = Flask(__name__)
openai.api_key = "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"

# Cargar el modelo de embeddings
model = "text-embedding-ada-002"

# Crear una conexión global a la base de datos
conn = sqlite3.connect('embeddings.db')
cursor = conn.cursor()

# Realizar una consulta inicial y almacenar los resultados en una variable global
global_data = []

def cargar_datos_globales():
    global global_data
    cursor.execute("SELECT embedding, texto_original FROM documentos")
    registros = cursor.fetchall()
    global_data = [list(registro) for registro in registros]
   
    
# Llamar a la función de carga durante la inicialización de la aplicación
cargar_datos_globales()

@app.route('/obtener_respuesta_openai', methods=['POST'])
def obtener_respuesta():
    try:
        # Lista para almacenar las similitudes
        similitudes = []
        data = request.json
        pregunta = data['pregunta']

        # Obtener el embedding de la pregunta
        pregunta_embedding = get_embedding(pregunta, engine="text-embedding-ada-002")        

       # Inicializar un contador para el número de registros deserializados
        registros_deserializados = 0
        mejor_similitud = None
        mejor_embedding = None
        mejor_texto = None

        # Calcular la similitud con cada registro de la base de datos
        for embedding, texto_original in global_data:
            embedding_lista = pickle.loads(embedding)   
            # Incrementar el contador de registros deserializados
            registros_deserializados += 1
            # Imprimir el número total de registros deserializados
            print("Total de registros deserializados:", registros_deserializados)
            # Calcular la similitud coseno y agregarla a la lista de similitudes
            similitud = cosine_similarity(embedding_lista, pregunta_embedding)
            
           # Verificar si esta similitud es mejor que la anterior
            if mejor_similitud is None or similitud > mejor_similitud:
                mejor_similitud = similitud
                mejor_embedding = embedding_lista
                mejor_texto = texto_original  # Guardar el mejor texto
        print("la mejor similitud: ", mejor_similitud)        
        print("el mejor texto es: ", mejor_texto)
        
        if mejor_texto:
                      
                # Aquí puedes enviar la respuesta_contexto_local a OpenAI para obtener una respuesta mejorada
                response_openai = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Modelo específico
                messages=[
                {"role": "system", "content": "responde unicamente usando el siguiente contexto: " + mejor_texto + "Si no tienes la respuesta del contexto dile: No te entendi, puedes reformular tu pregunta por favor" },
                {"role": "user", "content": pregunta},
                ],
                temperature=0.8,
                max_tokens=100,
                frequency_penalty=0.5,
                presence_penalty=0.5                
            )

                # Extraer la respuesta generada por OpenAI
                respuesta_api = response_openai.choices[0].message['content'].strip()
        else:
                
            respuesta_api = "Reformula tu pregunta de manera más específica."

        return jsonify({'respuesta': respuesta_api})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# funcion para obtener los nombres de las columnas de las listas
#def get_column_names(list_obj, ctx):
   # item = list_obj.get_item_by_id(12)  # Obtener el primer elemento de la lista
   # ctx.load(item)
   # ctx.execute_query()
   # column_names = item.properties.keys()  # Obtener los nombres de las propiedades
   # return column_names

   
def connect_to_sharepoint(data):
    site_url = 'https://linalcasa.sharepoint.com/sites/Intranet/ProcesosAutomatizados'
    username = 'dcortes@linalca.com'
    password = 'Linalca2023++*'

    auth_context = AuthenticationContext(url=site_url)
    auth_context.acquire_token_for_user(username, password)
    
    ctx = ClientContext(site_url, auth_context)
    web = ctx.web
    ctx.load(web)
    ctx.execute_query()

    list_title = "FQRS"
    target_list = web.lists.get_by_title(list_title)
    
    # imprimir nombre de las columnas 
    #column_names = get_column_names(target_list, ctx)  # Obtener nombres de columnas
    #print("Columnas de la lista:", column_names)
    
    item_properties = {
        'Tipo_x0020_de_x0020_FQRS': data['clientSelectSol'], 
        'Raz_x00f3_n_x0020_Social_x0020_C': data['clientRazonSocial'], 
        'Email_x0020_Cliente': data['clientEmailCor'],
        'Tel_x00e9_fonooM_x00f3_vil': data['clientCelularCor'],
        'Descripci_x00f3_n_x0020_o_x0020_': data['clientDescripcion'],
        'Fuente_x0020_FQRS': 'Chat Bot',
        'Nombre_x0020_del_x0020_contacto_': data['clientNomContacto']
    }
    print("item_properties:", item_properties)

    new_item = target_list.add_item(item_properties)
    ctx.execute_query()

    # Obtener el ID del nuevo elemento
    new_item_id = new_item.properties['ID']

    return new_item_id

@app.route('/enviar_formulario', methods=['POST'])
def enviar_formulario():
    try:
        data = request.json
        print("Datos recibidos:", data)
        
        new_item_id = connect_to_sharepoint(data)  # Llamar a la función con los datos
        response = {
            'message': 'Datos enviados correctamente',
            'new_item_id': new_item_id            
        }
        print("radicado numero", new_item_id)
        return jsonify(response)

    except Exception as e:
        response = {'error': str(e)}
        print("Error:", e)
        return jsonify(response), 500        

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=4000)