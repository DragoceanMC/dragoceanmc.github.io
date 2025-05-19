// Utilidades de LocalStorage
const usuariosKey = 'usuarios';
const comprasKey = 'compras';
function getUsuarios() {
  return JSON.parse(localStorage.getItem(usuariosKey)) || {};
}
function saveUsuarios(u) {
  localStorage.setItem(usuariosKey, JSON.stringify(u));
}
function getCompras() {
  return JSON.parse(localStorage.getItem(comprasKey)) || [];
}
function saveCompras(c) {
  localStorage.setItem(comprasKey, JSON.stringify(c));
}

// Elementos
const regUsr = document.getElementById('reg-username');
const regPwd = document.getElementById('reg-password');
const btnReg = document.getElementById('btn-register');
const msgReg = document.getElementById('msg-register');
const logUsr = document.getElementById('login-username');
const logPwd = document.getElementById('login-password');
const btnLog = document.getElementById('btn-login');
const msgLog = document.getElementById('msg-login');
const authC = document.getElementById('auth-container');
const mainC = document.getElementById('main-content');

// Mostrar/Ocultar según login
function checkLogin() {
  if (localStorage.getItem('loggedIn')==='true') {
    authC.style.display='none';
    mainC.style.display='block';
    loadComprasTable();
  }
}
window.onload = checkLogin;

// Registro
btnReg.onclick = () => {
  const usr = regUsr.value.trim();
  const pwd = regPwd.value;
  let usuarios = getUsuarios();
  if (!usr || !pwd) { msgReg.textContent='Completa ambos campos'; return; }
  if (usuarios[usr]) {
    msgReg.textContent='Usuario ya existe';
    return;
  }
  // Contraseña = usuario como indica
  if (pwd !== usr) { msgReg.textContent='La contraseña debe ser igual al usuario'; return; }
  usuarios[usr]=pwd;
  saveUsuarios(usuarios);
  msgReg.textContent='Registrado con éxito';
};

// Login
btnLog.onclick = () => {
  const usr = logUsr.value.trim();
  const pwd = logPwd.value;
  const usuarios = getUsuarios();
  if (usuarios[usr]===pwd && usr==='DarkyElix') {
    localStorage.setItem('loggedIn','true');
    checkLogin();
  } else {
    msgLog.textContent='Credenciales inválidas';
  }
};

// Modal de rangos
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalTag = document.getElementById('modal-tagline');
const modalPrice = document.getElementById('modal-price');
const opts = document.querySelectorAll('.opt-btn');
document.querySelectorAll('.rango').forEach(div => {
  div.onclick = () => {
    const rango = div.dataset.rango;
    const base = Number(div.dataset.precio);
    modalTitle.textContent = rango;
    modalTag.textContent = rango==='Dragón'? '⭐ Recomendado': rango==='Leviatán'? '🔥 La Mejor Opción': '';
    modalPrice.textContent = `$${base}/mes`;
    modal.style.display='flex';
    opts.forEach(b => b.onclick = () => {
      let precio;
      if (b.dataset.tipo==='anual') precio = base*3;
      else if (b.dataset.tipo==='permanente') precio = base*5;
      else precio = base;
      modalPrice.textContent = `$${precio}`;
    });
  };
});

// Cerrar modal
document.getElementById('modal-close').onclick = () => {
  modal.style.display='none';
};

// Admin: registrar compras y cargar tabla
const form = document.getElementById('compra-form');
const tbl = document.getElementById('tbl-compras');

function loadComprasTable() {
  const arr = getCompras();
  // reset tabla (dejar cabecera)
  tbl.innerHTML = '<tr><th>Jugador</th><th>Rango</th><th>Tipo</th><th>Compra</th><th>Vence</th></tr>';
  const hoy = new Date();
  arr.forEach(c => {
    const tr = tbl.insertRow();
    tr.insertCell().textContent = c.jugador;
    tr.insertCell().textContent = c.rango;
    tr.insertCell().textContent = c.tipo;
    const fC = new Date(c.fecha);
    tr.insertCell().textContent = fC.toLocaleDateString();
    let vence;
    if (c.tipo==='Mensual') { vence = new Date(fC); vence.setDate(vence.getDate()+30); }
    else if (c.tipo==='Anual') { vence = new Date(fC); vence.setFullYear(vence.getFullYear()+1); }
    else vence = null;
    const celV = tr.insertCell();
    celV.textContent = vence? vence.toLocaleDateString() : 'Nunca';
    if (vence && hoy>vence) tr.classList.add('vencido');
  });
}

form.onsubmit = e => {
  e.preventDefault();
  const jugador = document.getElementById('jugador').value;
  const rango = document.getElementById('sel-rango').value;
  const tipo = document.getElementById('sel-tipo').value;
  const compras = getCompras();
  compras.push({ jugador, rango, tipo, fecha: new Date().toISOString() });
  saveCompras(compras);
  loadComprasTable();
  form.reset();
};
