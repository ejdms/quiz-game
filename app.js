const express = require("express");
const quizRoute = require("./routes/quizRoute");
const colors = require("colors");

const app = express();

app.use(express.static("public"));
app.use("/quiz", quizRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost/${port}`.green);
  console.log(
    "You can menage questions with handleQuestions.js (type 'node handleQuestions --help' for more info)"
      .yellow
  );
});
