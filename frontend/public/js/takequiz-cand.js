const startBttn = document.querySelector('.start-bttn')
const confirmStartBttn = document.querySelector('.confirm-start-bttn')
const cancelBttn = document.querySelector('.cancel-bttn')

startBttn.addEventListener('click' || 'touch', () => {
    document.querySelector('body').classList.add('faded')
    document.querySelector('aside').style.display = 'flex'
})

cancelBttn.addEventListener('click' || 'touch', () => {
    document.querySelector('body').classList.remove('faded')
    document.querySelector('aside').style.display = 'none'    
})
