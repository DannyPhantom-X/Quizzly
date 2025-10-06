const changeBttn = document.querySelectorAll('.change-bttn');
const changeInput = document.querySelectorAll('.change-input');
const changeLabel = document.querySelectorAll('.change-label');
const changePasswordBttn = document.querySelector('.change-password-bttn');
const show = document.querySelectorAll('.show');
const fileInput = document.querySelector('.file-input');
const profilePic = document.querySelector('.profile-pic');
const date = new Date();
const changeProfPic = document.querySelector('.change-profpic');
const confirmDoneBttn = document.querySelector('.confirm-done-bttn');
const saveBttn = document.querySelector('.save-bttn');
const oldPasswordInput = document.querySelector('.old-password-input');
const newPasswordInput = document.querySelector('.new-password-input');
const confirmPasswordInput = document.querySelector('.confirm-password-input');
const verificationPassword = document.querySelector('.verification-password');
const surnameInput = document.querySelector('.surname-input');
const firstnameInput = document.querySelector('.firstname-input');
const emailInput = document.querySelector('.email-input')
const loadScreen = document.querySelector('.load-screen');
const doneBttn = document.querySelector('.done-bttn');
const emailShow = document.querySelector('.email-show');
const verificationEmail = document.querySelector('.verification-email')
let isEdited = [false, false, false, false, false];
let currentUser;

document.addEventListener('DOMContentLoaded', async () => {
    try{
        const response = await fetch('/api/currentuser');
        currentUser = await response.json();
        surnameInput.value = currentUser.surname;
        firstnameInput.value = currentUser.firstname;
        emailInput.value = currentUser.email;
        profilePic.src = currentUser.profilePic || '/public/resources/unknown.jpg'
        document.querySelector('body').style.display = 'block'
    }catch{
        alert('Unable to connect to server at this time!!!')
    }
    
})


changeProfPic.addEventListener('click', () => {
    console.log('Done')
})
changeBttn.forEach((cb, i) => {
    cb.addEventListener('click' || 'touch', () => {
        changeInput[i].classList.toggle('faded')
        if(changeInput[i].classList.contains('faded')) {
            i === 0 ? surnameInput.value = currentUser.surname : null;
            i === 1 ? firstnameInput.value = currentUser.firstname : null;
            i === 2 ? doneBttn.style.display = 'none': null;
            i === 2 ? emailInput.value = currentUser.email : null;
            cb.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
            const j = i + 1;
            isEdited[j] = false;
            saveChecker();
        }else{
            cb.innerHTML = 'X';
            changeInput[i].addEventListener('keyup', () => {
                const j = i + 1;
                if(i === 0 && currentUser.surname != changeInput[i].value) {
                    isEdited[j] = true;            
                }else if(i === 1 && currentUser.firstname != changeInput[i].value) {
                    isEdited[j] = true;
                }else if(i === 2 && currentUser.email != changeInput[i].value) {
                    doneBttn.style.display = 'flex';
                }else{
                    j == 3 ? doneBttn.style.display = 'none' : null;
                    isEdited[j] = false;
                }
                saveChecker()
            })
        }
    })
})


doneBttn.addEventListener('click' || 'touch', async () => {
    try{
        doneBttn.innerHTML = `<div class="processing"></div>`
        const response = await fetch('/myprofile/update/verification', {
            method: 'Post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                reason: 'email'
            })

        })
        console.log(response)
        const result = await response.json()
        if (result.statuz == 'success') {
            const [email, domain] = currentUser.email.split('@')
            const visible = email.slice(0, 2);
            const masked = '*'.repeat(Math.max(email.length - 2,2))
            emailShow.querySelector('span').innerHTML = `${visible}${masked}@${domain}`
            emailShow.style.display = 'block'
            doneBttn.innerHTML = '<i class="fas fa-check check-icon" title="Mark as complete"></i>'
            doneBttn.style.display = 'none'
            isEdited[3] = true;
            saveChecker()
        }else{
            alert('Server failed ❌')
        }
    }catch{
        alert('Server failed ❌')
    }
})

changePasswordBttn.addEventListener('click' || 'touch', () => {
    changePasswordBttn.style.display = 'none'
    saveBttn.classList.add('faded')
    show.forEach((s) => {
        s.style.display = 'block'
    })
})

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]
    const url = URL.createObjectURL(file);
    if (!file) {
        return;
    }
    profilePic.src = url;
    const form = new FormData()
    form.append('profilePic', file)
    console.log(form)
    isEdited[0] = true;
    saveChecker()
})

confirmDoneBttn.addEventListener('click' || 'touch', async () => {
    const isFailed = passwordChecker()
    if(!isFailed) {
        try{
            confirmDoneBttn.innerHTML = `<div class="processing"></div>`
            const response = await fetch('/myprofile/update/verification', {
                method: 'Post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    reason: 'password'
                })

            })
            console.log(response)
            const result = await response.json()
            console.log(result)
            if (result.statuz == 'success') {
                const [email, domain] = currentUser.email.split('@')
                const visible = email.slice(0, 2);
                const masked = '*'.repeat(Math.max(email.length - 2,2))
                document.querySelector('.latest-show').querySelector('span').innerHTML = `${visible}${masked}@${domain}`
                document.querySelector('.latest-show').style.display = 'block'
                confirmDoneBttn.innerHTML = '<i class="fas fa-check check-icon" title="Mark as complete"></i>'
                confirmDoneBttn.style.display = 'none'
                isEdited[4] = true;
                saveChecker()
            }else{
                alert('Server failed ❌')
            }
        }catch{
            alert('Server failed ❌')
        }
        saveBttn.classList.remove('faded')
        confirmDoneBttn.style.display = 'none'
        isEdited[4] = true;
    }
})
saveBttn.addEventListener('click' || 'touch', async () => {    
    loadScreenFunc('add')
    saveChecker()
    const newInfo = {}
    let form;
    if(isEdited[0] && fileInput.files[0]) {
        const file = fileInput.files[0]
        form = new FormData()
        form.append('profilePic', file)
        try{
            const response = await fetch('/myprofile/update/profilepic', {
                method: 'Post',
                body: form,
            })
            const result = await response.json()
            await delay(3000)
            loadScreenFunc('remove')
        }catch{
            alert('Unable To connect to server at this time!!!')
            document.querySelector('body') = '404 | Unable to connect To server'
        }
    }
    isEdited[1] && currentUser.surname !== surnameInput.value ? newInfo.surname = surnameInput.value : null;
    isEdited[2] && currentUser.firstname !== firstnameInput.value ? newInfo.firstname = firstnameInput.value : null;
    if ( isEdited[3] && currentUser.email !== emailInput.value) {
        if (verificationEmail.value !== '' && verificationEmail.value.length === 4) {
            newInfo.newEmail = emailInput.value
            newInfo.verificationEmailCode = verificationEmail.value
        }else{
            verificationEmail.style.borderColor = 'red';
            loadScreenFunc('remove');
            return;
        }
    }
    if (isEdited[4]) {
        if (verificationPassword.value !== '' && verificationPassword.value.length === 4) {
            newInfo.oldPassword = oldPasswordInput.value
            newInfo.newPassword = newPasswordInput.value
            newInfo.confirmPassword = confirmPasswordInput.value
            newInfo.verificationPasswordCode = verificationPassword.value
        }else{
            verificationPassword.style.borderColor = 'red';
            loadScreenFunc('remove');
            return;
        }
    } 
    const data = await requestToChangeUserInfo(newInfo)
    if (data) {
        await delay(3000)
        window.location.reload();
        loadScreenFunc('remove');
    }
    loadScreenFunc('remove');
})
function passwordChecker() {
    oldPasswordInput.style.borderColor = 'white';
    newPasswordInput.style.borderColor = 'white';
    confirmPasswordInput.style.borderColor = 'white';
    verificationPassword.style.borderColor = 'white';
    if(oldPasswordInput.value === '') {
        oldPasswordInput.style.borderColor = 'red';
        return true;
    }else if(newPasswordInput.value === '') {
        newPasswordInput.style.borderColor = 'red';
        return true;
    }else if(confirmPasswordInput.value === '') {
        confirmPasswordInput.style.borderColor = 'red';
        return true;
    }else if(confirmPasswordInput.value !== newPasswordInput.value){
        confirmPasswordInput.style.borderColor = 'red';
        return true;
    }
    else{
        return false;
    }
}
saveChecker()
function saveChecker() {
    for(i = 0; i <= 4; i++) {   
        if(isEdited[i]){
            saveBttn.classList.remove('faded');
            break;
        }else{
            saveBttn.classList.add('faded');
        }
    }
}

async function requestToChangeUserInfo(newInfo) {
    try{
        if (isEdited[1] || isEdited[2] || isEdited[3] || isEdited[4]) {
            const response = await fetch('/myprofile/update', {
                method: 'Post',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(newInfo)
            })
            const result = await response.json();
            console.log(result)
            if (result.statuz === 'success') {
                return true;
            }else{
                document.querySelector('.message').innerHTML = result.message;
                return false;
            }
        }
    }catch{
        alert('Unable to connect to server at this time!!!')
    }
}
function loadScreenFunc(param) {
    if (param === 'add') {
        document.querySelector('body').style.background = 'rgba(255, 255, 255, 0.1)'
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.add('shaded')
        })
        document.querySelector('.load-screen').classList.add('load-screen-style')
        document.querySelector('.load-screen-style').innerHTML = '<div class="image-div"><img src="/public/resources/quizzlyIcon.png"></div>'
    }else if( param === 'remove') {
        document.querySelector('body').style.background = '#0f172a'
        document.querySelectorAll('body *:not(.load-screen)').forEach((el) => {
            el.classList.remove('shaded')
        })
        document.querySelector('.load-screen').classList.remove('load-screen-style')
        document.querySelector('.load-screen').innerHTML = ''
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.querySelector('header img').addEventListener('click' || 'touch', () => {
    window.location.href = '/'
})


function capitalize(word) {
    const capital = word.slice(0, 1).toUpperCase()
    const rest = word.slice(1, (word.length))
    return `${capital}${rest}`
}