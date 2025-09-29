const startBttn = document.querySelector('.start-bttn')
const confirmStartBttn = document.querySelector('.confirm-start-bttn')
const cancelBttn = document.querySelector('.cancel-bttn')
const path = window.location.pathname
const instructionDiv = document.querySelector('.instruction-div')
const formDiv = document.querySelector('.form')
function form(param) { return `<label for="">${param}</label>
                <input class="cand-input">`
}

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${path}/cand-info/api`);
    const result = await response.json();
    console.log(result)
    instructionDiv.innerHTML = result.instruction
    result.candInfo.forEach((ci) => {
        formDiv.innerHTML += form(ci);
    })
})
startBttn.addEventListener('click' || 'touch', () => {
    document.querySelector('body').classList.add('faded')
    document.querySelector('aside').style.display = 'flex'
})

cancelBttn.addEventListener('click' || 'touch', () => {
    document.querySelector('body').classList.remove('faded')
    document.querySelector('aside').style.display = 'none'    
})
