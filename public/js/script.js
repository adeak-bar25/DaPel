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

if(bellowHeader){
    bellowHeader.style.marginTop = getComputedStyle(document.querySelector('header'))['height']
}
