import lazyload from 'lozad'
let imgs = document.querySelectorAll('.lazy');

imgs.forEach((el)=>{
    const observer = lazyload(el);
observer.observe();

})