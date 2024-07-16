document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/usuarios/')
    .then(response => response.json())
    .then(data => {
        const usuariosTable = document.getElementById('usuarios-table');
        data.forEach(usuario => {
            const row = usuariosTable.insertRow();
            row.insertCell().textContent = usuario.nombre;
            row.insertCell().textContent = usuario.apellido;
            row.insertCell().textContent = usuario.email;
        });
    });
});
