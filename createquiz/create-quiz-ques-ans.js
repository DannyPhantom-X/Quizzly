const nextButton = document.querySelector('.nextButton');
const previousButton = document.getElementById('previousButton');
const quizInfo = JSON.parse(sessionStorage.getItem('quizInfo'));
const questionNum = document.getElementById('questionNum');
let num = 1
let currentIndex = 0;
console.log(quizInfo)
const loadOut = `<div class="qanda">
                    <label class="questions-label">Questions:</label>
                    <textarea name="" class="questions-input" id="questionsInput"></textarea>
                    <label for="options" class="options-label">Options:</label>
                    <div class="options-div"></div>
                    <label for="answer" class="answer-label">Answer: </label>
                    <textarea name="answer" class="answerInput" id=""></textarea>
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
onclickPreviousButton()
previousChecker()
nextChecker()

function onclickNextButton() {
        console.log(quizInfo)
        currentIndex ++;
        let offset = -currentIndex * 100;
        document.querySelectorAll('.qanda').forEach((qa) => {
            qa.style.transform = `translateX(${offset}%)`
        })
        num += 1
        questionNum.innerHTML = num
        previousChecker()
        nextChecker()
}



function onclickPreviousButton () {
    previousButton.addEventListener('click' || 'touch', () => {
        currentIndex --;
        let offset = -currentIndex * 100;
        document.querySelectorAll('.qanda').forEach((qa) => {
            qa.style.transform = `translateX(${offset}%)`
        })
        num -= 1
        questionNum.innerHTML = num
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
    if (currentIndex == (quizInfo.noQues - 1)) {
        // nextButton.classList.add('remove-button');
        // nextButton.classList.remove('nextButton');
        // console.log(nextButton.classList);
        // console.log('yooooo');
        nextButton.removeEventListener('click' || 'touch', onclickNextButton)
        nextButton.innerHTML = '<i class="fas fa-angle-double-right"></i>';
    }
    else{
        nextButton.addEventListener('click' || 'touch', onclickNextButton)
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
        // <i class='fas fa-caret-left'></i>
        // <i class='fas fa-chevron-circle-left'></i>
    }
}

