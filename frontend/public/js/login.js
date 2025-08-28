const slides = document.querySelectorAll('.slide')
let currentIndex = 0;
let isTyping = true;
// const fullnameInput = document.getElementById('fullnameInput')
// const emailInput = document.getElementById('emailInput')
// const passwordInput = document.getElementById('passwordInput')
// const confirmPasswordInput = document.getElementById('confirmPasswordInput')
// const surnameOriginalStyle = surnameInput.getAttribute("style")
// const firstnameOriginalStyle = firstnameInput.getAttribute('style')
// const emailOriginalStyle = emailInput.getAttribute('style')
// const passwordOriginalStyle = passwordInput.getAttribute('style')
// const confirmPasswordOriginalStyle = confirmPasswordInput.getAttribute('style')



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

document.getElementById('loginBttn').addEventListener('click', async () => {
    console.log('clicked')
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value
    console.log(email, password)
    const response = await fetch('http://localhost:7050/login', {
        method: 'Post',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    const result = await response.json()
    if (result.statuz === 'failed') {
        document.querySelector('.message').innerHTML = result.message
    }else if(result.statuz === 'success') {
        window.location.href = result.redirect
        sessionStorage.setItem('user', JSON.stringify(result.names))
    }
})

document.getElementById('signupLink').addEventListener('click' || 'touch', () => {
    window.location.href = 'http://localhost:7050/signup'
})