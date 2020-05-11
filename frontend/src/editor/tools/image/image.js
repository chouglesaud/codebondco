

class Image {
    constructor({data, api, previewData}) {
      this.api = api
      this.data = {
        file: {
          url: (data.file)? data.file.url : "",
        },
        caption: (data.caption)? data.caption : "",
        stretched: data.stretched !== undefined ? data.stretched : false,
      };
      this.wrapper = undefined
      this.previewData = undefined
      this.file = undefined
      this.input = this._createElement("input",null,{accept:"image/png,image/jpg,image/jpeg,image/gif",id: "uploader"},"display: none;")
      this.input.type = "file"
      this.settings = [
        {
          name: 'stretched',
          icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
        }
      ];
    }
    static get toolbox() {
      return {
        title: "Image",
        icon: `<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>`
      }
    }
  
    render() {
      const labelStyle = "display: block;width: 200px;border: 1px solid #ccc;border-radius: .25rem !important;padding: 5px;text-align: center;"
      const label = this._createElement("label",["image_upload"],{for: "uploader"},labelStyle)
      label.textContent = 'Select an image'
      label.appendChild(this.input)
      this.wrapper = this._createElement("div",["cdx-block","image-tool", "image--filled"])
      this.wrapper.appendChild(label)
      
      if (this.data.file && this.data.file.url) {
        this._createImage(this.data.file.url, this.data.caption)
        return this.wrapper
      }
  
      const cloudinary_url =
        "https://api.cloudinary.com/v1_1/saudchougle/image/upload"
      const upload_preset = "jjpa0ho5"
  
      this.input.addEventListener("change", async e => {
        this.file = e.target.files[0]
        let formData = new FormData()
        formData.append("file", this.file)
        formData.append("upload_preset", upload_preset)
        if(this.file.size > 5000000){
          label.style.width = "280px"
          label.textContent = "image size must be less than 5MB"
          return false
        }else{
          label.textContent = this.file.name
        }
        const reader = new FileReader()
  
        reader.readAsDataURL(this.file)
        let promise1 = new Promise((resolve, reject) => {
          reader.onload = e => {
            resolve(e.target.result)
          }
        })
        this.previewData = await promise1
        this._createImagePreview(this.previewData)
  
        fetch(cloudinary_url, {
          method: "POST",
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            this._createImage(data.secure_url)
          })
          .catch(err => console.error(err))
      })
      return this.wrapper
    }
    renderSettings(){
     
      const wrapper = this._createElement("div")
  
      this.settings.forEach( tune => {
        let button = this._createElement("div")
  
        button.classList.add('cdx-settings-button');
        button.innerHTML = tune.icon;
        wrapper.appendChild(button);

        button.addEventListener('click', () => {
          this._toggleTune(tune.name);
          button.classList.toggle('cdx-settings-button--active');
        });

      });
  
      return wrapper;
    }
    _createImage(url, captionText) {
      const image = this._createElement("img",["image-tool__image-picture","rounded", "img-fluid"],{src: url},"opacity: 1;")

      const imagetool = this._createElement("div",["image-tool__image"])
      
      const caption = this._createElement("div",["cdx-input", "image-tool__caption"],{contentEditable: true,placeholder: "Caption..."})
     
      caption.innerHTML = captionText || ""
  
      this.wrapper.innerHTML = ""
      this.wrapper.appendChild(imagetool)
      imagetool.appendChild(image)
      imagetool.appendChild(caption)

      this._acceptTuneView();
    }

    
    _createImagePreview(url) {
      const image = this._createElement("img",["image-tool__image-picture","rounded", "img-fluid"],{src: url},"opacity: 0.3;")

      const imagetool = this._createElement("div",["image-tool__image"])

      this.wrapper.innerHTML = ""
      this.wrapper.appendChild(imagetool)
      imagetool.appendChild(image)

    }
    _toggleTune(tune) {
      this.data[tune] = !this.data[tune];      
      this._acceptTuneView();
     }
     _acceptTuneView() {
      this.settings.forEach( tune => {
        
        if(this.wrapper.parentElement && this.wrapper.parentElement.parentElement){
          this.wrapper.parentElement.parentElement.classList.toggle("ce-block--stretched",!!this.data[tune.name])
        }
        this.wrapper.classList.toggle("image-tool--stretched",!!this.data[tune.name])
      });
    }
  
    async save(blockContent) {
  
     
      return Object.assign(this.data, {
        file: {
          url: blockContent.querySelector("img").src
        },
        caption: blockContent.querySelector("[contentEditable=true]").innerHTML
     });
    }
    /*
    function create html element by taking 
    @param: tag :String, classNames :Array,  attributes :object, css :String
    return element
    */
    _createElement(tag,classNames=null,attributes = {},css){
    
      
      const element = document.createElement(tag)

      if (Array.isArray(classNames)) {
        element.classList.add(...classNames);
      } else if (classNames) {
        element.classList.add(classNames);
      }

      for (let attrName in attributes) {
        element[attrName] = attributes[attrName];
      }

      element.style.cssText = css
      
      return element
    }
  }
  
  module.exports = Image
  