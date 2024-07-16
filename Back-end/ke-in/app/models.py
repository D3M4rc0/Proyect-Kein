from . import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    provincia = db.Column(db.String(50), nullable=False)
    tipo_usuario = db.Column(db.Enum('Cliente', 'Distribuidor'), nullable=False)
    rol = db.Column(db.Enum('Usuario', 'Admin'), nullable=False, default='Usuario')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email,
            'password': self.password,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat(),
            'provincia': self.provincia,
            'tipo_usuario': self.tipo_usuario,
            'rol': self.rol
        }

# Otros modelos: Producto, Venta, Categoria, DetalleVenta, Pedido, Despacho

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    imagen_url = db.Column(db.String(255))
    rating = db.Column(db.Numeric(2, 1))
    fecha_creacion = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'stock': self.stock,
            'id_categoria': self.categoria_id,
            'imagen_url': self.imagen_url,
            'rating': self.rating,
            'fecha_creacion': self.fecha_creacion
        }

class Venta(db.Model):
    __tablename__ = 'ventas'
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    fecha_venta = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    total = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'fecha_venta': self.fecha_venta,
            'total': self.total
        }

class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre
        }

class DetalleVenta(db.Model):
    __tablename__ = 'detalleventas'
    id = db.Column(db.Integer, primary_key=True)
    id_venta = db.Column(db.Integer, db.ForeignKey('ventas.id'), nullable=False)
    id_producto = db.Column(db.Integer, db.ForeignKey('productos.id'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'venta_id': self.id_venta,
            'producto_id': self.id_producto,
            'cantidad': self.cantidad,
            'precio_unitario': self.precio_unitario
        }

class Pedido(db.Model):
    __tablename__ = 'pedidos'
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    id_venta = db.Column(db.Integer, db.ForeignKey('ventas.id'), nullable=False)
    fecha_pedido = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    estado = db.Column(db.Enum('Pendiente', 'Enviado', 'Entregado'), nullable=False, default='Pendiente')
    direccion_envio = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'id_venta': self.id_venta,
            'fecha_pedido': self.fecha_pedido,
            'estado': self.estado,
            'direccion_envio': self.direccion_envio
        }

class Despacho(db.Model):
    __tablename__ = 'despacho'
    id = db.Column(db.Integer, primary_key=True)
    id_pedido = db.Column(db.Integer, db.ForeignKey('pedidos.id'), nullable=False)
    fecha_despacho = db.Column(db.TIMESTAMP)
    fecha_entrega = db.Column(db.TIMESTAMP)
    estado = db.Column(db.Enum('Pendiente', 'Enviado', 'Entregado'), nullable=False, default='Pendiente')

    def to_dict(self):
        return {
            'id': self.id,
            'pedido_id': self.id_pedido,
            'fecha_despacho': self.fecha_despacho,
            'fecha_entrega': self.fecha_entrega,
            'estado': self.estado
        }
