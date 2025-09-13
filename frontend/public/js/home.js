const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isTyping = true;
const loginSignupInfo = document.getElementById('loginSignupInfo');          
const loadOut = `<div class="top">
                    <img class="logo" src="public/resources/quizzlydesign.png" alt="">
                    <button class="cancel-button">X</button>
                </div>
                <div class="info-div">Log in or Sign up to either create or take quiz</div>
                <button class="signup-bttn" id="signup-bttn">Sign up</button>
                <button class="login-bttn">Log in</button>`;
let currentUser;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/currentuser')
    const result = await response.json()
    currentUser = result;
    console.log(currentUser)
    if(currentUser.statuz === 'success') {
        console.log('alright')
        document.querySelector('.last-div').innerHTML = `
        <a class="about-link part">About</a><a href="/quizzes" class="quizzes-link part">Quizzes</a> 
        <span class="profile-pic"><img src="/public/resources/unknown.jpg"></span>
        <nav class="hidden-menu"><a href="/quizzes" class="quizzes-link exists">Quizzes</a><a class="about-link exists">About</a><a class="logout-link">Logout</a> </nav>`;
        document.querySelector('.last-div').style.cssText = 'color: #BD53ED; font-size: 1.2rem; font-weight: bold;'
        onclickUser()
    }else{
        document.querySelector('.last-div').innerHTML = `<button class="signup-header-bttn" id="signup-bttn">Signup</button>`;
        onclickSignup();
    }
    console.log(currentUser)
})


function nextDescription() {
    currentIndex ++;
    let offset = -currentIndex * 100;
    slides.forEach((slide) => {
        slide.style.transform = `translateX(${offset}%)`;
    })
}

document.getElementById('takeQuiz').addEventListener('click' || 'touch', () => {
    checkLoginToMoveon('takequiz')
})

document.getElementById('createQuiz').addEventListener('click' || 'touch', () => {
    checkLoginToMoveon('createquiz')
})

function checkLoginToMoveon(param) {
    if (currentUser.statuz === 'success') {
        window.location.href = `/${param}`
    }else{
        loginSignupInfo.classList.add('login-signup-info-style');
        loginSignupInfo.innerHTML = loadOut;
        document.querySelector('.input').classList.add('faded')
        document.querySelector('header').classList.add('faded')
        document.querySelector('.beginning-page').classList.add('faded')
        document.querySelector('footer').classList.add('faded')
        onclickcancelButton()
        document.querySelector('.login-bttn').addEventListener('click' || 'touch', () => {
            window.location.href = '/login'
        })
        onclickSignup()
    }
}


function onclickSignup() {
    document.querySelectorAll('#signup-bttn').forEach((sign) => {
        console.log('clicked')
        sign.addEventListener('click' || 'touch', () => {
            window.location.href = '/signup'
        })
    })    
}

function onclickcancelButton() {
    document.querySelector('.cancel-button').addEventListener('click' || 'touch', () => {
        loginSignupInfo.classList.remove('login-signup-info-style');
        loginSignupInfo.innerHTML = '';
        document.querySelector('.input').classList.remove('faded')
        document.querySelector('header').classList.remove('faded')
        document.querySelector('.beginning-page').classList.remove('faded')
        document.querySelector('footer').classList.remove('faded')
    })
}

function onclickUser() {
    const hiddenMenu = document.querySelector('.hidden-menu')
    const logoutLink = document.querySelector('.logout-link')
    document.querySelector('.profile-pic').addEventListener('click' || 'touch', (e) => {
        hiddenMenu.classList.toggle('active')
        e.stopPropagation()
    })
    document.body.addEventListener('click' || 'touch', (e) => {
        if(hiddenMenu.classList[1] || hiddenMenu.classList[0] == 'active') {
            console.log('reacehd')
            hiddenMenu.classList.toggle('active')
            e.stopPropagation()
        }
    })
    logoutLink.addEventListener('click' || 'touch', () => {
        window.location.href = '/logout'
    })
}