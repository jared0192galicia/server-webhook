import express from 'express';
import { json } from 'body-parser';
import route from './routes/route';

const app = express();
const port = 3003
console.clear();
/**
 * Establecer puerto
 */
app.set('port', port);

app.use(json());

// Ruta para el webhook de GitHub
app.use('/version', route);

// Tus rutas y lógica de la aplicación aquí

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
