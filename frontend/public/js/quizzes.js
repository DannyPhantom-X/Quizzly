const createdSpan = document.querySelector('.created-text');
const takenSpan = document.querySelector('.taken-text');
const info = document.querySelector('.info');
const ctdChoice = document.querySelector('.ctd-choice');
const tknChoice = document.querySelector('.tkn-choice');
const backToHomeBttn = document.querySelector('.back-to-home');
const nameDiv = document.querySelector('.name-div');
let takenQuiz;
let createdQuiz;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/currentuser');
    const result = await response.json();
    await checker()
    console.log(result)
    document.querySelector('.pic-div img').src = result.profilePic || '/public/resources/unknown.jpg'
    nameDiv.innerHTML = `${result.surname} ${result.firstname}`;
    document.querySelector('body').style.display = 'block'
})



function tkn(param) { return`<div class="taken-quiz-div">
                        <p>${param.subject}</p>
                        <p>${param.noQues} Questions</p>
                        <p>${param.duration}</p>
                        <div class="quiz-id-copy-div">
                            <p class="quiz-id-tkn">${param.quizId}</p>
                            <button class="copy-bttn"><i class="fa fa-copy"></i></button>
                        </div>
                        <h1 class="author">by ${param.authorName}</h1>
                </div>`;}
function ctd(param) {return`<div class="ctd-quiz-div">
                        <h1>${param.subject}</h1>
                        <p>${param.noQues} Questions</p>
                        <div class="quiz-id-copy-div">
                            <p class="quiz-id-ctd">${param.quizId}</p>
                            <button class="copy-bttn"><i class="fa fa-copy"></i></button>
                        </div>
                        <p>Attemted by: ${param.attemptedBy}</p>
                    </div>`};
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
    let result;
    param === 'ctd' ? info.innerHTML =  '<div class="created-info"></div>' : param === 'tkn' ? info.innerHTML = '<div class="taken-info"></div>' : null;
    try{
        if(!createdQuiz || !takenQuiz) {
            const response = await fetch(`/quizzes/${param}-info`)
            result = await response.json()
            param === 'ctd' ? createdQuiz = result : param === 'tkn' ? takenQuiz = result : null;
        }else{
            param === 'ctd' ? result = createdQuiz : param === 'tkn' ? result = takenQuiz : null;
        }
        if (result.answer.length === 0){ 
            info.innerHTML = `<span class="unavailable">Unavailable . . .</span>`;
            return; 
        }
        result.answer.forEach((res) => {
            if (param === 'ctd') {
                document.querySelector('.created-info').innerHTML += ctd(res)
            }else if(param === 'tkn'){
                document.querySelector('.taken-info').innerHTML += tkn(res)
            }else{
                return;
            }
        })
    }catch(err){
        console.error('An error was occured')
    }
}