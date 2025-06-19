const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const startButton = document.getElementById('start-btn');
const startContainer = document.getElementById('start-container');
const timeDisplay = document.getElementById('time');
const progressInner = document.getElementById('progress-inner');
const feedbackElement = document.getElementById('feedback');
const highScoreElement = document.getElementById('high-score');
// Feedback Form
const feedbackForm = document.getElementById('feedback-form');
const feedbackInput = document.getElementById('feedback-input');
const feedbackMessage = document.getElementById('feedback-message');
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questions = [
  {
    question: "Which of the following is a JavaScript framework?",
    explanation: "React is used for building UI. Laravel, Django, Flask are back-end frameworks.",
    answers: [
      { text: "React", correct: true },
      { text: "Laravel", correct: false },
      { text: "Django", correct: false },
      { text: "Flask", correct: false }
    ]
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    explanation: "`const` is used for declaring constants that cannot be reassigned.",
    answers: [
      { text: "let", correct: false },
      { text: "const", correct: true },
      { text: "var", correct: false },
      { text: "define", correct: false }
    ]
  },
  {
    question: "What is the output of 2 + '2' in JavaScript?",
    explanation: "2 + '2' results in '22' because one is a string — JavaScript concatenates.",
    answers: [
      { text: "4", correct: false },
      { text: "22", correct: true },
      { text: "NaN", correct: false },
      { text: "undefined", correct: false }
    ]
  }
];

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

submitFeedbackBtn.addEventListener('click', () => {
  const feedbackText = feedbackInput.value.trim();
  if (feedbackText !== "") {
    let feedbackList = JSON.parse(localStorage.getItem("userFeedback")) || [];
    feedbackList.push(feedbackText);
    localStorage.setItem("userFeedback", JSON.stringify(feedbackList));
    feedbackMessage.classList.remove("hidden");
    feedbackInput.value = "";
  }
});

function startQuiz() {
  startContainer.classList.add('hidden');
  questionContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
  highScoreElement.classList.add('hidden');
  feedbackForm.classList.add('hidden');
  feedbackMessage.classList.add('hidden');
  score = 0;
  currentQuestionIndex = 0;

  shuffleArray(questions);
  questions.forEach(q => shuffleArray(q.answers));
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = 'true';
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });

  startTimer();
  updateProgress();
}

function resetState() {
  nextButton.classList.add('hidden');
  answerButtons.innerHTML = '';
  feedbackElement.classList.add('hidden');
  feedbackElement.innerText = '';
  stopTimer();
  timeLeft = 15;
  timeDisplay.innerText = timeLeft;
}

function selectAnswer(e) {
  stopTimer();
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === 'true';
  if (isCorrect) {
    selectedBtn.classList.add('correct');
    score++;
  } else {
    selectedBtn.classList.add('wrong');
  }

  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    }
  });

  const explanation = questions[currentQuestionIndex].explanation;
  feedbackElement.innerText = `💡 ${explanation}`;
  feedbackElement.classList.remove('hidden');

  nextButton.classList.remove('hidden');
}

function startTimer() {
  timeDisplay.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      stopTimer();
      autoSelectWrong();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function autoSelectWrong() {
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    } else {
      button.classList.add('wrong');
    }
  });

  const explanation = questions[currentQuestionIndex].explanation;
  feedbackElement.innerText = `💡 ${explanation}`;
  feedbackElement.classList.remove('hidden');

  nextButton.classList.remove('hidden');
}

function updateProgress() {
  const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressInner.style.width = `${percent}%`;
}

function showScore() {
  questionContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  resultContainer.innerText = `✅ You scored ${score} out of ${questions.length}`;
  localStorage.setItem('lastScore', score);

  const highScore = localStorage.getItem('highScore') || 0;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    highScoreElement.innerText = `🎉 New High Score: ${score}`;
  } else {
    highScoreElement.innerText = `🏆 High Score: ${highScore}`;
  }
  highScoreElement.classList.remove('hidden');

  feedbackForm.classList.remove('hidden');
  feedbackMessage.classList.add('hidden');

  startButton.innerText = "Restart Quiz";
  startContainer.classList.remove('hidden');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
