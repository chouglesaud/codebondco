
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

let techNumber,editor,obj,rawObj,titleList



clear.addEventListener('click',async()=>{
  let decision = await swal("Are you sure?", {
    dangerMode: true,
    buttons:["No", "Yes"]
  });
  if(decision){ axios.post("/post/preview",null).then((res)=>{
    localStorage.setItem("post",null)
    window.location.reload()
  })
}
})


window.addEventListener("load",async()=>{
  await axios.post("/post/reload").then(async(res)=>{
   await localStorage.setItem("post",JSON.stringify(res.data))
   
  }).then(()=>{
    if(localStorage.getItem("post") !== null){
      rawObj = localStorage.getItem("post")
      obj = JSON.parse(rawObj)
      if(obj.title){
        title.value = obj.title
      }
      if(obj.img){
        imageUrl.value   = obj.img
      }
      if(obj.techNumber){
        selectTag.selectedIndex = obj.techNumber
      }
      if(obj.tech){
        tech = obj.tech
      }
      
  
    }else{
      obj = {
        savedData: null
      }

      
    }
    editor = new EditorJS({
      holder: "editorjs",
      
      tools : { 
        
        embed: {
          class        : Embed,
          
          config       : {
            services: {
              youtube: true,
              codepen: {
                
                  regex   : /https:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                  embedUrl: 'https://codepen.io/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2',
                  html    : "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height  : 300,
                  width   : 600,
                  id      : (groups) => groups.join('/embed/preview/')
                
              },
              codesandbox: {
                
                regex   : /https:\/\/codesandbox.io\/embed\/([^\/\?\&]*)/,
                embedUrl: 'https://codesandbox.io/embed/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2',
                html    : "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                height  : 300,
                width   : 600,
                id      : (groups) => groups.join('/embed/preview/')
              
            },
            pythonsandbox: {
                
              regex   : /https:\/\/repl.it\/([^\/\?\&]*)\/([^\/\?\&]*)/,
              embedUrl: 'https://repl.it/<%= remote_id %>?lite=true',
              html    : "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
              height  : 200,
              width   : 600,
              id      : (groups) => groups.join('/')
            
          }
          //   spotify: {
              
          //     regex   : /https:\/\/open.spotify.com\/episode\/([^\/\?\&]*)/,
          //     embedUrl: 'https://open.spotify.com/embed-podcast/episode/<%= remote_id %>?height=200&theme-id=0&default-tab=css,result&embed-version=2',
          //     html    : "<iframe height='200' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; height: 200 !important;'></iframe>",
          //     height  : 200,
          //     width   : 600,
          //     id      : (groups) => groups.join('/embed/preview/')
            
          // },
          
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
  })
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
  let newTechNumber    = techNumber
  let outputData       = await editor.save()
  let content          = outputData.blocks
  let count            = content.length
  let slug             = title.value.toLowerCase().replace(/\ /g, "-");

      previewbtn.removeAttribute("disabled")
      
      save.textContent = "Saving"
      
    
     let hero1 = await {
      date : fulldate,
      title: title.value,
      img  : imageUrl.value,
      techNumber: newTechNumber,
      savedData: outputData,
      tech,
      content,
   }
    
     
      axios.post("/post/preview",hero1).then((res)=>{
        button.removeAttribute("disabled")
        save.textContent = "Saved"
        localStorage.setItem("post",JSON.stringify(res.data))
      })
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

$("a").attr({
  rel:"noopener nofollow"
});