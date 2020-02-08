const fs = require("fs");
const colors = require("colors");

const argv = require("minimist")(process.argv.slice(2));
delete argv._;

const { add, remove, edit, help } = argv;
const pathToFile = "./questions.json";

const getQuestionsAsObject = () => {
  const questionsString = fs.readFileSync(pathToFile);
  const questions = JSON.parse(questionsString);
  return questions;
};

const saveQuestionsAsJson = questions => {
  questionsToSave = JSON.stringify(questions);
  fs.writeFileSync(pathToFile, questionsToSave);
};

if (help) {
  console.log("----------------------".magenta);
  console.log(
    "To add new question use this schema: ".white +
      'node handleQuestions --add --question="Your question" --a1="First answer" --a2="Secound answer" --a3="Third answer" --a4="Fourth answer" --correctAnswer="Number of correct answer (1-4)"'
        .green
  );
  console.log("----------------------".magenta);
  console.log(
    "To remove question use this schema: ".white +
      'node handleQuestions --remove --question="Your question"'.red
  );
  console.log("----------------------".magenta);
  console.log(
    "To edit question use this schema: ".white +
      'node handleQuestions --edit --question="Your question" --a1="First answer" --a2="Secound answer" --a3="Third answer" --a4="Fourth answer" --correctAnswer="Number of correct answer (1-4)" --newQuestionFormula="New question text"'
        .cyan
  );
  console.log("----------------------".magenta);
  return null;
}

if (add) {
  const { question, a1, a2, a3, a4, correctAnswer } = argv;
  if (!(question && a1 && a2 && a3 && a4 && correctAnswer)) {
    return console.log("Error: arguments not valid".black.bgRed);
  }
  const answers = [a1, a2, a3, a4].map((a, i) => {
    return {
      text: a,
      correct: i + 1 === Number(correctAnswer)
    };
  });
  const questions = getQuestionsAsObject();
  const newQuestion = {
    question,
    answers
  };
  questions.push(newQuestion);
  saveQuestionsAsJson(questions);

  return console.log("The question has been saved".green);
}

if (remove) {
  const { question } = argv;
  if (!question) {
    return console.log("Error: arguments not valid".black.bgRed);
  }
  const questions = getQuestionsAsObject();
  const newQuestions = questions.filter(q => {
    return q.question !== question;
  });
  saveQuestionsAsJson(newQuestions);

  return console.log("Question succesfully removed".green);
}

if (edit) {
  const { question, a1, a2, a3, a4, correctAnswer, newQuestionFormula } = argv;
  if (!question) {
    return console.log("Error: arguments not valid".black.bgRed);
  }
  const questions = getQuestionsAsObject();
  const newQuestions = questions.map(q => {
    if (q.question === question) {
      if (a1) {
        q.a1 = a1;
      }
      if (a2) {
        q.a2 = a2;
      }
      if (a3) {
        q.a3 = a3;
      }
      if (a4) {
        q.a4 = a4;
      }
      if (correctAnswer) {
        q.answers.map((a, i) => {
          a.correct = i + 1 === correctAnswer;
        });
      }

      if (newQuestionFormula) {
        q.question = newQuestionFormula;
      }
    }
    return q;
  });
  saveQuestionsAsJson(newQuestions);

  return console.log("Question successfully changed".green);
}
