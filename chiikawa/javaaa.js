// ===== CARRITO (se guarda en localStorage para que no se pierda al cambiar de página) =====
var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  var span = document.getElementById("cantidad");
  if (!span) return;
  var cantidad = 0;
  for (var i = 0; i < carrito.length; i++) {
    cantidad = cantidad + carrito[i].cantidad;
  }
  span.textContent = cantidad;
}

// ----- Botones "Agregar al carrito" -----
var botonesAgregar = document.querySelectorAll(".agregar");

for (var i = 0; i < botonesAgregar.length; i++) {
  botonesAgregar[i].addEventListener("click", function () {
    var nombre = this.getAttribute("data-nombre");
    var precio = Number(this.getAttribute("data-precio"));
    var encontrado = false;

    for (var j = 0; j < carrito.length; j++) {
      if (carrito[j].nombre === nombre) {
        carrito[j].cantidad++;
        encontrado = true;
      }
    }
    if (!encontrado) {
      carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    guardar();

    // mensaje temporal en el botón
    var boton = this;
    boton.textContent = "¡Agregado! ✔";
    setTimeout(function () {
      boton.textContent = "Agregar al carrito";
    }, 1000);
  });
}

// ----- Página del carrito -----
var tabla = document.getElementById("tablaCarrito");

function mostrarCarrito() {
  if (!tabla) return;
  var html = "";
  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    var subtotal = carrito[i].precio * carrito[i].cantidad;
    total = total + subtotal;
    html += "<tr>" +
      "<td>" + carrito[i].nombre + "</td>" +
      "<td>S/ " + carrito[i].precio + "</td>" +
      "<td>" + carrito[i].cantidad + "</td>" +
      "<td>S/ " + subtotal + "</td>" +
      "<td><button class='quitar' data-indice='" + i + "'>❌</button></td>" +
      "</tr>";
  }

  tabla.innerHTML = html;
  document.getElementById("total").textContent = total;
  document.getElementById("carritoVacio").style.display = carrito.length === 0 ? "block" : "none";

  // botones para quitar un producto
  var quitar = document.querySelectorAll(".quitar");
  for (var k = 0; k < quitar.length; k++) {
    quitar[k].addEventListener("click", function () {
      var indice = this.getAttribute("data-indice");
      carrito.splice(indice, 1);
      guardar();
      mostrarCarrito();
    });
  }
}

var botonVaciar = document.getElementById("vaciar");
if (botonVaciar) {
  botonVaciar.addEventListener("click", function () {
    carrito = [];
    guardar();
    mostrarCarrito();
  });
}

var botonComprar = document.getElementById("comprar");
if (botonComprar) {
  botonComprar.addEventListener("click", function () {
    var mensaje = document.getElementById("mensajeCompra");
    if (carrito.length === 0) {
      mensaje.textContent = "Agrega al menos un peluche primero.";
      mensaje.style.color = "red";
    } else {
      mensaje.textContent = "¡Gracias por tu compra! 💖";
      mensaje.style.color = "green";
      carrito = [];
      guardar();
      mostrarCarrito();
    }
  });
}

// ===== BUSCADOR Y FILTROS (solo en peluches.html) =====
var buscador = document.getElementById("buscador");
var categoriaActual = "todos";

function filtrar() {
  var texto = buscador.value.toLowerCase();
  var tarjetas = document.querySelectorAll(".tarjeta");
  var visibles = 0;

  for (var i = 0; i < tarjetas.length; i++) {
    var nombre = tarjetas[i].querySelector("h3").textContent.toLowerCase();
    var categoria = tarjetas[i].getAttribute("data-categoria");

    var coincideTexto = nombre.includes(texto);
    var coincideCategoria = categoriaActual === "todos" || categoria === categoriaActual;

    if (coincideTexto && coincideCategoria) {
      tarjetas[i].style.display = "block";
      visibles++;
    } else {
      tarjetas[i].style.display = "none";
    }
  }
  document.getElementById("sinResultados").style.display = visibles === 0 ? "block" : "none";
}

if (buscador) {
  buscador.addEventListener("input", filtrar);

  var botonesFiltro = document.querySelectorAll(".filtro");
  for (var f = 0; f < botonesFiltro.length; f++) {
    botonesFiltro[f].addEventListener("click", function () {
      for (var g = 0; g < botonesFiltro.length; g++) {
        botonesFiltro[g].classList.remove("activo");
      }
      this.classList.add("activo");
      categoriaActual = this.getAttribute("data-categoria");
      filtrar();
    });
  }
}

// ===== FORMULARIO (solo en contacto.html) =====
var formulario = document.getElementById("formulario");

if (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nombre = document.getElementById("nombre").value;
    var correo = document.getElementById("correo").value;
    var motivo = document.getElementById("motivo").value;
    var mensaje = document.getElementById("mensaje").value;
    var aviso = document.getElementById("aviso");

    if (nombre === "" || correo === "" || motivo === "" || mensaje === "") {
      aviso.textContent = "Por favor completa todos los campos.";
      aviso.style.color = "red";
    } else if (!correo.includes("@")) {
      aviso.textContent = "El correo no es válido.";
      aviso.style.color = "red";
    } else {
      aviso.textContent = "¡Gracias " + nombre + "! Te responderemos pronto.";
      aviso.style.color = "green";
      formulario.reset();
    }
  });
}

// ===== AL CARGAR CUALQUIER PÁGINA =====
actualizarContador();
mostrarCarrito();
// ===== MODO NOCHE =====
var botonModo = document.createElement("button");
botonModo.id = "modo";
botonModo.className = "boton";
document.querySelector("nav").appendChild(botonModo);

// recordar la elección del usuario
if (localStorage.getItem("modo") === "oscuro") {
  document.body.classList.add("oscuro");
}

function textoModo() {
  if (document.body.classList.contains("oscuro")) {
    botonModo.textContent = "☀️ Modo claro";
  } else {
    botonModo.textContent = "🌙 Modo noche";
  }
}
textoModo();

botonModo.addEventListener("click", function () {
  document.body.classList.toggle("oscuro");

  if (document.body.classList.contains("oscuro")) {
    localStorage.setItem("modo", "oscuro");
  } else {
    localStorage.setItem("modo", "claro");
  }
  textoModo();
});
// ===== SALUDO SEGÚN LA HORA =====
var saludo = document.getElementById("saludo");

if (saludo) {
  var hora = new Date().getHours();
  var texto;

  if (hora >= 5 && hora < 12) {
    texto = "¡Buenos días!";
  } else if (hora >= 12 && hora < 19) {
    texto = "¡Buenas tardes!";
  } else {
    texto = "¡Buenas noches!";
  }

  saludo.textContent = texto + " Bienvenido a Chiikawa Store";
}