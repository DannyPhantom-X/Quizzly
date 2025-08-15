const target = document.getElementById('infoOriginal')
const container = document.getElementById('body')
const originalInput = document.getElementById('originalInput')
console.log(JSON.parse(sessionStorage.getItem('quizInfo')))
document.querySelector('.add-button').addEventListener('click' || 'touch', () => {
    const div = document.createElement('div')
    div.classList.add('info')
    div.innerHTML = `<input type="text" value="${originalInput.value}">`
    originalInput.value = ''
    container.insertBefore(div, target)
})