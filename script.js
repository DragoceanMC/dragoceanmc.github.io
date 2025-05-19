// Función para mostrar mensaje temporal
function mostrarMensaje(id, mensaje, esError = false) {
  const elem = document.getElementById(id);
  elem.textContent = mensaje;
  if (esError) {
    elem.style.color = '#e74c3c';
  } else {
    elem.style.color = '#2ecc71';
  }
  setTimeout(() => elem.textContent = '', 3000);
}

// Lógica de login
document.getElementById('formularioLogin').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombreUsuario').value;
  // El password no se valida realmente en este sistema simple
  if (nombre === 'DarkyElix') {
    // Mostrar panel de admin
    document.getElementById('panelAdmin').style.display = 'block';
    mostrarMensaje('mensajeLogin', '¡Bienvenido, DarkyElix!', false);
  } else {
    mostrarMensaje('mensajeLogin', 'Acceso denegado', true);
  }
});

// Cargar compras desde LocalStorage y mostrarlas
function cargarCompras() {
  const compras = JSON.parse(localStorage.getItem('compras')) || [];
  const tabla = document.getElementById('tablaCompras');
  // Limpiar filas anteriores (dejando encabezado)
  tabla.innerHTML = '<tr><th>Nombre Jugador</th><th>Rango</th><th>Tipo</th><th>Fecha Compra</th><th>Fecha Vencimiento</th></tr>';
  const hoy = new Date();
  compras.forEach(function(compra) {
    const fila = tabla.insertRow();
    const celNombre = fila.insertCell(0);
    const celRango = fila.insertCell(1);
    const celTipo = fila.insertCell(2);
    const celFecha = fila.insertCell(3);
    const celVence = fila.insertCell(4);

    celNombre.textContent = compra.nombre;
    celRango.textContent = compra.rango;
    celTipo.textContent = compra.tipo;

    const fechaCompra = new Date(compra.fecha);
    celFecha.textContent = fechaCompra.toLocaleDateString('es-ES');

    if (compra.tipo === 'Mensual') {
      const vence = new Date(fechaCompra);
      vence.setDate(vence.getDate() + 30);
      celVence.textContent = vence.toLocaleDateString('es-ES');
      if (hoy > vence) {
        celVence.classList.add('vencido');
      }
    } else if (compra.tipo === 'Anual') {
      const vence = new Date(fechaCompra);
      vence.setDate(vence.getDate() + 365);
      celVence.textContent = vence.toLocaleDateString('es-ES');
      if (hoy > vence) {
        celVence.classList.add('vencido');
      }
    } else {
      celVence.textContent = 'Nunca';
    }
  });
}

// Registrar nueva compra al enviar el formulario
document.getElementById('formularioCompra').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombreJugador = document.getElementById('nombreJugador').value;
  const rango = document.getElementById('rangoSeleccionado').value;
  const tipo = document.getElementById('tipoCompra').value;

  const nuevaCompra = {
    nombre: nombreJugador,
    rango: rango,
    tipo: tipo,
    fecha: new Date().toISOString()
  };
  const compras = JSON.parse(localStorage.getItem('compras')) || [];
  compras.push(nuevaCompra);
  localStorage.setItem('compras', JSON.stringify(compras));
  // Actualizar tabla
  cargarCompras();
  // Limpiar formulario
  document.getElementById('formularioCompra').reset();
  mostrarMensaje('mensajeLogin', 'Compra registrada.', false);
});

// Cargar compras al iniciar la página
window.addEventListener('DOMContentLoaded', (event) => {
  cargarCompras();
});


// Cargar compras al iniciar la página
window.addEventListener('DOMContentLoaded', (event) => {
  cargarCompras();
});
