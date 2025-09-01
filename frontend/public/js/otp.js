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
        submit()
        console.log(typeof numInput.value)
    })
})

submit()

function submit() {
    document.body.addEventListener('keyup', async () => {
        if(numInputs[0].value !== '' && numInputs[1].value !== '' && numInputs[2].value !== '' && numInputs[3].value !== '') {
            console.log('Submitted!!!')
            let otp = ''
            numInputs.forEach((numInput) => {
                otp += numInput.value
            })
            loadScreen('add')
            const response = await fetch('http://localhost:7050/signup/otp/verification', {
                method: 'Post',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    otp: otp
                })
            })
            const result = await response.json()
            await delay(3000)
            if(result.statuz === 'failed') {
                loadScreen('remove')
                numInputs.forEach((numInput) => {
                    numInput.value = ''
                    numInput.style.animation = 'wrongShake 0.5s'
                    numInput.style.fillmode = 'forwards'
                })
                document.querySelector('.message').innerHTML = result.message
                await delay(1000)
                document.querySelector('.message').innerHTML = result.message
            }else if(result.statuz === 'success') {
                loadScreen('remove')
                sessionStorage.setItem('user', JSON.stringify(result.names))
                window.location.href= '/'
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
    document.querySelector('.resend').innerHTML = `Didn't recieve OTP, <span class="resend-link"> Resend</span>`
    document.querySelector('.resend-link').addEventListener('click', async () => {
        console.log('resend')
        await fetch('http://localhost:7050/signup/otp/resend', {
            method: 'Post',
            headers: {
                'Content-type': 'application/json'
            }
        });
    })
}, 120000)


function loadScreen(param) {
    if (param === 'add') {
        document.querySelector('.otp-container').classList.add('faded')
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('.otp-container').classList.remove('faded')
    document.querySelector('.load-screen').classList.remove('load-screen-style')
    document.querySelector('.load-screen').innerHTML = ''
    }

}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
