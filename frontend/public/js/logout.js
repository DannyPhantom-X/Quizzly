const nameDiv = document.querySelector('.name-div');
const logoBttn = document.querySelector('.logo-bttn')
const logoutBttn = document.querySelector('.logout-bttn')
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/currentuser');
    const result = await response.json();
    nameDiv.innerHTML = `${result.surname} ${result.firstname}`
})

logoBttn.addEventListener('click' || 'touch', () => {
    window.location.href = '/'
})

logoutBttn.addEventListener('click' || 'touch', async () => {
    const response = await fetch('/api/user/logout')
    const result = await response.json()
    console.log(result)
    window.location.href = '/'
})
