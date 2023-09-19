import os
import openai
import sqlite3
import pickle
import docx2txt
import PyPDF2
from openai.embeddings_utils import get_embedding

# Función para dividir el texto en párrafos
def dividir_en_parrafos(texto):
    return texto.split('\n\n')  # Dividir en párrafos por doble salto de línea

# Ruta al directorio que contiene los archivos Word y PDF
directorio = 'documentos'

# Configura tu clave de API de OpenAI
openai.api_key = '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'

# Cargar el modelo "text-embedding-ada-002" de OpenAI
model_name = "text-embedding-ada-002"

# Lista para almacenar los datos de todos los documentos
documentos = []

# Iterar a través de los archivos en el directorio
for archivo in os.listdir(directorio):
    ruta_completa = os.path.join(directorio, archivo)
    
    if archivo.endswith('.docx'):
        print("procesando el archivo: ", archivo)
        # Procesar documentos Word
        texto_docx = docx2txt.process(ruta_completa)
        
        # Dividir el texto en párrafos
        parrafos = dividir_en_parrafos(texto_docx)
        
        # Crear un embedding para cada párrafo y almacenarlos en la lista de documentos
        for parrafo in parrafos:
            embedding = get_embedding(parrafo, engine="text-embedding-ada-002")
            documentos.append({'texto_original': parrafo, 'embedding': embedding})

    elif archivo.endswith('.pdf'):
        print("procesando el archivo: ", archivo)
        # Procesar documentos PDF
        texto_pdf = ""
        
        with open(ruta_completa, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for pagina in pdf_reader.pages:
                texto_pdf += pagina.extract_text()
        
        # Dividir el texto en párrafos
        parrafos = dividir_en_parrafos(texto_pdf)
        
        # Crear un embedding para cada párrafo y almacenarlos en la lista de documentos
        for parrafo in parrafos:
            embedding = get_embedding(parrafo, engine="text-embedding-ada-002")
            documentos.append({'texto_original': parrafo, 'embedding': embedding})

# Guardar los documentos en la base de datos SQLite
conn = sqlite3.connect("embeddings.db")
cursor = conn.cursor()

# Crear una tabla para almacenar los documentos
cursor.execute('''CREATE TABLE IF NOT EXISTS documentos
                  (documento_id INTEGER PRIMARY KEY, texto_original TEXT, embedding BLOB)''')

# Insertar los documentos en la tabla
for documento in documentos:
    texto_original = documento['texto_original']
    embedding_dict = documento['embedding']
    embedding_json = pickle.dumps(embedding_dict)
    cursor.execute("INSERT INTO documentos (texto_original, embedding) VALUES (?, ?)", (texto_original, embedding_json))

# Guardar los cambios en la base de datos
conn.commit()

# Cerrar la conexión a la base de datos
conn.close()
