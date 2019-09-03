let searchInput = document.querySelector(".search")
let titles      = document.querySelectorAll(".title")
let message     = document.querySelector(".message")


searchInput.addEventListener("keyup",search)


function search(e){
    let inputValue =( e.target.value).toLowerCase()
    
    titles.forEach((el)=>{
        let title    = el.innerHTML.toLowerCase()
        let parent   = ((el.parentElement).parentElement).parentElement

        if(title.indexOf(inputValue) != -1 ){
            parent.style.display = "block"
            message.style.display = "none"
        }else{
            parent.style.display = "none"
            message.style.display = "block"
        }
    })
    
}




