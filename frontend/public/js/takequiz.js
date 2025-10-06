const inputId = document.querySelector('.input-id');
const submitBttn = document.querySelector('.submit')
const loadScreen = document.querySelector('.load-screen')
const bodyStyle = document.querySelector('body').getAttribute('style')

submitBttn.addEventListener('click' || 'touch', async () => {
    console.log('submit clicked')
    loadScreenFunc('add')
    if (inputId.value != '') {
        const response = await fetch('/takequiz', {
            method: 'Post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                quizId: inputId.value
            })
        })
        const result = await response.json();
        if(result.statuz === 'success') {
            await delay(2000)
            console.log('success')
            window.location.href = `/takequiz/${inputId.value}`
        }else{
            await delay(2000)
            loadScreenFunc('remove')
            inputId.style.cssText = 'border-style: solid; border-color: red; border-width: 2px;';
        }
    }else{
        inputId.style.cssText = 'border-style: solid; border-color: red; border-width: 2px;';
        loadScreenFunc('remove')
    }
})


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function loadScreenFunc(param) {
    if (param === 'add') {
        document.querySelector('body').style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        document.querySelector('body').style.backgroundImage = 'none'
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.add('faded')
        })
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('body').setAttribute('style', bodyStyle)
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.remove('faded')
        })
        document.querySelector('.load-screen').classList.remove('load-screen-style')
        document.querySelector('.load-screen').innerHTML = ''
    }

}