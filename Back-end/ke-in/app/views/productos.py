from flask import Blueprint, jsonify, request
from app.models import Producto
from app import db

productos_bp = Blueprint('productos', __name__, url_prefix='/api/productos')

@productos_bp.route('/', methods=['GET'])
def index():
    productos = Producto.query.all()
    productos_json = [producto.to_dict() for producto in productos]
    return jsonify(productos_json)

@productos_bp.route('/<int:id>', methods=['GET'])
def show(id):
    producto = Producto.query.get_or_404(id)
    return jsonify(producto.to_dict())

@productos_bp.route('/', methods=['POST'])
def create():
    data = request.get_json()
    nuevo_producto = Producto(**data)
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify({'message': 'Producto creado exitosamente', 'id': nuevo_producto.id}), 201

@productos_bp.route('/<int:id>', methods=['PUT'])
def update(id):
    producto = Producto.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(producto, key, value)
    db.session.commit()
    return jsonify({'message': 'Producto actualizado exitosamente'})

@productos_bp.route('/<int:id>', methods=['DELETE'])
def delete(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado exitosamente'})
