const eyeIcon = document.querySelectorAll('.pass-eye')

if(eyeIcon.length > 0){
    eyeIcon.forEach((el) => {
        el.addEventListener('click', function() {
            el.textContent = el.textContent === 'visibility_off' ? 'visibility' : 'visibility_off'
            this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password' 
        })
    })
}