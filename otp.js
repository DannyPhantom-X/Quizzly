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
    })
})

submit()

function submit() {
    document.body.addEventListener('keyup', () => {
        if(numInputs[0].value !== '' && numInputs[1].value !== '' && numInputs[2].value !== '' && numInputs[3].value !== '') {
            console.log('Submitted!!!')
        }
    })
    
}

setInterval(() => {
    if(seconds.innerHTML === '00') {
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