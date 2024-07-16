from app import create_app
from flask_cors import CORS
app = create_app()
# CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:8080"}})
if __name__ == '__main__':
    app.run(debug=True)
