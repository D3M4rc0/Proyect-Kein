from flask import Blueprint, jsonify, request
from app.models import Usuario
from app import db
import logging

usuarios_bp = Blueprint('usuarios', __name__, url_prefix='/api/usuarios')

@usuarios_bp.route('/', methods=['GET'])
def index():
    usuarios = Usuario.query.all()
    usuarios_json = [usuario.to_dict() for usuario in usuarios]
    return jsonify(usuarios_json)

@usuarios_bp.route('/<int:id>', methods=['GET'])
def show(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify(usuario.to_dict())

@usuarios_bp.route('/', methods=['POST'])
def create():
    data = request.get_json()
    logging.debug(f'Received data for new user: {data}')
    try:
        nuevo_usuario = Usuario(**data)
        logging.debug(f'Created user object: {nuevo_usuario}')
        db.session.add(nuevo_usuario)
        db.session.commit()
        logging.debug(f'User added to the database with ID: {nuevo_usuario.id}')
        return jsonify({'message': 'Usuario creado exitosamente', 'id': nuevo_usuario.id}), 201
    except Exception as e:
        logging.error(f'Error creating user: {e}')
        return jsonify({'error': str(e)}), 400
@usuarios_bp.route('/<int:id>', methods=['PUT'])
def update(id):
    usuario = Usuario.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(usuario, key, value)
    db.session.commit()
    return jsonify({'message': 'Usuario actualizado exitosamente'})

@usuarios_bp.route('/<int:id>', methods=['DELETE'])
def delete(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuario eliminado exitosamente'})
