 const baseURLProductos = 'http://127.0.0.1:5000/api/productos/';

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); // Cargar productos por defecto al iniciar la página
});

async function cargarProductos() {
    try {
        const response = await fetch(baseURLProductos);
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos) {
    const mainContent = document.getElementById('content');
    mainContent.innerHTML = `
        <h2>Gestión de Productos</h2>
        <form id="form-producto">
            <input type="hidden" id="id" name="id">
            <input type="text" id="nombre" name="nombre" placeholder="Nombre">
            <textarea id="descripcion" name="descripcion" placeholder="Descripción"></textarea>
            <input type="number" id="precio" name="precio" placeholder="Precio">
            <input type="number" id="stock" name="stock" placeholder="Stock">
            <select id="id_categoria" name="id_categoria">
                <option value="Barrita cereal">Barrita de cereal</option>
                <option value="Granola">Granola</option>
                <option value="Otro">Otro</option>
            </select>
            <input type="text" id="imagen_url" name="imagen_url" placeholder="URL de Imagen">
            <button type="button" id="btn-save-producto">Guardar Producto</button>
            <button type="button" id="btn-update-producto" style="display: none;">Actualizar Producto</button>
            <button type="button" id="btn-cancelar">Cancelar</button>
        </form>
        <table id="tabla-productos">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Fecha de Creación</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tbody-table-productos">
                ${productos.map(producto => `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>${producto.id_categoria ? producto.id_categoria : 'No especificado'}</td>
                        <td>${producto.fecha_creacion ? new Date(producto.fecha_creacion).toLocaleDateString() : 'No disponible'}</td>
                        <td><img src="${producto.imagen_url}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>
                            <button class="btn-editar" data-id="${producto.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Configurar eventos para los botones de editar y eliminar
    const btnEditar = mainContent.querySelectorAll('.btn-editar');
    const btnEliminar = mainContent.querySelectorAll('.btn-eliminar');

    btnEditar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idProducto = btn.dataset.id;
            const producto = await obtenerProducto(idProducto);
            llenarFormularioProducto(producto);
        });
    });

    btnEliminar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idProducto = btn.dataset.id;
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                await eliminarProducto(idProducto);
                cargarProductos();
            }
        });
    });

    // Configurar evento para el botón de guardar producto
    const btnGuardarProducto = document.getElementById('btn-save-producto');
    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener('click', async () => {
            await guardarProducto();
        });
    }

    // Configurar evento para el botón de actualizar producto
    const btnActualizarProducto = document.getElementById('btn-update-producto');
    if (btnActualizarProducto) {
        btnActualizarProducto.addEventListener('click', async () => {
            await actualizarProducto();
        });
    }

    // Configurar evento para el botón de cancelar
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetFormularioProducto();
        });
    }
}

async function obtenerProducto(id) {
    try {
        const response = await fetch(`${baseURLProductos}${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }
        const producto = await response.json();
        return producto;
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
    }
}

async function guardarProducto() {
    const formProducto = document.getElementById('form-producto');
    const formData = new FormData(formProducto);
    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        id_categoria: formData.get('id_categoria'),
        imagen_url: formData.get('imagen_url')
    };

    try {
        const response = await fetch(baseURLProductos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }
        resetFormularioProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
    }
}

async function actualizarProducto() {
    const formProducto = document.getElementById('form-producto');
    const formData = new FormData(formProducto);
    const idProducto = formData.get('id');
    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        id_categoria: formData.get('id_categoria'),
        imagen_url: formData.get('imagen_url')
    };

    try {
        const response = await fetch(`${baseURLProductos}${idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }
        resetFormularioProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
}

async function eliminarProducto(id) {
    try {
        const response = await fetch(`${baseURLProductos}${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        cargarProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

function llenarFormularioProducto(producto) {
    const formProducto = document.getElementById('form-producto');
    formProducto.querySelector('#id').value = producto.id;
    formProducto.querySelector('#nombre').value = producto.nombre;
    formProducto.querySelector('#descripcion').value = producto.descripcion;
    formProducto.querySelector('#precio').value = producto.precio;
    formProducto.querySelector('#stock').value = producto.stock;
    formProducto.querySelector('#id_categoria').value = producto.id_categoria;
    formProducto.querySelector('#imagen_url').value = producto.imagen_url;

    // Mostrar botón de actualizar y ocultar el de guardar
    formProducto.querySelector('#btn-save-producto').style.display = 'none';
    formProducto.querySelector('#btn-update-producto').style.display = 'inline-block';
}

function resetFormularioProducto() {
    const formProducto = document.getElementById('form-producto');
    formProducto.reset();

    // Ocultar botón de actualizar y mostrar el de guardar
    formProducto.querySelector('#btn-save-producto').style.display = 'inline-block';
    formProducto.querySelector('#btn-update-producto').style.display = 'none';
}
