const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//loading API
fetch(
    "https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple"
    ).then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

//Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () =>{
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostResentScore', score);
        //go to the end page.
        return window.location.assign("end.html");
    }
    questionCounter++;
    
    //show the question number out of the questions and progress bar.
    progressText.innerText = ` Question:  ${questionCounter}/${MAX_QUESTIONS}`;

    //update the progress baar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQestion = availableQuestions[questionIndex];
    question.innerText = currentQestion.question;

    //to change to choices in the choice box.
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQestion["choice" + number];
    });

    //removing the question from the array.
    availableQuestions.splice(questionIndex,1);  

    acceptingAnswers = true;

};

choices.forEach(choice => {
    choice.addEventListener('click', e =>{
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQestion.answer ? "correct" : "incorrect";

        //update the score.
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
        
    });
});

incrementScore = num =>{
    score +=num;
    scoreText.innerText = score;
};

