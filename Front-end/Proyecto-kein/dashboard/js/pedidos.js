 const baseURLPedidos = 'http://127.0.0.1:5000/api/pedidos/';
 document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos(); // Cargar pedidos por defecto al iniciar la página
});

async function cargarPedidos() {
    try {
        const response = await fetch(baseURLPedidos);
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        const pedidos = await response.json();
        mostrarPedidos(pedidos);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

function mostrarPedidos(pedidos) {
    const mainContent = document.getElementById('content');
    if (!mainContent) {
        console.error('Elemento mainContent no encontrado.');
        return;
    }
    mainContent.innerHTML = `
        <h2>Gestión de Pedidos</h2>
        <div id="pedidos-container">
            <table id="tabla-pedidos">
                <thead>
                    <tr>
                        <th>ID Pedido</th>
                        <th>ID Usuario</th>
                        <th>ID Venta</th>
                        <th>Fecha de Pedido</th>
                        <th>Estado</th>
                        <th>Dirección de Envío</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tbody-table-pedidos">
                    ${pedidos.map(pedido => `
                        <tr>
                            <td>${pedido.id}</td>
                            <td>${pedido.id_usuario}</td>
                            <td>${pedido.id_venta}</td>
                            <td>${new Date(pedido.fecha_pedido).toLocaleString()}</td>
                            <td>${pedido.estado}</td>
                            <td>${pedido.direccion_envio}</td>
                            <td>
                                <button class="btn-editar" data-id="${pedido.id}">Editar</button>
                                <button class="btn-eliminar" data-id="${pedido.id}">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Configurar eventos para los botones de editar y eliminar
    const btnEditar = mainContent.querySelectorAll('.btn-editar');
    const btnEliminar = mainContent.querySelectorAll('.btn-eliminar');

    btnEditar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idPedido = btn.dataset.id;
            const pedido = await obtenerPedido(idPedido);
            mostrarFormularioEdicion(pedido);
        });
    });

    btnEliminar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idPedido = btn.dataset.id;
            if (confirm('¿Estás seguro de eliminar este pedido?')) {
                await eliminarPedido(idPedido);
                cargarPedidos();
            }
        });
    });
}

async function obtenerPedido(idPedido) {
    const pedidoURL = `${baseURLPedidos}${idPedido}`;
    try {
        const response = await fetch(pedidoURL);
        if (!response.ok) {
            throw new Error('Error al obtener el pedido');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener pedido:', error);
    }
}

async function eliminarPedido(idPedido) {
    const pedidoURL = `${baseURLPedidos}${idPedido}`;
    try {
        const response = await fetch(pedidoURL, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el pedido');
        }
        cargarPedidos(); // Recargar la lista de pedidos después de eliminar
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
    }
}

function mostrarFormularioEdicion(pedido) {
    const formContainer = document.createElement('div');
    formContainer.id = 'formulario-edicion';
    formContainer.innerHTML = `
        <h2>Editar Pedido</h2>
        <form id="form-pedido">
            <input type="hidden" id="id" name="id" value="${pedido.id}">
            <label for="id_usuario">ID Usuario:</label>
            <input type="text" id="id_usuario" name="id_usuario" value="${pedido.id_usuario}" disabled>
            <label for="id_venta">ID Venta:</label>
            <input type="text" id="id_venta" name="id_venta" value="${pedido.id_venta}" disabled>
            <label for="fecha_pedido">Fecha de Pedido:</label>
            <input type="text" id="fecha_pedido" name="fecha_pedido" value="${new Date(pedido.fecha_pedido).toLocaleString()}" disabled>
            <label for="estado">Estado:</label>
            <select id="estado" name="estado">
                <option value="Pendiente" ${pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="Enviado" ${pedido.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
            </select>
            <label for="direccion_envio">Dirección de Envío:</label>
            <input type="text" id="direccion_envio" name="direccion_envio" value="${pedido.direccion_envio}">
            <button type="button" id="btn-actualizar-pedido">Actualizar Pedido</button>
            <button type="button" id="btn-cancelar">Cancelar</button>
        </form>
    `;
    
    const mainContent = document.getElementById('content');
    if (mainContent) {
        const pedidosContainer = mainContent.querySelector('#pedidos-container');
        if (pedidosContainer) {
            pedidosContainer.appendChild(formContainer);
    
            // Configurar evento para el botón de actualizar pedido
            const btnActualizarPedido = formContainer.querySelector('#btn-actualizar-pedido');
            btnActualizarPedido.addEventListener('click', async () => {
                await actualizarPedido();
            });
    
            // Configurar evento para el botón de cancelar
            const btnCancelar = formContainer.querySelector('#btn-cancelar');
            btnCancelar.addEventListener('click', () => {
                cargarPedidos(); // Volver a cargar la lista de pedidos al cancelar
            });
        } else {
            console.error('Elemento pedidos-container no encontrado.');
        }
    } else {
        console.error('Elemento mainContent no encontrado.');
    }
}

async function actualizarPedido() {
    const formPedido = document.getElementById('form-pedido');
    if (!formPedido) {
        console.error('Formulario de pedido no encontrado.');
        return;
    }
    const formData = new FormData(formPedido);
    const idPedido = formData.get('id');
    const data = {
        estado: formData.get('estado'),
        direccion_envio: formData.get('direccion_envio')
    };

    try {
        const response = await fetch(`${baseURLPedidos}${idPedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el pedido');
        }
        cargarPedidos(); // Recargar la lista de pedidos después de actualizar
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
    }
}
