import EditorJS from "@editorjs/editorjs"
import Code     from "@editorjs/code"


let para           = document.querySelectorAll(".para")
let read           = document.querySelector(".rootcontainer")
let p              = document.querySelector(".para").textContent
let commentbtn     = document.querySelector(".commentbtn")
let url            = window.location.href.split("/")
let commentBox     = document.querySelectorAll(".comment")
let text           = document.querySelectorAll(".text p")
let list           = document.querySelectorAll(".list li")
let showhidebtn    = document.querySelector("#showhidebtn")
let month    = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let date     = new Date();
let fulldate = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

list.forEach((el)=>{
   TextToHtml(el)
})

text.forEach((el)=>{
  TextToHtml(el)
})   
para.forEach((el)=>{
   TextToHtml(el)
})

function TextToHtml(element){
   let tc                = element.textContent
       element.innerHTML = tc
}

if(commentBox.length < 4){
   showhidebtn.style.display = "none"
}

for(let i=3; i<commentBox.length; i++){
   commentBox[i].style.display = "none"
}

showhidebtn.addEventListener("click",(e)=>{
   if(e.target.innerHTML == "show all"){
      for(let i=0; i<commentBox.length; i++){
         commentBox[i].style.display = "block"
         e.target.innerHTML = "hide"
         
      }
   }else{
      for(let i=3; i<commentBox.length; i++){
         commentBox[i].style.display = "none"
         e.target.innerHTML = "show all"
      }
   }
})


let editorjs = new EditorJS({
   holder: "editorjs",
   tools : {
   code : {
      class        : Code,
      inlinetoolbar: true,
   }
  },
   initialBlock: "paragraph",
   placeholder : "write your comment...",
   data        : {}
})
   



commentbtn.addEventListener("click",makecomment)

async function makecomment(){
   let outputData = await editorjs.save()
   let comment    = await  outputData.blocks
  
   let slug = url[5]
   let tech = url[4]
 
   axios.post("/comment/post",{date: fulldate,tech,slug,comment: comment}).then((res)=>{
      window.location.reload()
     
   })
}


