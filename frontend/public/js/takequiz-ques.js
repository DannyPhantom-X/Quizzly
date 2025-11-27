let questions;
const questionDiv = document.querySelector('.question-div')
const options = document.querySelector('.options')
const answerArea = document.querySelector('.answer-area')
const nextBttn = document.querySelector('.next-bttn')
const previousBttn = document.querySelector('.previous-bttn')
const path = window.location.pathname
let number = 1;
let noQue;
let optionsStats;
function renderQues(param, num) {
    return `<span class="number">${num}. </span>
        <span>${param}</span>
    `
}
function renderOption(param, num) {
    return `<label class="option">
                    <input type="radio" name="option${num}" class="check-option">
                    <span>${param}</span>
            </label>`
}
window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${path}/ques/api`);
    const result = await response.json();
    questions = result.questions
    noQue = Number(result.noQues)
    optionsStats = result.optionsStats
    if (!result.optionsStats) {
        questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
        options.style.display = 'none';
        answerArea.style.display = 'flex';
        answerArea.value = questions[number-1].answer
    }else{
        questionDiv.innerHTML = renderQues(questions[number - 1].question, number)    
        answerArea.style.display = 'none';
        options.style.display = 'flex';
        questions[number-1].options.forEach((option) => {
            options.innerHTML += renderOption(option, number)
        })
    }
    number === 1 ? previousBttn.classList.add('faded') : null;
    document.querySelector('body').style.display = 'flex'
})

nextBttn.addEventListener('click' || 'touch', async () => {
    if (noQue === number) {
        loadScreen('add')
        questions[number-1].answer = answerArea.value
        const response = await fetch(`${path}/ques/submit`, {
            method: 'Post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                candDetails: JSON.parse(sessionStorage.getItem('candDetails')),
                quesandans: questions
            })
        })
        const result = await response.json()
        await delay(5000)
        loadScreen('remove')
        document.querySelector('body').innerHTML = showScore(result)
        animate(result.percentage, result.score)
        // return;
    }else{
        if (!optionsStats) {
            questions[number-1].answer = answerArea.value;
            number += 1;
            answerArea.value = questions[number-1].answer;
        }else{
            document.querySelectorAll('.check-option').forEach((co) => {
                if(co.checked) {
                    questions[number-1].answer = co.nextElementSibling.innerHTML;
                    co.checked = false;
                }
            })
            number += 1;
            document.querySelectorAll('.check-option').forEach((co, i) => {
                co.nextElementSibling.innerHTML = questions[number-1].options[i]
                if(questions[number-1].answer == co.nextElementSibling.innerHTML) {
                    console.log(co.innerHTML)
                    co.checked = true;
                }
            })
        }
        questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
        noQue === number ? nextBttn.textContent = 'Submit' : null;
        number !== 1 ? previousBttn.classList.remove('faded') : null;
    }
})
previousBttn.addEventListener('click' || 'touch', () => {
    noQue === number ? nextBttn.textContent = 'Next' : null;
    if (!optionsStats) {
        questions[number-1].answer = answerArea.value
        number -= 1
        answerArea.value = questions[number-1].answer
    }else{
        document.querySelectorAll('.check-option').forEach((co) => {
            if(co.checked) {
                questions[number-1].answer = co.nextElementSibling.innerHTML;
                co.checked = false;
            }
        })
        number -= 1;
        document.querySelectorAll('.check-option').forEach((co, i) => {
            co.nextElementSibling.innerHTML = questions[number-1].options[i]
            if(questions[number-1].answer == co.nextElementSibling.innerHTML) {
                console.log(co.innerHTML)
                co.checked = true;
            }
        })
    }
    questionDiv.innerHTML = renderQues(questions[number - 1].question, number)
    number === 1 ? previousBttn.classList.add('faded') : null;
})
function loadScreen(param) {
    if (param === 'add') {
        document.querySelector('body *:not(.load-screen)').classList.add('faded')
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('body *:not(.load-screen)').classList.remove('faded')
    document.querySelector('.load-screen').classList.remove('load-screen-style')
    document.querySelector('.load-screen').innerHTML = ''
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
console.log(JSON.parse(sessionStorage.getItem('candDetails')))


function showScore(param) {
    return `<main class="finish-main">
            <div class="subject"><div>${param.subject}</div></div>
            <div class="score-ring">
                <span class="score-value"></span>
            </div>
            <div class="noQues-div">
                <span for="">No of Questions: ${param.noQues}</span>
            </div>
            <div class="score-percentage">Percentage: ${param.percentage}</div>
            <div class="home-div"><a href="/">Home</a></div>
        </main>`
}
function animate(limit, score) {
    let current = 0
    let intervalId = setInterval(() => {
        if(current >= limit) {
            document.querySelector('.score-value').innerHTML = `${score}`
            clearInterval(intervalId)
            document.querySelector('.home-div').style.display = 'block';
            document.querySelector('.noQues-div').style.display = 'block';
            document.querySelector('.score-percentage').style.display = 'block';
        }else{
            current ++
            document.querySelector('.score-ring').style.background = `conic-gradient(#4CAF50 ${current}%, #F44336 0)`;
        }
    }, 50)
}