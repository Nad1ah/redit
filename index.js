require("dotenv").config();

const express = require("express");
const app = express();
const subredditsRouter = require("./subreddits");
const productsRouter = require("./products");
const { start } = require("./db");

app.use(express.json());
app.use(subredditsRouter);
app.use(productsRouter);

start().catch((error) => {
  console.error("⨉ ..Erro ao iniciar base de dados..  ⨉", error);
  process.exit(1);
});

app.listen(process.env.PORT, () => {
  console.log("server is running (express)");
});
