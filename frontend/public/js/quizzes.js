const createdSpan = document.querySelector('.created-text');
const takenSpan = document.querySelector('.taken-text');
const info = document.querySelector('.info');
const ctdChoice = document.querySelector('.ctd-choice');
const tknChoice = document.querySelector('.tkn-choice');
const backToHomeBttn = document.querySelector('.back-to-home');
const nameDiv = document.querySelector('.name-div');

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/currentuser');
    const result = await response.json();
    nameDiv.innerHTML = `${result.surname} ${result.firstname}`;
})



function tkn(param) { return`<div class="taken-info"><div class="taken-quiz-div">
                    <p>${param.subject}</p>
                    <p>${param.noQues} Questions</p>
                    <p>${param.duration}</p>
                    <div class="quiz-id-copy-div">
                        <p class="quiz-id-tkn">${param.quizId}</p>
                        <button class="copy-bttn"><i class="fa fa-copy"></i></button>
                    </div>
                    <h1 class="author">by ${param.authorName}</h1>
                </div>
                </div>`;}
function ctd(param) {return` <div class="created-info">
                    <div class="ctd-quiz-div">
                        <h1>${param.subject}</h1>
                        <p>${param.noQues} Questions</p>
                        <div class="quiz-id-copy-div">
                            <p class="quiz-id-ctd">${param.quizId}</p>
                            <button class="copy-bttn"><i class="fa fa-copy"></i></button>
                        </div>
                        <p>Attemted by: ${param.attemptedBy}</p>
                    </div>
                </div>`};
checker()
createdSpan.addEventListener('click', async () => {
    if(!ctdChoice.checked) {
        await fetchQuizInfo('ctd')
        onclickCtdCopy();
    }
})
takenSpan.addEventListener('click', async () => {
    if(!tknChoice.checked) {
        await fetchQuizInfo('tkn')
        onclicktknCopy()
    }
})

async function checker() {
    if(ctdChoice.checked) {
        await fetchQuizInfo('ctd')
        onclickCtdCopy();
    }else if(tknChoice.checked){
        await fetchQuizInfo('tkn')
        onclicktknCopy()

    }
}

backToHomeBttn.addEventListener('click' || 'touch', () => {
    window.location.href = '/'
})

function onclickCtdCopy() {
    const copyBttn = document.querySelectorAll('.copy-bttn')
    const ctdQuizDiv = document.querySelectorAll('.ctd-quiz-div')
    const quizId = document.querySelectorAll('.quiz-id-ctd')
    copyBttn.forEach((cb, i) => {
        cb.addEventListener('click' || 'touch', async (e) => {
            console.log('about to copy')
            e.stopPropagation()
            try{
                await navigator.clipboard.writeText(quizId[i].innerHTML)
                alert('The Quiz Id has been copied successfully to your clipboard ✅')
            }catch {
                alert('Unable to copy Quiz Id to clipboard')
            }
            
            console.log('done copying')
        })
    })
    ctdQuizDiv.forEach((cqd, i) => {
            cqd.addEventListener('click' || 'touch', () => {
                console.log('about that particular quiz '+ quizId[i].innerHTML)
            })
    })        
}


function onclicktknCopy() {
    const copyBttn = document.querySelectorAll('.copy-bttn')
    const tknQuizDiv = document.querySelectorAll('.taken-quiz-div')
    const quizId = document.querySelectorAll('.quiz-id-tkn')
    copyBttn.forEach((cb, i) => {
        cb.addEventListener('click' || 'touch', async (e) => {
            console.log('about to copy')
            e.stopPropagation()
            await navigator.clipboard.writeText(quizId[i].innerHTML)
            alert('The Quiz Id has been copied successfully to your clipboard ✅')
            console.log('done copying')
        })
    })
    tknQuizDiv.forEach((tqd, i) => {
            tqd.addEventListener('click' || 'touch', () => {
                console.log('about that particular quiz '+ quizId[i].innerHTML)
            })
    })        
}

async function fetchQuizInfo(param) {
    info.innerHTML = ''
    if (param === 'tkn' || param === 'ctd') {
        console.log('if...else... working');
    }else{
        return 'helllo world';
    }
    try{
        const response = await fetch(`/user-${param}-quizzes-info`)
        const result = await response.json()
        if (result.answer.length === 0){ 
            info.innerHTML = `<span class="unavailable">Unavailable . . .</span>`; 
        }
        result.answer.forEach((res) => {
            param === 'ctd' ? info.innerHTML = ctd(res): param === 'tkn' ? info.innerHTML = tkn(res) : console.log('lost access');
        })
    }catch {
        console.error('An error was occured')
    }
       
}