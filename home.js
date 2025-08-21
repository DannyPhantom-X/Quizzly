const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isTyping = true;
const loginSignupInfo = document.getElementById('loginSignupInfo');          
const loadOut = `<div class="top">
                    <img class="logo" src="resources/Quizzlylogodesign.png" alt="">
                    <button class="cancel-button">X</button>
                </div>
                
                <div class="info-div">Log in or Sign up to either create or take quiz</div>
                <button class="signup-bttn">Sign up</button>
                <button class="login-bttn">Log in</button>`;
setInterval(() => {
    if (isTyping === true) {
        isTyping = false;
        document.querySelectorAll('.slide span').forEach((span) =>{
            span.style.animation = 'delete 3s ease-in-out';
        })
    }else {
        isTyping = true;
        document.querySelectorAll('.slide span').forEach((span) =>{
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

document.getElementById('takeQuiz').addEventListener('click' || 'touch', () => {
    window.location.href = 'takequiz/takequiz.html';
})

document.getElementById('createQuiz').addEventListener('click', () => {
    loginSignupInfo.classList.add('login-signup-info-style');
    loginSignupInfo.innerHTML = loadOut;
    document.querySelector('.input').classList.add('faded')
    document.querySelector('header').classList.add('faded')
    document.querySelector('.site-info').classList.add('faded')
    document.querySelector('footer').classList.add('faded')
    onclickcancelButton()
    document.querySelector('.login-bttn').addEventListener('click' || 'touch', () => {
        window.location.href = 'login/login.html'
    })
    document.querySelector('.signup-bttn').addEventListener('click' || 'touch', () => {
        window.location.href = 'signup/signup.html'
    })
})

function onclickcancelButton() {
    document.querySelector('.cancel-button').addEventListener('click' || 'touch', () => {
        loginSignupInfo.classList.remove('login-signup-info-style');
        loginSignupInfo.innerHTML = '';
        document.querySelector('.input').classList.remove('faded')
        document.querySelector('header').classList.remove('faded')
        document.querySelector('.site-info').classList.remove('faded')
        document.querySelector('footer').classList.remove('faded')
    })
}