const subjectName = document.querySelector('.subject-name');
const noQues = document.getElementById('noQues');
const duration = document.getElementById('duration');
const author = document.getElementById('author');
const path = window.location.pathname;
const proceedBttn = document.querySelector('.proceed-button');
let duraText = ''

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${path}/api`)
    const result =  await response.json()
    subjectName.textContent = result.subject;
    noQues.textContent = result.noQues;
    const duraList = result.duration.split(':')
    for(i=0; i < 3; i++) {
        if (i === 0 && duraList[i] !== '00') { duraText += `${Number(duraList[i])}h `}
        if(i === 1 && duraList[i] !== '00') {duraText += `${Number(duraList[i])}m `}
        if (i === 2 && duraList[i] !== '00') {duraText += `${Number(duraList[i])}s `}
    }
    console.log(duraText)
    duration.textContent = duraText;
    author.textContent = `by ${result.author}`;
    console.log(result)
})

proceedBttn.addEventListener('click' || 'touch', async () => {
    console.log('clicked')
    const response = await fetch(`${path}/proceed`)
    const result = await response.json()
    window.location.href = result.redirectTo
})