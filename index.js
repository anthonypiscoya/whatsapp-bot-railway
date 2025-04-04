const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }  // Modo sin interfaz gráfica
});

// Escanea el QR para vincular WhatsApp
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// Cuando el bot esté listo
client.on('ready', () => {
  console.log('¡Bot listo!');
});

// Escucha mensajes entrantes
client.on('message', async (msg) => {
  if (msg.body === 'Hola') {
    await msg.reply('¡Hola! Soy tu bot en la nube 🤖');
  }
});

// Webhook para recibir mensajes desde Google Apps Script
app.post('/webhook', (req, res) => {
  const { numero, mensaje } = req.body;
  client.sendMessage(`${numero}@c.us`, mensaje);
  res.send('Mensaje enviado');
});

client.initialize();
app.listen(3000, () => console.log('Servidor webhook en puerto 3000'));