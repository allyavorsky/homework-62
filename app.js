const express = require("express");
const path = require("path");

const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/set-theme", (req, res) => {
  const theme = req.query.theme || "light";
  res.cookie("theme", theme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  res.redirect("/");
});

app.get("/", (req, res) => {
  const theme = req.cookies.theme || "light";

  const bodyClass = theme === "dark" ? "dark-theme" : "light-theme";
  const themeStyles = `
    <style>
      body { transition: background-color 0.3s, color 0.3s; }
      .light-theme { background-color: #FFF; color: #000; }
      .dark-theme { background-color: #333; color: #FFF; }
      a { color: #007BFF; }
      .dark-theme a { color: #80BFFF; }
    </style>
  `;

  res.send(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Homework 62 | Робота зі статичними файлами, Cookies та JWT на сервері Express</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      ${themeStyles}
    </head>
    <body class="${bodyClass}">
      <h1>Сервер Express з підтримкою Cookies</h1>
      <p>Поточна тема: <strong>${theme}</strong></p>
      <p>Оберіть тему:</p>
      <a href="/set-theme?theme=light">Світла</a> |
      <a href="/set-theme?theme=dark">Темна</a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту http://localhost:${PORT}`);
});
