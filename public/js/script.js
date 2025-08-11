const brand = document.querySelector('div.brand')

brand.addEventListener('click', () => {
    window.location.href = '/'
})

const eyeIcon = document.querySelectorAll('.pass-eye')

if(eyeIcon.length > 0){
    eyeIcon.forEach((el) => {
        el.addEventListener('click', function() {
            el.textContent = el.textContent === 'visibility_off' ? 'visibility' : 'visibility_off'
            this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password' 
        })
    })
}


function getTime(){
    const hour = new Date().getHours()
    switch (true){
        case 5 <= hour && hour < 12:
            return 'Pagi'
        case 12 <= hour && hour < 15:
            return 'Siang'
        case 15 <= hour && hour < 18:
            return 'Sore'
        default:
            return 'Malam'
    }
}

const greetElm = document.getElementById('time')

if(greetElm){
    greetElm.textContent = getTime()
}
const bellowHeader = document.querySelector('.below-header')

const headerHeight = getComputedStyle(document.querySelector('header'))['height']

document.querySelector(":root").style.setProperty("--header-height", headerHeight)

if(bellowHeader){
    bellowHeader.style.marginTop = headerHeight
}

const aside = document.querySelector('aside')

const main = document.querySelector('main');
if(aside){
    resize()
    await document.fonts.ready
    resize()
    window.addEventListener('resize', () => {
        setTimeout(() => {
            resize()
        }, 500)
    })
}
function resize(){
    aside.style.top = headerHeight;
    const asideWidth = getComputedStyle(aside)['width']
    main.style.width =`calc(100% - ${asideWidth})`
    main.style.marginLeft = asideWidth
}

if(lastLogin){
    document.getElementById("time-login-last").textContent = new Date(lastLogin).toLocaleTimeString("id-ID", {timeZoneName : "short", hour : "numeric", minute : "numeric"});
    document.getElementById("date-login-last").textContent = new Date(lastLogin).toLocaleDateString("id-ID", {day : "numeric", month : "long", year : "numeric"});
}

const inputNum = document.querySelectorAll('input[type="number"]')

inputNum.forEach((el) => {
    el.addEventListener('keydown', (e) =>{
        if(e.code === "KeyE" || e.code === "Equal" || e.code === "Minus" || e.code === "Period" || e.code === "ArrowUp" || e.code === "ArrowDown") e.preventDefault()
    })
    el.addEventListener('input', function(){
        if(this.id === 'nisn') if(this.value.length > 10) this.value = this.value.slice(0, 10)
    })
})
