import EditorJS from "@editorjs/editorjs"
import Header   from "@editorjs/header"
import List     from "@editorjs/list"
import Image    from "@editorjs/simple-image"
import Code     from "@editorjs/code"
import Quote    from "@editorjs/quote"
import Icode    from "@editorjs/inline-code"
import Warning  from "@editorjs/warning"
import Para     from "@editorjs/paragraph"
import Embed    from "@editorjs/embed"
import Marker     from "@editorjs/marker"
import { type } from "os";


let button       = document.querySelector(".publishbtn")
// let featureImage = document.querySelector("#feature-image")
let imageUrl     = document.querySelector("#image-url")
let title        = document.querySelector("#title")
let selectTag    = document.querySelector("#tech");
let options      = document.querySelectorAll("option")
let save         = document.querySelector("#save")
let previewbtn   = document.querySelector(".previewbtn")
let clear        = document.querySelector(".clear")
let tech = "technology";
let month        = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let date         = new Date;
let fulldate     = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
let titleList
let rawObj
let obj
let techNumber



clear.addEventListener('click',async()=>{
  let decision = await swal("Are you sure?", {
    dangerMode: true,
    buttons:["No", "Yes"]
  });
  if(decision){ localStorage.clear()
  window.location.reload()
}
})

if(localStorage.getItem("post") !== null){
  rawObj = localStorage.getItem("post")
  obj = JSON.parse(rawObj)
  title.value = obj.title
  imageUrl.value   = obj.img
  selectTag.selectedIndex = obj.techNumber
  tech = obj.tech


}else{
  obj = {
    savedData: null
  }
}


let editor = new EditorJS({
  holder: "editorjs",
  
  tools : { 
    
    embed: {
      class        : Embed,
      
      config       : {
        services: {
          youtube: true,
          codepen: {
            
              regex   : /https                                                                                                                               : \/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
              embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
              html    : "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
              height  : 300,
              width   : 600,
              id      : (groups) => groups.join('/embed/preview/')
            
          }
        }
      }
    },
    Marker: {
      class        : Marker,
      shortcut     : 'CMD+SHIFT+M',
      inlineToolbar: true
    },
    image : {
      class        : Image,
      inlineToolbar: ["link"],
      caption      : false
    },

    code  : {
      class: Code,
      shortcut: 'CMD+SHIFT+X',
    },
    list  : {
      class: List,
      shortcut: 'CMD+SHIFT+L',
      inlineToolbar: true
    },
    header: {
      class : Header,
      shortcut: 'CMD+SHIFT+H',
      config: {
        placeholder: 'Enter a header'
      }
    },
   
    quote: {
      class   : Quote,
      shortcut: 'CMD+SHIFT+Q',
      inlineToolbar: true,
      config  : {
        quotePlaceholder  : 'Enter a quote',
        captionPlaceholder: 'Quote\'s author',
      },
    },
     icode: {
      
       class        : Icode,
       shortcut     : 'CMD+SHIFT+M',
    },
    paragraph: {
      class        : Para,
      inlineToolbar: true,
      config       : {
        placeholder: "let's write awesome tutorial"
      }
    },
    warning: {
      class        : Warning,
      inlineToolbar: true,

      config       : {
        messagePlaceholder: 'Message',
      },
     
    },

  },
  data: obj.savedData,
  initialBlock: "paragraph",
  
  onChange: () => {
    save.textContent = "Save";
    button.setAttribute("disabled","disabled")

},
  validate(savedData) {
    if (savedData.text.trim() === "") {
       return false;
    }

    return true;
  },



})





 title.addEventListener("focus",()=>{
  save.textContent = "Save"
  button.setAttribute("disabled","disabled")

 })
 

selectTag.addEventListener("change",(e)=>{
  save.textContent = "Save"
  button.setAttribute("disabled","disabled")
  tech = options[e.target.value].innerHTML
  techNumber = parseInt(options[e.target.value].value)

})
imageUrl.addEventListener("focus",(e)=>{
  save.textContent = "Save"
  button.setAttribute("disabled","disabled")
  

})



button.addEventListener(("click"),varification)
save.addEventListener("click",preview)

async function preview(e){
  let outputData       = await editor.save()
  let content          = outputData.blocks
  let count            = content.length
  let slug             = title.value.toLowerCase().replace(/\ /g, "-");

      previewbtn.removeAttribute("disabled")
      button.removeAttribute("disabled")
      save.textContent = "Saved"

    
      let hero0 = await {
        date : fulldate,
        title: title.value,
        img  : imageUrl.value,
        tech,
        techNumber,
        savedData: outputData
     }
     let hero1 = await {
      date : fulldate,
      title: title.value,
      img  : imageUrl.value,
      tech,
      content,
   }
    
     localStorage.setItem("post",JSON.stringify(hero0))
     await axios.post("/post/preview",hero1)
}

async function varification(e){
  let outputData = await editor.save()
  let content    = outputData.blocks
  let score      = 0;
  let slug       = title.value.toLowerCase().replace(/\ /g, "-");

  await axios.post("/confirm",{slug}).then(res=>{
   
     if(res.data.confirmation){
      swal("title already exist.",{buttons: "Ok got it !"});
     }else{
       score++
   
     }
   })
   
   if(title.value === "" ){
      swal("title is empty",{buttons: "Ok got it !"});
  }else{
    score++
  
  }
  
  if(tech === "technology"){
     swal("please select technology",{buttons: "Ok got it !"})
     
   }else{

    score++
 
  }

  
   if((title.value).length < 5){
      swal("title is too short", {buttons: "Ok got it !"})
  }else{
    score++

  }

  if(content.length < 7){
    swal("Content is too short.",{buttons: "Ok, got it !"})
  }else{
    score++
  
  }
      
  if(score === 5)
  {
    let decision = await swal("Are you ready?", {
      buttons:["No, not ready", "Yes, ready"]
    });
    
    if(decision){
      button.textContent = "Publishing.."
      button.setAttribute("disabled","disabled")
      let hero = {
        date : fulldate,
        title: title.value,
        img  : imageUrl.value,
        tech,
        content  
     }
       publish(hero);
    }
  }
 
}

function publish(hero){

   
      axios.post("/publish/post",hero).then((res)=>{

        if(res.data.done){
         localStorage.clear()
          setTimeout(() => {
           
           window.location.href = "/"
          }, 4000);
        }
      })
     

     
}