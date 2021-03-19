import data from "./quiz.json";

const $startButton = document.querySelector(".start-button");
const $nextButton = document.querySelector(".next-button");
const $questionBoard = document.querySelector(".question-board");
const $question = document.querySelector(".question");
const $exampleCode = document.querySelector(".example-code");
const $answerBoard = document.querySelector(".answer-board");
const $answerButtons = document.querySelectorAll(".answer-buttons");
const $result = document.querySelector(".result");
const $questionNumber = document.querySelector(".question-number");
const $timeRemaining = document.querySelector(".time-remaining");
const $score = document.querySelector(".score");
const timeLimit = 5;

let userAnswer;
let currentQuestionNumber;
let correctAnswer;
let score;
let timeLeft = timeLimit;
let timerId;

$startButton.addEventListener("click", startQuiz)
$nextButton.addEventListener("click", setNextQuestion)

function startQuiz() {
  resetQuestionAndAnswers();

  $questionBoard.classList.add("shadow");

  $timeRemaining.classList.remove("hide");

  $startButton.classList.add("hide");

  currentQuestionNumber = 0;

  score = 0;

  setTopboard();

  setQuestion();

  $answerBoard.classList.remove("hide");

  for (let i = 0; i < $answerButtons.length; i++) {
    const button = $answerButtons[i];
    button.addEventListener("click", selectAnswer)
  }
}

function resetQuestionAndAnswers() {
  $exampleCode.textContent = null;

  $result.textContent = "";

  for (let i = 0; i < $answerButtons.length; i++) {
    $answerButtons[i].textContent = "";
    $answerButtons[i].classList.remove("hide");
  }
}

function setTopboard() {
  $questionNumber.textContent = `Question ${currentQuestionNumber + 1} of ${data.length}`;

  setTimer();

  $score.textContent = `Score : ${score} / ${data.length}`;
}

function setTimer() {
  clearInterval(timerId);
  timeLeft = timeLimit;
  $timeRemaining.textContent = `${timeLeft} sec`;
  timerId = setInterval(countdown, 1000);
}

function countdown() {
  if (timeLeft == 0) {
    timeOut();
    clearInterval(timerId);
  } else {
    timeLeft--;
    $timeRemaining.textContent = `${timeLeft} sec`;
  }
}

function timeOut() {
  $result.textContent = "Time Out!";

  for (let i = 0; i < $answerButtons.length; i++) {
    const button = $answerButtons[i];
    button.removeEventListener("click", selectAnswer)
  }

  islastQuestion();
}

function setQuestion() {
  $question.textContent = data[currentQuestionNumber].question;
  if (data[currentQuestionNumber] !== null) {
    $exampleCode.textContent = data[currentQuestionNumber].code;
  }
  for (let i = 0; i < data[currentQuestionNumber].choices.length; i++) {
    $answerButtons[i].textContent = `(${i + 1}) ${data[currentQuestionNumber].choices[i]}`;
  }
  correctAnswer = data[currentQuestionNumber].correctAnswer;

  for (let i = 0; i < $answerButtons.length; i++) {
    if (!$answerButtons[i].textContent) {
      $answerButtons[i].classList.add("hide");
    }
  }
}

function setNextQuestion() {
  currentQuestionNumber++;

  resetQuestionAndAnswers();

  setTopboard();

  setQuestion();

  $nextButton.classList.add("hide");

  for (let i = 0; i < $answerButtons.length; i++) {
    const button = $answerButtons[i];
    button.addEventListener("click", selectAnswer)
  }
}

function selectAnswer (event) {
  userAnswer = Number(event.target.id);
  if (userAnswer === correctAnswer) {
    $result.textContent = "Correct!";
    score++;
    $score.textContent = `Score : ${score} / ${data.length}`;
  } else {
    $result.textContent = `Wrong!
    Correct Answer : (${correctAnswer + 1})`;
  }

  clearInterval(timerId);

    //removeEventListener 외에 더 효율적인 방법이 있을까요? disable, onlick = null 등을 고려해보았으나, 이 방법이 최선인 듯 하여 우선 이렇게 작성하였습니다.
    for (let i = 0; i < $answerButtons.length; i++) {
      const button = $answerButtons[i];
      button.removeEventListener("click", selectAnswer)
    }

    islastQuestion();
}

function islastQuestion() {
  if (currentQuestionNumber < data.length - 1) {
    $nextButton.classList.remove("hide");
  } else {
    $result.textContent += `
    Final score : ${score} / ${data.length}
    Well done!`;
    $nextButton.classList.add("hide");
    $startButton.textContent = "Restart";
    $startButton.classList.remove("hide");
  }
}
