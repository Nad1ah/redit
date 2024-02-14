require("dotenv").config()

const express = require("express");
const app = express();
const subredditsRouter = require("./subreddits")

app.use(express.json());
app.use(subredditsRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running (express)");
});