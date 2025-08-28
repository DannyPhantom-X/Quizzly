// import { candInfoJs } from "../createquiz/createquiz-cand-info"
// console.log(candInfoJs)
// import '/simplebar'; 
// import '/simplebar/dist/simplebar.css';
const optionsCheckbox = document.getElementById('optionsToggle')
const subjectInput = document.getElementById('subjectInput')
const minutesInput = document.getElementById('minutesInput')
const noQuesInput = document.getElementById('noQuesInput')
const noOptionsInput = document.getElementById('noOptionsInput')
const randOptionsInput = document.getElementById('randOptionsInput')
const instructionsInput = document.getElementById('instructionsInput')
const hourInput = document.getElementById('hourInput')
const secondsInput = document.getElementById('secondsInput')

backQuizInfo()
if (!optionsCheckbox.checked) {
    document.querySelectorAll('.fade').forEach((faded) => {
        faded.classList.add('faded')
    })
}
optionsCheckbox.addEventListener('click' || 'touch', () => {
    if (!optionsCheckbox.checked) {
        document.querySelectorAll('.fade').forEach((faded) => {
            faded.classList.add('faded')
        })
    }else{
        document.querySelectorAll('.fade').forEach((faded) => {
            faded.classList.remove('faded')
        })
    }
})

document.querySelector('.next-btn').addEventListener('click' || 'touch', () => {
    console.log('clicked')
    console.log(instructionsInput.value)
    let subject;
    let interval;
    let noQues;
    let randQues;
    let noOptions;
    let options;
    let randOptions;
    let instructions;
    if (!subjectInput.value) {
        subjectInput.style.borderColor = 'red';
        return;
    }
    if ((minutesInput.value == '00' || minutesInput.value == '0' || !minutesInput) && (hourInput == '00' || hourInput == '0' || !hourInput)) {
        minutesInput.style.borderColor ='red';
        return;
    }
    if (!noQuesInput.value) {
        noQuesInput.style.borderColor = 'red';
        return;
    }
    if (optionsCheckbox.checked) {
        console.log(typeof noOptionsInput.value)
        if (!noOptionsInput.value || Number(noOptionsInput.value) > 5) {
            noOptionsInput.style.borderColor = 'red'
            return;
        }
        subject = subjectInput.value;
        noQues = noQuesInput.value;
        interval = `${hourInput.value}:${minutesInput.value}:${secondsInput.value}`;
        randQues = document.getElementById('randQuesInput').checked
        console.log(randQues)
        noOptions = noOptionsInput.value
        randOptions = randOptionsInput.checked
        options = optionsCheckbox.checked
        instructions = instructionsInput.value
        console.log(instructions)
        sessionStorage.setItem('quizInfo', JSON.stringify({subject, interval, noQues, randQues, noOptions, randOptions, instructions, options}))
    }
    else{
        subject = subjectInput.value;
        noQues = noQuesInput.value;
        interval = `${hourInput.value}:${minutesInput.value}:${secondsInput.value}`;
        randQues = document.getElementById('randQuesInput').checked
        console.log(randQues)
        options = optionsCheckbox.checked
        instructions = instructionsInput.value
        sessionStorage.setItem('quizInfo', JSON.stringify({ subject, interval, noQues, randQues, instructions, options}))
    }
    console.log(JSON.parse(sessionStorage.getItem('quizInfo')));
    document.querySelector('.form-card-inner').style.transform = 'rotateY(180deg)';
    candInfoJs()
    // window.location.href = 'createquiz-cand-info.html'
    console.log(sessionStorage.getItem('quizInfo'));    
})



function backQuizInfo() {
    document.getElementById('backBttnQuizInfo').addEventListener('click' || 'touch', () => {
        console.log('clicked')
        window.location.href = '/';
    })
}