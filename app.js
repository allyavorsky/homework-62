const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Homework 62 | Робота зі статичними файлами, Cookies та JWT на сервері Express</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
    </head>
    <body>
      <h1>Сервер Express</h1>
      <p>Статичні файли та Favicon налаштовано.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту http://localhost:${PORT}`);
});
