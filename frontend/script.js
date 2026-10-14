// URL base de tu API REST local corriendo en tu Visual Studio Code
const API_URL = "https://onrender.com";


// Elementos del DOM
const txtDistancia = document.getElementById('txtDistancia');
const txtEstadoMotor = document.getElementById('txtEstadoMotor');
const modoManual = document.getElementById('modoManual');
const modoAuto = document.getElementById('modoAuto');
const panelManual = document.getElementById('panelManual');

// Botones de acción manual
const btnIzquierda = document.getElementById('btnIzquierda');
const btnDerecha = document.getElementById('btnDerecha');
const btnDetener = document.getElementById('btnDetener');

let sistemaModo = "MANUAL";

// Cambiar de modo de operación (Manejadores de eventos)
modoManual.addEventListener('change', () => conmutarModo("MANUAL"));
modoAuto.addEventListener('change', () => conmutarModo("AUTOMATICO"));

// Función para cambiar de modo Manual <-> Automático
function conmutarModo(nuevoModo) {
    sistemaModo = nuevoModo;
    if (sistemaModo === "AUTOMATICO") {
        // Deshabilitar visualmente controles manuales en la interfaz web
        btnIzquierda.disabled = true;
        btnDerecha.disabled = true;
        btnDetener.disabled = true;
    } else {
        // Habilitar controles manuales en la interfaz web
        btnIzquierda.disabled = false;
        btnDerecha.disabled = false;
        btnDetener.disabled = false;
    }
    // Sincronizar el cambio de modo con nuestro servidor Backend
    enviarComandoAPI({ modo: sistemaModo });
}

// Eventos para controlar el motor haciendo clic en los botones
btnIzquierda.addEventListener('click', () => enviarComandoAPI({ comando: "IZQUIERDA" }));
btnDerecha.addEventListener('click', () => enviarComandoAPI({ comando: "DERECHA" }));
btnDetener.addEventListener('click', () => enviarComandoAPI({ comando: "DETENER" }));

// Función para enviar las acciones y configuraciones hacia la API REST (Petición POST)
async function enviarComandoAPI(datos) {
    try {
        await fetch(`${API_URL}/control`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error("Error al enviar comando a la API:", error);
    }
}

// Consultar la distancia del sensor y estado del motor de forma continua (Petición GET)
async function actualizarMonitoreo() {
    try {
        const respuesta = await fetch(`${API_URL}/estado`);
        if (respuesta.ok) {
            const data = await respuesta.json();
            
            // Tomar la distancia y forzar que siempre muestre 3 dígitos (ej: 025 en vez de 25)
            let distancia = data.distancia;
            txtDistancia.innerText = String(distancia).padStart(3, '0');
            
            // Reflejar visualmente el sentido de giro actual del motor
            txtEstadoMotor.innerText = data.estado_motor.toUpperCase();
        }
    } catch (error) {
        console.error("Error obteniendo datos de la API:", error);
    }
}

// Ejecutar la función de monitoreo cíclicamente cada 1000 milisegundos (1 segundo)
setInterval(actualizarMonitoreo, 1000);

