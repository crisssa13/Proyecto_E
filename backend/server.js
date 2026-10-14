const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; // Puerto donde correrá localmente tu API

// Permitir el intercambio de datos (CORS) y lectura de formato JSON
app.use(cors());
app.use(express.json());

// Variables globales en memoria para almacenar el estado del sistema IoT
let estadoSistema = {
    modo: "MANUAL",          // "MANUAL" o "AUTOMATICO"
    distancia: 0,            // Guardará los cm medidos por el sensor
    estado_motor: "DETENIDO" // "IZQUIERDA", "DERECHA" o "DETENIDO"
};

// 1. ENDPOINT GET: Para que la interfaz web y el microcontrolador consulten el estado actual
app.get('/api/estado', (req, res) => {
    res.json(estadoSistema);
});

// 2. ENDPOINT POST: Para recibir comandos de control desde la interfaz web o actualizaciones del hardware
app.post('/api/control', (req, res) => {
    const { modo, comando, distancia } = req.body;

    // Si la web cambia el modo de operación
    if (modo !== undefined) {
        estadoSistema.modo = modo;
    }

    // Procesar según el modo activo
    if (estadoSistema.modo === "AUTOMATICO") {
        // En modo automático, la API recibe la distancia del sensor y decide el giro del motor
        if (distancia !== undefined) {
            estadoSistema.distancia = Number(distancia);
            
            // Lógica de intervalos solicitada en las indicaciones:
            if (estadoSistema.distancia >= 10 && estadoSistema.distancia <= 25) {
                estadoSistema.estado_motor = "DERECHA";
            } else if (estadoSistema.distancia >= 26 && estadoSistema.distancia <= 40) {
                estadoSistema.estado_motor = "IZQUIERDA";
            } else {
                estadoSistema.estado_motor = "DETENIDO";
            }
        }
    } else {
        // En modo MANUAL, la API ignora los intervalos del sensor y obedece directamente los botones web
        if (distancia !== undefined) {
            estadoSistema.distancia = Number(distancia); // El sensor sigue mostrando lecturas en pantalla
        }
        if (comando !== undefined) {
            estadoSistema.estado_motor = comando; // Cambia a "IZQUIERDA", "DERECHA" o "DETENER"
        }
    }

    // Responder con el estado actualizado en formato JSON
    res.json({ status: "ok", estado: estadoSistema });
});

// Iniciar el servidor local
app.listen(PORT, () => {
    console.log(`Servidor API REST corriendo en: http://localhost:${PORT}`);
});
