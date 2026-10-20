import { createApplication } from './bootstrap.js';

const port = Number(process.env.PORT ?? 3000);

const { app } = await createApplication();

app.listen(port, () => {
  console.log(`API de reservas disponible en http://localhost:${port}`);
});
