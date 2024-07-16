import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Añade el directorio raíz del proyecto al sys.path
sys.path.append(str(Path(__file__).resolve().parents[1]))

# Cargar las variables de entorno del archivo .env
load_dotenv()
