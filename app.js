const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = "your_super_secret_key";

const users = [];

app.get("/", (req, res) => {
  const theme = req.cookies.theme || "light";
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = users.find((u) => u.id === decoded.id);
    } catch (err) {}
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <title>Homework 62 | Робота зі статичними файлами, Cookies та JWT на сервері Express</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style> body { background-color: ${
        theme === "dark" ? "#333" : "#FFF"
      }; color: ${theme === "dark" ? "#FFF" : "#000"}; } </style>
    </head>
    <body>
      <h1>Головна сторінка</h1>
      ${
        user
          ? `
        <p>Вітаю, ${user.username}! <a href="/profile">Перейти в профіль</a> | <a href="/logout">Вийти</a></p>
      `
          : `
        <p><a href="/login">Увійти</a> | <a href="/register">Зареєструватися</a></p>
      `
      }
      <p>Оберіть тему: <a href="/set-theme?theme=light">Світла</a> | <a href="/set-theme?theme=dark">Темна</a></p>
    </body>
    </html>
  `);
});

app.get("/register", (req, res) => {
  res.send(`
    <h1>Реєстрація</h1>
    <form action="/register" method="POST">
      <input name="username" placeholder="Ім'я користувача" required><br>
      <input name="password" type="password" placeholder="Пароль" required><br>
      <button type="submit">Зареєструватися</button>
    </form>
  `);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).send("Користувач з таким іменем вже існує.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, password: hashedPassword };
  users.push(newUser);
  console.log("Зареєстровано нового користувача:", newUser);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.send(`
    <h1>Вхід</h1>
    <form action="/login" method="POST">
      <input name="username" placeholder="Ім'я користувача" required><br>
      <input name="password" type="password" placeholder="Пароль" required><br>
      <button type="submit">Увійти</button>
    </form>
  `);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Неправильне ім'я користувача або пароль.");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find((u) => u.id === decoded.id);
    next();
  } catch (err) {
    return res.status(401).redirect("/login");
  }
};

app.get("/profile", authMiddleware, (req, res) => {
  res.send(`
    <h1>Профіль користувача</h1>
    <p>Це ваша секретна інформація, ${req.user.username}!</p>
    <a href="/">На головну</a>
  `);
});

app.get("/set-theme", (req, res) => {
  const theme = req.query.theme || "light";
  res.cookie("theme", theme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту http://localhost:${PORT}`);
});
