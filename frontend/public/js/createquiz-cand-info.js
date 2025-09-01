function candInfoJs () {
    let target;
    const container = document.getElementById('cand-body')
    const originalInput = document.getElementById('originalInput')
    console.log(JSON.parse(sessionStorage.getItem('quizInfo')))
    let currentIndex = 0
    document.querySelector('.add-button').addEventListener('click' || 'touch', () => {
        let div;
        const info = document.querySelectorAll('.info')
        console.log(info.length)
        if (info.length === 1) {
            div = document.createElement('div')
            div.classList.add('info')
            target = document.getElementById('infoOriginal')
            div.classList.add('deleteInfo')
            div.innerHTML = `<input type="text" class="deleteInput" value="${originalInput.value}"> <button class='delete-button'><i class="fas fa-trash" title="Delete"></i></button>`
            originalInput.value = ''
            container.insertBefore(div, target)
            target = document.querySelector('.deleteInfo')
        }else {
            div = document.createElement('div')
            div.classList.add('info')
            target = document.querySelector('.deleteInfo')
            div.innerHTML = `<input type="text" value="${originalInput.value}">`
            originalInput.value = ''
            container.insertBefore(div, target)
        }

    onclickDeleteButton()
        
        
    })
    let candInfo = []
    backCandInfo()
    document.querySelector('.next-button').addEventListener('click' || 'touch', () => {
        let status = true
        document.querySelectorAll('.info input').forEach((inp) => {
            console.log(inp)
            if (!inp.value) {
                inp.style.borderColor = '#DC2626'
                inp.style.borderWidth = '2px'
                inp.style.borderRadius = '5px'
                status = false
                setTimeout(() => {
                    inp.style.borderColor = 'gray'
                    inp.style.borderWidth = '1px'
                    inp.style.borderRadius = '10px'
                }, 5000)
            }else{
                candInfo.push(inp.value)
            }
        })
        if (status) {
            sessionStorage.setItem('candInfo', JSON.stringify(candInfo))
            window.location.href = '/createquiz/ques&ans'
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

    function backCandInfo() {
        document.getElementById('backBttnCandInfo').addEventListener('click' || 'touch', () => {
            console.log('cand clicked')
            document.querySelector('.form-card-inner').style.transform = 'rotateY(360deg)';
        })
    }
}