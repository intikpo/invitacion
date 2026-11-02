/* ============================================================
   CONFIG.JS  -  AQUÍ EDITAS TODOS LOS DATOS DE LA INVITACIÓN
   (No pongas aquí la lista de invitados: esa va en Google Sheets)
   ============================================================ */
window.CONFIG = {
  // ► Nombres de los novios
  novio1: "Wendy",
  novio2: "Cristian",

  // ► Fecha y hora (para la cuenta regresiva). Bolivia = -04:00
  fechaISO: "2026-11-21T17:00:00-04:00",
  fechaTexto: "21 de noviembre",
  hora: "17:00",

  // ► Lugar
  lugar: "Jardín Japonés, Salón Sakura",
  direccion: "Calle 8 de Calacoto",
  ciudad: "La Paz, Bolivia",
  // ► Enlace de Google Maps (puedes reemplazarlo por el enlace exacto del lugar)
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Japon%C3%A9s+Calle+8+Calacoto+La+Paz+Bolivia",

  // ► Frases
  fraseInvitacion: "Tenemos el honor de invitarte a celebrar nuestra boda.",
  fraseCierre: "Gracias por acompañarnos en el día más importante de nuestras vidas.",

  // ► Confirmación
  fechaLimite: "20 de noviembre de 2026",

  // ► Regalos
  direccionRegalos: "Calle Juan Mauel Loza, N°2011",
  qr: "images/qr.jpeg",           // sube tu imagen QR con este nombre (o cambia la ruta)

  // ► Fotografías (ponlas en la carpeta images/; si no existen se ve un fondo decorativo)
  fotos: {
    portada: "images/portada.jpg",
    jardin:  "images/jardin.webp",
    mesa:    "images/mesa.jpg",
    flores:  "images/flores.jpg",
    cierre:  "images/cierre.jpg"
  },

  // ► Conexión con Google Sheets (pega aquí la URL de la "Aplicación web" de Apps Script)
  apiUrl: "https://script.google.com/macros/s/AKfycbyY8_JS6Ji40ZRlNcbi1NbjPRgwrgW9V4Y1cXh3ULX3kjFjSxmngzXaAjShgcmM9d9Czw/exec",

  // ► Modo demostración: si apiUrl aún no está configurada, ?id=DEMO muestra un invitado de prueba
  demo: { id: "DEMO", nombre: "Invitado de Prueba", pases: 3 }
};
