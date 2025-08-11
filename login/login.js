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

document.getElementById('signupLink').addEventListener('click' || 'touch', () => {
    window.location.href = '../signup/signup.html'
})