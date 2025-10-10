const startBttn = document.querySelector('.start-bttn')
const confirmStartBttn = document.querySelector('.confirm-start-bttn')
const cancelBttn = document.querySelector('.cancel-bttn')
const path = window.location.pathname
const instructionDiv = document.querySelector('.instruction-div')
const formMain = document.querySelector('.form-main')
function form(param) { return `<div class="form-div">
                <label for="">${param}</label>
                <input class="cand-input">
    </div>`
}
let candDetails = []
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${path}/details/api`);
    const result = await response.json();
    console.log(result)
    instructionDiv.innerHTML = result.instruction
    result.candInfo.forEach((ci) => {
        formMain.innerHTML += form(ci);
    })
    document.querySelector('body').style.display = 'revert'
})
startBttn.addEventListener('click' || 'touch', () => {
    const formDiv = document.querySelectorAll('.form-div')
    for (const fd of formDiv) {
        let input = fd.querySelector('.cand-input')
        if (input.value === '') {
            input.style.borderColor = 'red'
            return;
        }
        candDetails.push({label: fd.querySelector('label').textContent, value: input.value})
    }
    document.querySelector('body').classList.add('faded')
    document.querySelector('aside').style.display = 'flex'
})
confirmStartBttn.addEventListener('click' || 'touch', async () => {
    sessionStorage.setItem('candDetails', JSON.stringify(candDetails))
    const response = await fetch(`${path}/details/proceed`, {
        method: 'Post',
        headers: {
            "Content-type": 'application/json'
        },
        body: JSON.stringify(candDetails)
    })
    const result = await response.json()
    window.location.href = result.redirectTo
})
cancelBttn.addEventListener('click' || 'touch', () => {
    document.querySelector('body').classList.remove('faded')
    document.querySelector('aside').style.display = 'none'   
})
document.querySelector('header img').addEventListener('click' || 'touch', () => {
    window.location.href = '/'
})