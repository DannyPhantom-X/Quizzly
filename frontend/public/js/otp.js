const numInputs = document.querySelectorAll('#numInput')
const minutes = document.querySelector('.minutes')
const seconds = document.querySelector('.seconds')
let sec = 0;
let min = 2;
numInputs.forEach((numInput, i)=> {
    numInput.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            if((numInput.value !== '')){
                e.preventDefault();
            }
        }else if (e.key == 'Backspace' && numInput.value === '') {
            numInput.previousElementSibling.focus()
        }
})
    numInput.addEventListener('keyup', (e) => {
        if (numInput.value.length > 1) {
            const chars = numInput.value.split('');
            numInput.value = '';
            console.log(chars)
            chars.forEach((char, i) => {
                console.log(i)
                if (i === 4) {console.log('trigger')}
                numInputs[i].value = char;
            })
        }
        if (e.key >= '0' && e.key <= '9'){
            if(i < 3) {
                console.log('yeeeppppp')
                numInput.nextElementSibling.focus();
            }
        }
        console.log(typeof numInput.value)
    })
})

submit()

function submit() {
    document.body.addEventListener('keyup', async () => {
        if(numInputs[0].value !== '' && numInputs[1].value !== '' && numInputs[2].value !== '' && numInputs[3].value !== '') {
            console.log('Submitted!!!')
            const token = JSON.parse(sessionStorage('userLogToken'))
            let otp = ''
            numInputs.forEach((numInput) => {
                otp += numInput.value
            })
            const response = await fetch('http://localhost:7050/signup/otp/verification', {
                method: Post,
                headers: {
                    "Authorization": token
                },
                body: JSON.stringify({
                    otp: otp
                })
            })
            const result = await response.json()
            if (result.statuz === 'Success') {
                window.location.href = 'home.html';
            }
        }
    })
    
}

const intervalId = setInterval(() => {
    if(seconds.innerHTML == '00' || sec == 0) {
        sec = 59;
        min -= 1
        seconds.innerHTML = sec
        minutes.innerHTML = min
    }else{
        sec -= 1
        if(sec < 10) {
            seconds.innerHTML = ` 0${sec}`;
        }else{
            seconds.innerHTML = sec;
        }
    }
}, 1000)

setTimeout(() => {
    clearInterval(intervalId)
    document.querySelector('.resend').innerHTML = "Resend OTP"
}, 120000)
