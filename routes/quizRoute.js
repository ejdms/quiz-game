const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const pathToQuestions = path.join(__dirname, "..", "questions.json");
const questionsString = fs.readFileSync(pathToQuestions);
const questions = JSON.parse(questionsString);

let callHelpUsed = false;
let halfHelpUsed = false;
let crowdHelpUsed = false;

let currentQ = 0;

const resetHelp = () => {
  callHelpUsed = false;
  halfHelpUsed = false;
  crowdHelpUsed = false;
};

router.get("/", (req, res) => {
  if (currentQ === questions.length) {
    currentQ = 0;
    resetHelp();
    return res.json({ winner: true });
  }

  const answers = questions[currentQ].answers.map(a => a.text);

  res.json({
    question: questions[currentQ].question,
    answers,
    currentQ
  });
});

router.post("/", (req, res) => {
  const answer = req.query.answer;
  let correct = false;

  questions[currentQ].answers.map(question => {
    if (question.text === answer) {
      correct = question.correct;
    }
  });

  if (correct) {
    currentQ++;
    res.json({
      correct: true
    });
  } else {
    currentQ = 0;
    resetHelp();
    res.json({
      correct: false
    });
  }
});

router.post("/help", (req, res) => {
  const helpId = req.query.id;
  let response = {};

  const correctAnswer = questions[currentQ].answers.filter(
    answer => answer.correct
  )[0];
  const correctAnswerText = correctAnswer.text;

  switch (helpId) {
    case "call":
      if (!callHelpUsed) {
        const doesFriendKnowAnswer = Math.random() < 0.7;

        if (doesFriendKnowAnswer) {
          response.call = `I think that ${correctAnswerText} is correct`;
        } else {
          response.call = "I honestly don't know";
        }

        callHelpUsed = true;
      }

      break;
    case "half":
      if (!halfHelpUsed) {
        const incorrectAnswers = questions[currentQ].answers.filter(
          answer => answer.text !== correctAnswerText
        );

        const randomIncorrectAnswer =
          incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)]
            .text;

        const correctAndIncorrectAnswer =
          Math.random() < 0.5
            ? [correctAnswerText, randomIncorrectAnswer]
            : [randomIncorrectAnswer, correctAnswerText];
        response.half = correctAndIncorrectAnswer;

        halfHelpUsed = true;
      }
      break;
    case "crowd":
      if (!crowdHelpUsed) {
        let procentageLeft = 100;
        const correctAnswerProcentage = Math.floor(Math.random() * 30 + 50);
        procentageLeft -= correctAnswerProcentage;
        const procentageArray = [];

        for (let i = 0; i < 3; i++) {
          const howManyProcent =
            i === 2 ? procentageLeft : Math.floor(procentageLeft * 0.7);

          procentageArray.push(howManyProcent);
          procentageLeft -= howManyProcent;
        }

        const answersWithProcentage = questions[currentQ].answers.map(
          answer => {
            const { text, correct } = answer;
            const isThisAnswerCorrect = !!questions[currentQ].answers.filter(
              questionAnswer => {
                if (questionAnswer.text === text && correct) {
                  return true;
                }
                return false;
              }
            ).length;
            const isThisAnswerLastOne =
              questions[currentQ].answers[
                questions[currentQ].answers.length - 1
              ].text === text;
            const randomI = Math.floor(Math.random() * procentageArray.length);
            const procentage = isThisAnswerCorrect
              ? correctAnswerProcentage
              : isThisAnswerLastOne
              ? procentageArray[0]
              : procentageArray[randomI];

            if (!isThisAnswerCorrect) {
              procentageArray.splice(randomI, 1);
            }
            return {
              text,
              procentage
            };
          }
        );

        response.crowd = answersWithProcentage;

        crowdHelpUsed = true;
      }
      break;
  }
  res.json(response);
});

module.exports = router;
