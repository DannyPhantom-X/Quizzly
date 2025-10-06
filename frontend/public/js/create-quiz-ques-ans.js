const nextButton = document.querySelector('.nextButton');
const previousButton = document.getElementById('previousButton');
const quizInfo = JSON.parse(sessionStorage.getItem('quizInfo'));
const candInfo = JSON.parse(sessionStorage.getItem('candInfo'))
const questionNum = document.getElementById('questionNum');
const confirmDiv = document.querySelector('.confirm-div');
const loadScreen = document.querySelector('.load-screen');
let questions = []
let num = 1
let currentIndex = 0;
console.log(quizInfo)
const loadOut = `<div class="qanda">
                    <label class="questions-label">Questions:</label>
                    <textarea name="" class="questions-input" id="questionsInput"></textarea>
                    <label for="options" class="options-label">Options:</label>
                    <div class="options-div"></div>
                </div>
`;
const optionLoadOut = `
                        <div><input type="radio" name="option"><textarea class="options-input" name="options" id=""></textarea></div>
`;

const zeroOptionLoadout = `<div class="qanda">
                                <label class="questions-label">Questions:</label>
                                <textarea name="" class="questions-input" id="questionsInput"></textarea>
                                <label for="answer" class="answer-label">Answer: </label>
                                <textarea name="answer" class="answerInput" id=""></textarea>
                            </div>

`;
if (quizInfo && candInfo) {
    if (quizInfo.options) {
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


    }else{
        for(let i = 1; i <= quizInfo.noQues; i++) {
            document.querySelector('.body').innerHTML += zeroOptionLoadout;
        }
        onclickPreviousButton()
        previousChecker()
        nextChecker()

    }
}else{
    console.log('unable to connect')
    bodyChangeDueTo('unfilled info')
}

function onclickNextButton() {
        console.log(quizInfo)
        currentIndex ++;
        let offset = -currentIndex * 100;
        document.querySelectorAll('.qanda').forEach((qa) => {
            qa.style.transform = `translateX(${offset}%)`
        })
        num += 1
        console.log(num)
        questionNum.innerHTML = num
        previousChecker()
        nextChecker()
}



function onclickPreviousButton () {
    previousButton.addEventListener('click' || 'touch', () => {
        if (currentIndex == (quizInfo.noQues - 1)) {
            nextButton.removeEventListener('click' || 'touch', onClickProceed)
        }
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
        // const createBttn = document.querySelector('.remove-button');
        console.log(nextButton.innerHTML)
        console.log('yooooo');
        nextButton.removeEventListener('click' || 'touch', onclickNextButton)
        nextButton.addEventListener('click' || 'touch', onClickProceed)
        nextButton.innerHTML = '<i class="fas fa-angle-double-right"></i>';
    }
    else{
        nextButton.addEventListener('click' || 'touch', onclickNextButton)
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
        // <i class='fas fa-caret-left'></i>
    }
}

async function onClickCreate() {
    fade('remove')
    confirmDiv.innerHTML = ''
    confirmDiv.classList.remove('confirm-div-style')
    loadScreenFunc('add')
    console.log('create')
    loadScreen.classList.add('load-screen-style')
    loadScreen.innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    const answerInput = document.querySelectorAll('.answerInput')
    const optionInput = document.querySelectorAll('.options-input')
    const questionInput = document.querySelectorAll('.questions-input')
    if(quizInfo.options) {
        questionInput.forEach((qI, i) => {
            questions.push({
                question: qI.value,
                option: optionInput[i].value,
                // answer: answerInput[i].value
            })
        })
    }else {
        questionInput.forEach((qI, i) => {
            console.log(qI.value)
            questions.push({
                question: qI.value,
                answer: answerInput[i].value
            })
        })
        console.log(questions)
    }
    try{
        const response = await fetch('/createquiz', {
            method: 'Post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                quizInfo: quizInfo,
                candInfo: candInfo,
                questions: questions
            })
        })
        const result = await response.json()
        if (result.statuz === 'success') {
            console.log(result.message)
            await delay(2000)
            loadScreenFunc('remove')
            bodyChangeDueTo('quiz created', result.message)
            sessionStorage.clear('quizInfo')
            sessionStorage.clear('candInfo')
        }else {
            console.log('unable')
            await delay(2000)
            loadScreenFunc('remove')
            bodyChangeDueTo('fetch error')
        }
    } catch{
        console.log('error')
    }
}



function onClickProceed() {
    fade('add')
    confirmDiv.classList.add('confirm-div-style')
    confirmDiv.innerHTML = `
            <button class="cancel-bttn">X</button>
            <div class="confirm-text">You about to Create a Mathematics quiz with a duration of 2h 3m 0s</div>
            <button class="create-bttn">Create</Proceed>
    `
    document.querySelector('.create-bttn').addEventListener('click' || 'touch', onClickCreate)
    document.querySelector('.cancel-bttn').addEventListener('click' || 'touch', () => {
        confirmDiv.classList.remove('confirm-div-style')
        confirmDiv.innerHTML = '';
        fade('remove')
    })
}


function fade(param) {
    if( param === 'add') {
        document.querySelector('body' && 'header').style.backgroundColor = 'rgba(15, 23, 42, 0.8)'
        document.querySelectorAll('body *:not(.confirm-div)').forEach((el) => {
            el.classList.add('faded')
        })
    }else if(param === 'remove') {
        document.querySelector('body' && 'header').style.backgroundColor = '#0f172a'
        document.querySelectorAll('body *:not(.confirm-div)').forEach((el) => {
            el.classList.remove('faded')
        })
    }
}

function loadScreenFunc(param) {
    if (param === 'add') {
        profilePic.classList.add('faded')
        document.querySelector('body' && 'header').style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.add('faded')
        })
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('body' && 'header').style.backgroundColor = '#0f172a'
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.remove('faded')
        })
        document.querySelector('.load-screen').classList.remove('load-screen-style')
        document.querySelector('.load-screen').innerHTML = ''
    }

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function bodyChangeDueTo(param, param2) {
    if (param === 'unfilled info') {
        console.log(param)
        document.body.innerHTML = `<div>Unable to connect at this time........   Please suply <a href='/createquiz' style="color: red;">Quiz info</a> and Candidate info</div>`;
        Object.assign(document.body.style, {
            textAlign: 'center',
            color: 'red',
            fontSize: '2.5rem',
        })
    }else if(param === 'quiz created') {
        document.querySelector('body').innerHTML = `<div>Quiz has successfully been created, your quiz id is</div> <b> <div>${param2}</div> <div><a href="/">Back to dashboard</a></div>`
        Object.assign(document.body.style, {
            textAlign: 'center',
            color: 'white',
            fontSize: '2.5rem'
        })
    }else if(param === 'fetch err') {
        document.querySelector('body').innerHTML = `<div>Unable to connect to the server at this time try again later</div><div><a href="/">Back to home</a></div>`
            Object.assign(document.body.style, {
                textAlign: 'center',
                color: 'red',
                fontSize: '2.5rem'
            })
    }
}