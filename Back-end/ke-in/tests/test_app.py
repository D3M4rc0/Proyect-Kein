import pytest
from app import create_app, db
from app.models import Usuario, Pedido, Despacho

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'
    })

    with app.app_context():
        # Crear todas las tablas en el orden correcto
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

def test_usuario_model(client):
    usuario = Usuario(nombre='John', apellido='Doe', email='john@example.com', password='password', fecha_nacimiento='2000-01-01', provincia='Buenos Aires', tipo_usuario='Cliente', rol='Usuario')
    db.session.add(usuario)
    db.session.commit()
    assert usuario.id is not None
    assert usuario.to_dict() == {
        'id': usuario.id,
        'nombre': 'John',
        'apellido': 'Doe',
        'email': 'john@example.com',
        'fecha_nacimiento': '2000-01-01',
        'provincia': 'Buenos Aires',
        'tipo_usuario': 'Cliente',
        'rol': 'Usuario'
    }

# Ajustar esta prueba según las rutas y lógica implementadas
def test_index(client):
    response = client.get('/api/usuarios/')
    assert response.status_code == 404  # Ajusta el código de estado según tu implementación
    assert 'message' in response.json  # Asegúrate de manejar correctamente el JSON de respuesta

# Implementar esta prueba después de desarrollar la lógica de creación de usuario en tu API
def test_create_usuario(client):
    response = client.post('/api/usuarios/', json={
        'nombre': 'Jane',
        'apellido': 'Doe',
        'email': 'jane@example.com',
        'password': 'password',
        'fecha_nacimiento': '1990-01-01',
        'provincia': 'Buenos Aires',
        'tipo_usuario': 'Cliente',
        'rol': 'Usuario'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'Usuario creado exitosamente'
    assert 'id' in response.json
