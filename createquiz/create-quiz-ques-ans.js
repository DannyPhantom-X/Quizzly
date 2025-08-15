const nextButton = document.getElementById('nextButton')
const previousButton = document.getElementById('previousButton')
const quizInfo = JSON.parse(sessionStorage.getItem('quizInfo'))
let currentIndex = 0;
console.log(quizInfo)
const loadOut = `<div class="qanda">
                    <label class="questions-label">Questions:</label>
                    <textarea name="" class="questions-input" id="questionsInput"></textarea>
                    <label for="options" class="options-label">Options:</label>
                    <div class="options-div"></div>
                    <div class="answerDiv">
                        <label for="answer">Answer: </label>
                        <textarea name="answer" class="answerInput" id=""></textarea>
                    </div>
                </div>
`;
const optionLoadOut = `
                        <textarea class="options-input" name="options" id=""></textarea>
`;

// window.onload
for(let i = 1; i <= quizInfo.noQues; i++) {
    document.querySelector('.body').innerHTML += loadOut;
}
if (quizInfo.options) {
    for(let i = 1; i <= quizInfo.noOptions; i++) {
        document.querySelectorAll('.options-div').forEach((opd) => {
          opd.innerHTML += optionLoadOut;  
        })
    }
}
onclickNextButton()
onclickPreviousButton()
previousChecker()
nextChecker()
function onclickNextButton() {
    nextButton.addEventListener('click' || 'touch', () => {
        console.log(quizInfo)
        currentIndex ++;
        let offset = -currentIndex * 100;
        document.querySelectorAll('.qanda').forEach((qa) => {
            qa.style.transform = `translateX(${offset}%)`
        })
        previousChecker()
        nextChecker()
    })
}

function onclickPreviousButton () {
    previousButton.addEventListener('click' || 'touch', () => {
        currentIndex --;
        let offset = -currentIndex * 100;
        document.querySelectorAll('.qanda').forEach((qa) => {
            qa.style.transform = `translateX(${offset}%)`
        })
        previousChecker()
        nextChecker()
    })
}
function previousChecker() {
    if (currentIndex === 0) {
        previousButton.classList.add('faded')
    }else{
        previousButton.classList.remove('faded')
    }
}

function nextChecker() {
    if (currentIndex == quizInfo.noQues) {
        nextButton.innerHTML = 'Create'
        
    }
}