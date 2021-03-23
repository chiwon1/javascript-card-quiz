"use strict";

import data from "./quiz.json";

const $startButton = document.querySelector(".start-button");
const $nextButton = document.querySelector(".next-button");
const $restartButton = document.querySelector(".restart-button");
const $questionBoard = document.querySelector(".question-board");
const $question = document.querySelector(".question");
const $exampleCode = document.querySelector(".example-code");
const $answerBoard = document.querySelector(".answer-board");
const $answerButtons = document.querySelectorAll(".answer-buttons");
const $result = document.querySelector(".result");
const $finalSocre = document.querySelector(".final-score");
const $finishMessage = document.querySelector(".finish-message");
const $questionNumber = document.querySelector(".question-number");
const $timeRemaining = document.querySelector(".time-remaining");
const $score = document.querySelector(".score");
const TIME_LIMIT = 5;
const FINISH_MESSAGE = "Well done!";

let currentQuestionNumber = 0;
let correctAnswer = 0;
let score = 0;
let timeLeft = 0;
let intervalId = null;

$startButton.addEventListener("click", startQuiz);
$nextButton.addEventListener("click", setNextQuestion);
$restartButton.addEventListener("click", startQuiz);

function initialize() {
  currentQuestionNumber = 0;
  score = 0;
  $finalSocre.textContent = "";
  $finishMessage.textContent = "";
}

function startQuiz() {
  initialize();
  resetQuestionAndAnswers();
  setTopboard();
  setQuestion();

  $questionBoard.classList.remove("hide");
  $timeRemaining.classList.remove("hide");
  $startButton.classList.add("hide");
  $restartButton.classList.add("hide");
  $answerBoard.classList.remove("hide");

  $answerBoard.addEventListener("click", selectAnswer);
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
  setTimer();

  $questionNumber.textContent = `Question ${currentQuestionNumber + 1} of ${data.length}`;
  $score.textContent = `Score : ${score} / ${data.length}`;
}

function setTimer() {
  clearInterval(intervalId);
  timeLeft = TIME_LIMIT;
  $timeRemaining.textContent = `${timeLeft} sec`;
  intervalId = setInterval(countdown, 1000);
}

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    $timeRemaining.textContent = `${timeLeft} sec`;
  } else {
    timeOut();
    clearInterval(intervalId);
  }
}

function timeOut() {
  $result.textContent = "Time Out!";
  $answerBoard.removeEventListener("click", selectAnswer);

  isLastQuestion();
}

function setQuestion() {
  $question.textContent = data[currentQuestionNumber].question;
  $exampleCode.textContent = data[currentQuestionNumber].code;

  for (let i = 0; i < data[currentQuestionNumber].choices.length; i++) {
    $answerButtons[i].textContent = `(${i + 1}) ${data[currentQuestionNumber].choices[i]}`;
  }

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

  $answerBoard.addEventListener("click", selectAnswer);
}

function selectAnswer(event) {
  correctAnswer = data[currentQuestionNumber].correctAnswer;
  const userAnswer = Number(event.target.dataset.answerNumber);

  if (userAnswer === correctAnswer) {
    $result.textContent = "Correct!";
    score++;
    $score.textContent = `Score : ${score} / ${data.length}`;
  } else {
    $result.textContent = `Wrong!\nCorrect Answer : (${correctAnswer + 1})`;
  }

  clearInterval(intervalId);

  $answerBoard.removeEventListener("click", selectAnswer);

  isLastQuestion();
}

function isLastQuestion() {
  if (currentQuestionNumber < data.length - 1) {
    $nextButton.classList.remove("hide");
  } else {
    $finalSocre.textContent = `Final score : ${score} / ${data.length}`;
    $finishMessage.textContent = FINISH_MESSAGE;
    $nextButton.classList.add("hide");
    $restartButton.classList.remove("hide");
  }
}
