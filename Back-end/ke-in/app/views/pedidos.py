from flask import Blueprint, jsonify, request
from app.models import Pedido
from app import db

pedidos_bp = Blueprint('pedidos', __name__, url_prefix='/api/pedidos')

@pedidos_bp.route('/', methods=['GET'])
def index():
    pedidos = Pedido.query.all()
    pedidos_json = [pedido.to_dict() for pedido in pedidos]
    return jsonify(pedidos_json)

@pedidos_bp.route('/<int:id>', methods=['GET'])
def show(id):
    pedido = Pedido.query.get_or_404(id)
    return jsonify(pedido.to_dict())

@pedidos_bp.route('/', methods=['POST'])
def create():
    data = request.get_json()
    nuevo_pedido = Pedido(**data)
    db.session.add(nuevo_pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido creado exitosamente', 'id': nuevo_pedido.id}), 201

@pedidos_bp.route('/<int:id>', methods=['PUT'])
def update(id):
    pedido = Pedido.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(pedido, key, value)
    db.session.commit()
    return jsonify({'message': 'Pedido actualizado exitosamente'})

@pedidos_bp.route('/<int:id>', methods=['DELETE'])
def delete(id):
    pedido = Pedido.query.get_or_404(id)
    db.session.delete(pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido eliminado exitosamente'})
