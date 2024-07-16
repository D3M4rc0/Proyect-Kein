 const baseURL = 'http://127.0.0.1:5000/api/usuarios/';

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios(); // Cargar usuarios por defecto al iniciar la página
});

async function cargarUsuarios() {
    try {
        const response = await fetch(baseURL);
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const usuarios = await response.json();
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const mainContent = document.getElementById('content');
    mainContent.innerHTML = `
        <h2>Gestión de Usuarios</h2>
        <form id="form-usuario">
            <input type="hidden" id="id" name="id">
            <input type="text" id="nombre" name="nombre" placeholder="Nombre">
            <input type="text" id="apellido" name="apellido" placeholder="Apellido">
            <input type="email" id="email" name="email" placeholder="Email">
            <input type="password" id="password" name="password" placeholder="Contraseña">
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" placeholder="Fecha de Nacimiento">
            <input type="text" id="provincia" name="provincia" placeholder="Provincia">
            <select id="tipo_usuario" name="tipo_usuario">
                <option value="Cliente">Cliente</option>
                <option value="Distribuidor">Distribuidor</option>
            </select>
            <select id="rol" name="rol">
                <option value="Usuario">Usuario</option>
                <option value="Admin">Administrador</option>
            </select>
            <button type="button" id="btn-save-usuario">Guardar Usuario</button>
            <button type="button" id="btn-update-usuario" style="display: none;">Actualizar Usuario</button>
            <button type="button" id="btn-cancelar">Cancelar</button>
        </form>
        <table id="tabla-usuarios">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Provincia</th>
                    <th>Tipo de Usuario</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tbody-table-usuarios">
                ${usuarios.map(usuario => `
                    <tr>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.fecha_nacimiento}</td>
                        <td>${usuario.provincia}</td>
                        <td>${usuario.tipo_usuario}</td>
                        <td>${usuario.rol}</td>
                        <td>
                            <button class="btn-editar" data-id="${usuario.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
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
            const idUsuario = btn.dataset.id;
            const usuario = await obtenerUsuario(idUsuario, baseURL);
            llenarFormulario(usuario);
        });
    });

    btnEliminar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idUsuario = btn.dataset.id;
            if (confirm('¿Estás seguro de eliminar este usuario?')) {
                await eliminarUsuario(idUsuario, baseURL);
                cargarUsuarios();
            }
        });
    });

    // Configurar evento para el botón de guardar usuario
    const btnGuardarUsuario = document.getElementById('btn-save-usuario');
    if (btnGuardarUsuario) {
        btnGuardarUsuario.addEventListener('click', async () => {
            await guardarUsuario(baseURL);
        });
    }

    // Configurar evento para el botón de actualizar usuario
    const btnActualizarUsuario = document.getElementById('btn-update-usuario');
    if (btnActualizarUsuario) {
        btnActualizarUsuario.addEventListener('click', async () => {
            await actualizarUsuario(baseURL);
        });
    }

    // Configurar evento para el botón de cancelar
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetFormulario();
        });
    }
}

async function obtenerUsuario(idUsuario, baseURL) {
    const usuarioURL = baseURL + idUsuario;
    try {
        const response = await fetch(usuarioURL);
        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
    }
}

async function eliminarUsuario(idUsuario, baseURL) {
    const usuarioURL = baseURL + idUsuario;
    try {
        const response = await fetch(usuarioURL, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

async function guardarUsuario(baseURL) {
    const form = document.getElementById('form-usuario');
    const formData = new FormData(form);
    
    // Obtener el valor del campo password
    const password = form.querySelector('#password').value;

    // Agregar el campo 'password' al FormData
    formData.append('password', password);

    try {
        // Eliminar el campo 'id' del formData
        formData.delete('id');

        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (!response.ok) {
            throw new Error('Error al guardar el usuario');
        }
        form.reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
    }
}

// Actualizar
/* async function actualizarUsuario(baseURL) {
    const form = document.getElementById('form-usuario');
    const formData = new FormData(form);
    const idUsuario = formData.get('id');
    const usuarioURL = `${baseURL}${idUsuario}/`; // Asegúrate de que la URL sea correcta

    try {
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        const response = await fetch(usuarioURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convertir directamente el objeto 'data' a JSON
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        
        form.reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
}
 */


/* async function actualizarUsuario(baseURL) {
    const form = document.getElementById('form-usuario');
    const formData = new FormData(form);
    const idUsuario = formData.get('id');
    const usuarioURL = baseURL + idUsuario;
    try {
        const response = await fetch(usuarioURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        form.reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
}
 */

 /* async function actualizarUsuario(baseURL) {
    const form = document.getElementById('form-usuario');
    const formData = new FormData(form);
    const idUsuario = formData.get('id');
    const usuarioURL = baseURL + idUsuario;
    try {
        const response = await fetch(usuarioURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        form.reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
} */
 
 async function actualizarUsuario(baseURL) {
    const form = document.getElementById('form-usuario');
    const formData = new FormData(form);
    const idUsuario = formData.get('id');
    const usuarioURL = baseURL + idUsuario;

    // Obtener el valor del campo de contraseña
    const password = formData.get('password');
	
	  // Limpiar el campo de contraseña al cargar el formulario de edición
    /* form.password.value = '';  // Esto dejará el campo de contraseña vacío */
	
	

    // Verificar si el campo de contraseña está vacío
    if (password === '' || password ==='password') {
        // Eliminar el campo 'password' del formData
        formData.delete('password');
    }

    try {
        const response = await fetch(usuarioURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        form.reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
} 
function llenarFormulario(usuario) {
    const form = document.getElementById('form-usuario');
    form.id.value = usuario.id || '';
    form.nombre.value = usuario.nombre || '';
    form.apellido.value = usuario.apellido || '';
    form.email.value = usuario.email || '';
    form.fecha_nacimiento.value = usuario.fecha_nacimiento || '';
    form.provincia.value = usuario.provincia || '';
    form.tipo_usuario.value = usuario.tipo_usuario || '';
    form.rol.value = usuario.rol || '';
	
	 // Mostrar el campo de contraseña si existe en el objeto usuario
/*     if (usuario.password) {
        const passwordField = form.querySelector('#password');
        passwordField.value = usuario.password;
    }
	 */
	
		
	// o en vez de mostrar la palabra, dejamos vacio. limpiar el campo de contraseña al cargar el formulario de edición
     form.password.value = ''; // Esto dejará el campo de contraseña vacío 
	
	
    document.getElementById('btn-save-usuario').style.display = 'none';
    document.getElementById('btn-update-usuario').style.display = 'block';
}

function resetFormulario() {
    const form = document.getElementById('form-usuario');
    form.reset();
    document.getElementById('btn-save-usuario').style.display = 'block';
    document.getElementById('btn-update-usuario').style.display = 'none';
}
