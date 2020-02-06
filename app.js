const express = require("express");
const quizRoute = require("./routes/quizRoute");

const app = express();

app.use(express.static("public"));
app.use("/quiz", quizRoute);

app.listen(3000);