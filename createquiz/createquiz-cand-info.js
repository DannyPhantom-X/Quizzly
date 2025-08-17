const target = document.getElementById('infoOriginal')
const container = document.getElementById('body')
const originalInput = document.getElementById('originalInput')
console.log(JSON.parse(sessionStorage.getItem('quizInfo')))
let currentIndex = 0
document.querySelector('.add-button').addEventListener('click' || 'touch', () => {
    const div = document.createElement('div')
    div.classList.add('info')
    div.dataset.index = currentIndex
    div.innerHTML = `<input type="text" value="${originalInput.value}"> <button class='delete-button'><i class="fas fa-trash" title="Delete"></i></button>`
    originalInput.value = ''
    container.insertBefore(div, target)
    document.querySelectorAll(`.delete-button`).forEach((delet, i) => {
            delet.addEventListener('click' || 'touch', (event) => {
                document.querySelectorAll(`.info`).forEach((inf, j) => {
                    const infoIndex = inf.dataset.index 
                    console.log(infoIndex)
                    if (infoIndex == i) {
                    console.log('deleting info with index')
                        const numb = currentIndex
                        console.log(currentIndex)
                        inf.remove()
                    }
                })
                event.stopImmediatePropagation()
                
        })
    }) 
    currentIndex += 1;
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