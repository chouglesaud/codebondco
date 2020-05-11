import { getFullDate } from "../dateFormator";
import DataProcessor from "./dataProcessor";

export default class Editor {
    constructor() {
        this.dataProcessor = new DataProcessor();
        this.data = {};
        this.technology = null;
        this.article = {};
        this.title = document.querySelector("#postTitle h1");
        this.saveBtn = document.querySelector("#save");
        this.publishBtn = document.querySelector(".publishbtn");
    }
    async initialize() {
        const article = await this.dataProcessor.get();

        if (article.data || article.title || article.tech) {
            this.data = article.savedData;
            this.title.innerHTML = article.title;
            this.technology = article.tech;
        }
        localStorage.setItem("post", JSON.stringify(article));
    }

    async save(data) {
        this.onSaving();
        let titleRegex = /[^A-Za-z0-9\-#$*%?|]/g,
            editedTitle =
                this.title.innerHTML !== null
                    ? this.title.innerHTML.replace(titleRegex, " ")
                    : null;

        this.title.innerHTML = editedTitle;
        this.article = {
            date: getFullDate(),
            savedData: await data,
            title: editedTitle,
            content: await data.blocks,
            tech: this.technology,
        };

        const response = await this.dataProcessor.save(this.article);
        localStorage.setItem("post", JSON.stringify(response));
        this.onSaved();
    }
    clear() {
        this.dataProcessor.clear();
    }
    async publish() {
        const article = await JSON.parse(localStorage.getItem("post"));

        const isArticleExist = article ? true : false;
        const isArticleValid =
            isArticleExist && (await this.dataProcessor.validate(article));

        if (isArticleValid) {
            const response = await this.dataProcessor.publish(article);

            if (response) {
                setTimeout(() => {
                    window.location.href = "/";
                }, 4000);
            }
        }
    }
    render() {
        this._renderTechnology();
    }

    changeTechnology(technology) {
        this.technology = technology;
        this.onChange();
    }
    _renderTechnology() {
        const radioBtn = document.querySelector(`#${this.technology}`);
        if (radioBtn) {
            radioBtn.setAttribute("checked", "true");
        }
    }
    onChange() {
        this.saveBtn.textContent = "Save";
        this.publishBtn.setAttribute("disabled", "disabled");
    }
    onSaving() {
        this.saveBtn.textContent = "Saving";
    }
    onSaved() {
        this.saveBtn.textContent = "Saved";
        this.publishBtn.removeAttribute("disabled");
    }
    onPublishing() {
        this.publishBtn.textContent = "Publishing";
    }
}
