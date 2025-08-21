import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm';
import utc from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/utc/+esm';
import timezone from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/timezone/+esm';
import advancedFormat from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/advancedFormat/+esm';
import 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/locale/id/+esm';

dayjs.extend(utc); 
dayjs.extend(timezone);
dayjs.extend(advancedFormat);



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
    aside.style.top = headerHeight;
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

function getTimeZoneCode(){
    const regex = /[0-9]/
    const idZone = new Date().toLocaleTimeString("id", {timeZoneName : "short", timeZone : dayjs.tz.guess()}).slice(-4).trimStart()
    if(regex.test(idZone)) return dayjs().tz(dayjs.tz.guess()).format("zzz")
    return idZone
}

if(typeof lastLogin !== 'undefined' && lastLogin !== null){
    const time = dayjs(lastLogin).tz(dayjs.tz.guess()).format("hh:mm");
    const date = dayjs(lastLogin).locale('id').tz(dayjs.tz.guess()).format("DD MMMM YYYY");
    document.getElementById("time-login-last")
        .textContent = `${time} ${getTimeZoneCode()}`
    document.getElementById("date-login-last")
        .textContent = date
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
