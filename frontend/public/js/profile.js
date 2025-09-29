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
const verificationInut = document.querySelector('.verification-input');
const surnameInput = document.querySelector('.surname-input');
const firstnameInput = document.querySelector('.firstname-input');
const emailInput = document.querySelector('.email-input')
const loadScreen = document.querySelector('.load-screen');
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
            cb.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
            const j = i + 1
            isEdited[j] = false;
            saveChecker();
        }else{
            cb.innerHTML = 'X';
            changeInput[i].addEventListener('keyup', () => {
                if(i === 0 && currentUser.surname != changeInput[i].value) {
                    const j = i + 1
                    console.log('worked')
                    isEdited[j] = true;            
                }else if(i === 1 && currentUser.firstname != changeInput[i].value) {
                    const j = i + 1
                    isEdited[j] = true;
                }else if(i === 2 && currentUser.email != changeInput[i].value) {
                    const j = i + 1
                    isEdited[j] = true;
                }else{
                    return;
                }
                console.log(isEdited)
                saveChecker()
            })
        }
    })
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

confirmDoneBttn.addEventListener('click' || 'touch', () => {
    const isFailed = passwordChecker()
    if(!isFailed) {
        saveBttn.classList.remove('faded')
        confirmDoneBttn.style.display = 'none'
        document.querySelector('.latest-show').style.display = 'block'
        isEdited[4] = true
    }
})

saveBttn.addEventListener('click' || 'touch', async () => {    
    loadScreenFunc('add')
    let isFailed = false;
    saveChecker()
    const newInfo = {}
    show.forEach((s) => {
        if(s.style.display !== '') {
            isFailed = passwordChecker()
            if(!isFailed && verificationInut.value === '') {
                verificationInut.style.borderColor = 'red';
                return isFailed = true;
            }
        }
    })
    if(isFailed) {return;}
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
        }
        
    }
    isEdited[1] && currentUser.surname !== surnameInput.value ? newInfo.surname = surnameInput.value : null;
    isEdited[2] && currentUser.firstname !== firstnameInput.value ? newInfo.firstname = firstnameInput.value : null;
    isEdited[3] && currentUser.email !== emailInput.value ? newInfo.email = emailInput.value : null;
    await requestToChangeUserInfo(newInfo)
    await delay(3000)
    loadScreenFunc('remove');
})
function passwordChecker() {
    oldPasswordInput.style.borderColor = 'white';
    newPasswordInput.style.borderColor = 'white';
    confirmPasswordInput.style.borderColor = 'white';
    verificationInut.style.borderColor = 'white';
    if(oldPasswordInput.value === '') {
        oldPasswordInput.style.borderColor = 'red';
        return true;
    }else if(newPasswordInput.value === '') {
        newPasswordInput.style.borderColor = 'red';
        return true;
    }else if(confirmPasswordInput.value === '') {
        confirmPasswordInput.style.borderColor = 'red';
        return true;
    }else{
        return false;
    }
}
saveChecker()
function saveChecker() {
    for(i = 0; i <= 4; i++) {   
        if(isEdited[i]){
            console.log('broken at ' + i)
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
            const result = response.json();
        }
    }catch{
        alert('Unable to connect to server at this time!!!')
    }
}
function loadScreenFunc(param) {
    console.log('hello')
    if (param === 'add') {
        document.querySelector('body').style.background = 'rgba(15, 23, 42, 0.8)'
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