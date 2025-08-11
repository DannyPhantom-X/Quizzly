const optionCheckbox = document.getElementById('optionCheckbox')

if (!optionCheckbox.checked) {
    console.log('not checked')
    document.querySelectorAll('.fade').forEach((faded) => {
        faded.classList.add('faded')
    })
}
optionCheckbox.addEventListener('click', () => {
    if (!optionCheckbox.checked) {
        console.log('not checked')
        document.querySelectorAll('.fade').forEach((faded) => {
            faded.classList.add('faded')
        })
    }else{
        document.querySelectorAll('.fade').forEach((faded) => {
            faded.classList.remove('faded')
        })
    }
})