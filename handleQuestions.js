const fs = require("fs");

const argv = require("minimist")(process.argv.slice(2));
delete argv._;

const { add, remove, edit } = argv;
const pathToFile = "./questions.json";

if (add) {
  const { question, a1, a2, a3, a4 } = argv;
  if (!(question && a1 && a2 && a3 && a4))
    return console.log("Error: arguments not valid");

  const questionsString = fs.readFileSync(pathToFile);
  const questions = JSON.parse(questionsString);
  const newQuestion = {
    question,
    answers: [a1, a2, a3, a4]
  };
  questions.push(newQuestion);
  questionsToSave = JSON.stringify(questions);
  fs.writeFileSync(pathToFile, questionsToSave);
}
