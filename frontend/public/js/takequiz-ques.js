let questions;
const questionDiv = document.querySelector('.question-div')
const options = document.querySelector('.options')
const answerArea = document.querySelector('.answer-area')
const nextBttn = document.querySelector('.next-bttn')
const previousBttn = document.querySelector('.previous-bttn')
const path = window.location.pathname
let number = 1;
let noQue;
function renderQues(param, num) {
    return `<span class="number">${num}. </span>
        <span>${param}</span>
    `
}
function renderOption() {
    return `<label class="option">
                    <input type="radio" name="option">
                    <span>5x + 3x²</span>
            </label>`
}
window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${path}/ques/api`);
    const result = await response.json();
    questions = result.questions
    console.log(questions)
    if (!result.optionsStats) {
        noQue = Number(result.noQues)
        questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
        options.style.display = 'none';
        answerArea.style.display = 'flex';
        answerArea.value = questions[number-1].answer
    }
})

nextBttn.addEventListener('click' || 'touch', () => {
    if (noQue === number) {
        return;
    }else{
        questions[number-1].answer = answerArea.value
        number += 1
        questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
        answerArea.value = questions[number-1].answer
        noQue === number ? nextBttn.textContent = 'Submit' : null
    }
})
previousBttn.addEventListener('click' || 'touch', () => {
    noQue === number ? nextBttn.textContent = 'Next' : null
    questions[number-1].answer = answerArea.value
    number -= 1
    questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
    answerArea.value = questions[number-1].answer
})

console.log(JSON.parse(sessionStorage.getItem('candDetails')))