let target;
const container = document.getElementById('body')
const originalInput = document.getElementById('originalInput')
console.log(JSON.parse(sessionStorage.getItem('quizInfo')))
let currentIndex = 0
document.querySelector('.add-button').addEventListener('click' || 'touch', () => {
    const div = document.createElement('div')
    div.classList.add('info')
    div.dataset.index = currentIndex
    const info = document.querySelectorAll('.info')
    console.log(info.length)
    if (info.length == 1) {
        target = document.getElementById('infoOriginal')
        div.classList.add('deleteInfo')
        div.innerHTML = `<input type="text" class="deleteInput" value="${originalInput.value}"> <button class='delete-button'><i class="fas fa-trash" title="Delete"></i></button>`
        originalInput.value = ''
        container.insertBefore(div, target)
        target = document.querySelector('.deleteInfo')
    }else {
        div.innerHTML = `<input type="text" value="${originalInput.value}">`
        originalInput.value = ''
        container.insertBefore(div, target)
    }

   onclickDeleteButton()
    
    
})

document.querySelector('.next-button').addEventListener('click' || 'touch', () => {
    let status = true
    document.querySelectorAll('.info input').forEach((inp) => {
        console.log(inp)
        if (!inp.value) {
            inp.style.borderColor = 'red'
            status = false
            setTimeout(() => {
                inp.style.borderColor = 'gray'
            }, 5000)
        }
    })
    if (status) {
        window.location.href = 'createquiz-ques-ans.html'
    }
    
})

function onclickDeleteButton() {
    document.querySelector(`.delete-button`).addEventListener('click' || 'touch', (event) => {
        console.log('delete')
        document.querySelector('.deleteInfo').remove()
        event.stopImmediatePropagation()
        const info = document.querySelectorAll('.info')
        document.querySelectorAll('.info').forEach((inf, i) => {
            console.log('in loop')
            console.log(inf.id)
            console.log(inf.classList.length)
            if (inf.id == 'infoOriginal') {
                let j = i - 1
                console.log(i, j)
                info[j].innerHTML += `<button class='delete-button'><i class="fas fa-trash" title="Delete"></i></button>`
                info[j].classList.add('deleteInfo')
                event.stopImmediatePropagation()
                onclickDeleteButton()
            }
        })
    })
}