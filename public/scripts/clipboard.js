let btncopy = document.querySelectorAll(".copy")
btncopy.forEach((el)=>{
    el.addEventListener("click",myFunction)
})

function myFunction(e) {
var copyText = e.target.previousElementSibling

copyText.select(); 
copyText.setSelectionRange(0, 99999); /*For mobile devices*/

e.target.textContent = "copied"
document.execCommand("copy");
setTimeout(() => {
e.target.textContent = "copy"
}, 2000);
}