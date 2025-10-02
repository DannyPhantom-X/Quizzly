const slides = document.querySelectorAll('.slide')
let currentIndex = 0;
let isTyping = true;
const fullnameInput = document.getElementById('fullnameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const confirmPasswordInput = document.getElementById('confirmPasswordInput')
const surnameOriginalStyle = surnameInput.getAttribute("style")
const firstnameOriginalStyle = firstnameInput.getAttribute('style')
const emailOriginalStyle = emailInput.getAttribute('style')
const passwordOriginalStyle = passwordInput.getAttribute('style')
const confirmPasswordOriginalStyle = confirmPasswordInput.getAttribute('style')



setInterval(() => {
    if (isTyping === true) {
        isTyping = false;
        document.querySelectorAll('.description div span').forEach((span) =>{
            span.style.animation = 'delete 3s ease-in-out';
        })
    }else {
        isTyping = true;
        document.querySelectorAll('.description div span').forEach((span) =>{
            span.style.animation = 'typing 3s ease-in-out';
        })
    }    
}, 3000)

setInterval(() => {
    
    if (currentIndex < (slides.length - 1)) {
        // slides.style.transition = 'transform 0.5s eas-in-out';
        nextDescription();
    }else{
        // slides.style.transition '';
        currentIndex = -1;
        nextDescription();
    }

    
}, 6000)    

function nextDescription() {
    currentIndex ++;
    let offset = -currentIndex * 100;
    slides.forEach((slide) => {
        slide.style.transform = `translateX(${offset}%)`;
    })
}
document.getElementById('signupButton').addEventListener('click' || 'touch', async () => {
    loadScreen('add')
    surnameInput.setAttribute('style', surnameOriginalStyle)
    firstnameInput.setAttribute('style', firstnameOriginalStyle)
    emailInput.setAttribute('style', emailOriginalStyle)
    passwordInput.setAttribute('style', passwordOriginalStyle)
    confirmPasswordInput.setAttribute('style', confirmPasswordOriginalStyle)
    const surname = document.getElementById('surnameInput').value
    const firstname = document.getElementById('firstnameInput').value
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value
    const confirmPassword = document.getElementById('confirmPasswordInput').value
    const response = await fetch('/signup', {
        method: 'Post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
                surname: surname,
                firstname: firstname,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
    })
    const result = await response.json()
    console.log(result)
    await delay(3000)
    loadScreen('remove')
    if (result.statuz === 'failed') {
        if (result.reason === 'surname') {
            Object.assign(surnameInput.style, {
                borderColor: 'red'
            })
        }else if(result.reason === 'firstname'){
            Object.assign(firstnameInput.style, {
                borderColor: 'red'
            })
        }
        else if(result.reason === 'email') {
            Object.assign(emailInput.style, {
                borderColor: 'red',
            })
        }else if(result.reason === 'password') {
            Object.assign(passwordInput.style, {
                borderColor: 'red',
            })
        }else if(result.reason === 'confirmpassword') {
            Object.assign(confirmPasswordInput.style, {
                borderColor: 'red'
            })
        }
        document.getElementById('message').innerHTML = result.message
    }else if (result.statuz === 'success') {
        window.location.href = result.redirect
    }
})

document.getElementById('loginLink').addEventListener('click' || 'touch', () => {
    window.location.href = '/login'
})


function loadScreen(param) {
    if (param === 'add') {
        document.querySelector('.body').classList.add('faded')
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('.body').classList.remove('faded')
    document.querySelector('.load-screen').classList.remove('load-screen-style')
    document.querySelector('.load-screen').innerHTML = ''
    }

}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}