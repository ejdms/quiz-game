const qs = s => document.querySelector(s);

const notGameOver = qs("#notGameOver");
const gameOver = qs("#gameOver");
const mainText = qs("#mainText");
const correctNumber = qs("#correctNumber");
const questionField = qs("#questionField");
const answer1 = qs("#answer1");
const answer2 = qs("#answer2");
const answer3 = qs("#answer3");
const answer4 = qs("#answer4");
const answersButtons = [answer1, answer2, answer3, answer4];
const text = qs("#text");
const reset = qs("#reset");
const callToFriend = qs("#call");
const fiftyFifty = qs("#half");
const questionToCrowd = qs("#crowd");
const helpButtons = [callToFriend, fiftyFifty, questionToCrowd];
const callModal = qs(".call-modal");
const callModalText = callModal.querySelector("#helpCallText");
const crowdModal = qs(".crowd-modal");
const overlay = qs(".overlay");

let buttonsBlock = false;

const quizURL = "/quiz";

const handleGetQuestion = () => {
  answersButtons.forEach(btn => btn.removeAttribute("disabled"));
  fetch(quizURL)
    .then(data => data.json())
    .then(q => {
      handleQuestionDisplay(q);
    });
};

const handleQuestionDisplay = q => {
  const { question, answers, currentQ, winner } = q;

  if (winner) {
    return handleWin();
  }

  correctNumber.textContent = currentQ;
  questionField.textContent = question;

  answers.forEach((answer, i) => {
    qs(`#answer${i + 1}`).textContent = answer;
  });
};

const handleAnswer = async answer => {
  const url = `${quizURL}?answer=${answer}`;
  const response = await fetch(url, {
    method: "POST"
  }).then(res => res.json());
  if (response.correct) {
    handleGetQuestion();
  } else {
    handleGameOver();
  }
};

const gameEnd = info => {
  gameNotOver.style.display = "none";
  gameOver.style.display = "block";
  text.textContent = info;
  buttonsBlock = true;
};

const handleWin = () => {
  gameEnd("WIN");
};

const handleGameOver = () => {
  gameEnd("LOSE");
};

const blockHelpButton = id => {
  qs(`button#${id}`).setAttribute("disabled", true);
};

const handleHelp = async id => {
  const url = `${quizURL}/help?id=${id}`;
  const response = await fetch(url, {
    method: "POST"
  }).then(res => res.json());
  const { call, half, crowd } = response;

  if (call) {
    blockHelpButton("call");
    callModalText.textContent = call;
    callModal.classList.add("open");
    overlay.classList.add("show");
    return null;
  }

  if (half) {
    blockHelpButton("half");
    answersButtons.forEach(answerBtn => {
      let stayActive = false;

      half.forEach(text => {
        if (answerBtn.textContent === text) {
          stayActive = true;
        }
      });

      if (stayActive) {
        answerBtn.removeAttribute("disabled");
      } else {
        answerBtn.setAttribute("disabled", true);
      }
    });

    return null;
  }

  if (crowd) {
    blockHelpButton("crowd");
    // console.log(crowd);
    const chart = crowdModal.querySelector(".chart");
    chart.innerHTML = "";

    crowd.forEach((crowdAnswer, i) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(`answer${i + 1}`);

      const text = document.createElement("div");
      text.classList.add("text");
      text.textContent = answersButtons[i].textContent;

      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.style.height = `${crowdAnswer.procentage}%`;

      const procentage = document.createElement("div");
      procentage.classList.add("procentage");
      procentage.textContent = `${crowdAnswer.procentage}%`;

      wrapper.appendChild(text);
      wrapper.appendChild(bar);
      wrapper.appendChild(procentage);
      chart.appendChild(wrapper);
    });
    crowdModal.classList.add("open");
    overlay.classList.add("show");
    return null;
  }
};

const handleReset = async () => {
  await handleGetQuestion();

  gameNotOver.style.display = "block";
  gameOver.style.display = "none";
  buttonsBlock = false;
  [...answersButtons, ...helpButtons].forEach(btn =>
    btn.removeAttribute("disabled")
  );
};

answersButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!buttonsBlock) {
      handleAnswer(button.textContent);
    }
  });
});

helpButtons.forEach(helpBtn => {
  helpBtn.addEventListener("click", () => {
    handleHelp(helpBtn.id);
  });
});

reset.addEventListener("click", handleReset);

document.querySelectorAll(".close-modal").forEach(closeBtn => {
  const currentModal = closeBtn.parentElement;
  closeBtn.addEventListener("click", () => {
    currentModal.classList.remove("open");
    overlay.classList.remove("show");
  });
});

document.addEventListener("DOMContentLoaded", handleGetQuestion);
