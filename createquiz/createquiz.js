const optionsCheckbox = document.getElementById('optionsToggle')
const subjectInput = document.getElementById('subjectInput')
const minutesInput = document.getElementById('minutesInput')
const noQuesInput = document.getElementById('noQuesInput')
const noOptionsInput = document.getElementById('noOptionsInput')
const randOptionsInput = document.getElementById('randOptionsInput')
const instructionsInput = document.getElementById('instructionsInput')
const candInfo = `
                <div class="intro"><i>Please Create the Candidates Information Section</i></div>
                <div class="eg"><i>e.g Name, Mobile Number, Email</i></div>
                <div class="body" id="cand-body">
                    <div class="info" id="infoOriginal">
                        <input type="text" id="originalInput">
                        <button class="add-button"><i class="fas fa-plus" title="plus"></i></button>
                        <!-- <button class="add-button delete-button"></button> -->
                    </div>
                    <button class="next-button">Next</button>
                </div>
`



if (!optionsCheckbox.checked) {
    console.log('not checked')
    document.querySelectorAll('.fade').forEach((faded) => {
        faded.classList.add('faded')
    })
}
optionsCheckbox.addEventListener('click' || 'touch', () => {
    if (!optionsCheckbox.checked) {
        console.log('not checked')
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
    document.querySelector('.form-card').style.transform = 'rotateY(360deg)'
    setTimeout(() => {
        document.querySelector('.form-card').style.height = '400px'
        document.querySelector('.form-card').innerHTML = candInfo
    }, 400)
    // console.log('clicked')
    // console.log(instructionsInput.value)
    // let subject;
    // let interval;
    // let noQues;
    // let randQues;
    // let noOptions;
    // let options;
    // let randOptions;
    // let instructions;
    // console.log('next -button')
    // if (!subjectInput.value) {
    //     subjectInput.style.borderColor = 'red';
    //     return;
    // }
    // if (minutesInput.value == '00' || minutesInput.value == '0' || !minutesInput) {
    //     minutesInput.style.borderColor ='red';
    //     return;
    // }
    // if (!noQuesInput.value) {
    //     noQuesInput.style.borderColor = 'red';
    //     return;
    // }
    // if (optionsCheckbox.checked) {
    //     console.log(typeof noOptionsInput.value)
    //     if (!noOptionsInput.value || Number(noOptionsInput.value) > 5) {
    //         noOptionsInput.style.borderColor = 'red'
    //         return;
    //     }
    //     subject = subjectInput.value;
    //     noQues = noQuesInput.value;
    //     interval = `${document.getElementById('hourInput').value}:${document.getElementById('minutesInput').value}:${document.getElementById('secondsInput').value}`;
    //     randQues = document.getElementById('randQuesInput').checked
    //     console.log(randQues)
    //     noOptions = noOptionsInput.value
    //     randOptions = randOptionsInput.checked
    //     options = optionsCheckbox.checked
    //     instructions = instructionsInput.value
    //     console.log(instructions)
    //     sessionStorage.setItem('quizInfo', JSON.stringify({subject, interval, noQues, randQues, noOptions, randOptions, instructions, options}))
    // }
    // else{
    //     subject = subjectInput.value;
    //     noQues = noQuesInput.value;
    //     interval = `${document.getElementById('hourInput').value}:${document.getElementById('minutesInput').value}:${document.getElementById('secondsInput').value}`;
    //     randQues = document.getElementById('randQuesInput').checked
    //     console.log(randQues)
    //     options = optionsCheckbox.checked
    //     instructions = instructionsInput.value
    //     sessionStorage.setItem('quizInfo', JSON.stringify({ subject, interval, noQues, randQues, instructions, options}))
    // }
    // console.log(JSON.parse(sessionStorage.getItem('quizInfo')))
    // window.location.href = 'createquiz-cand-info.html'
    // console.log(sessionStorage.getItem('quizInfo'))    
})