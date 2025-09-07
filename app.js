const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Сервер Express");
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
