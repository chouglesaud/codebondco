import { getFullDate } from "../dateFormator";
import EditorValidator from "./editor.validator";
import customAlert from "../customAlert";
import EditorAPI from "./editor.api";

export default class Editor {
    constructor() {
        this.editorAPI = new EditorAPI();
        this.data = {};
        this.technology = null;
        this.article = {};
        this.title = document.querySelector("#postTitle h1");
        this.saveBtn = document.querySelector("#save");
        this.publishBtn = document.querySelector(".publishbtn");
    }
    async initialize() {
        const article = await this.editorAPI.getArticle();

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

        const response = await this.editorAPI.saveArticle(this.article);
        localStorage.setItem("post", JSON.stringify(response));
        this.onSaved();
    }
    async clear() {
        const decision = await customAlert("Are you sure?", {
            dangerMode: true,
            buttons: ["No", "Yes"],
        });
        if (decision) {
            this.editorAPI.clearArticle();
            localStorage.clear();
            window.location.reload();
        }
    }
    async publish() {
        const article = await JSON.parse(localStorage.getItem("post"));

        const isArticleExist = article ? true : false;
        const isArticleValid =
            isArticleExist && (await this.validateArticle(article));

        if (isArticleValid) {
            const response = await this.editorAPI.publishArticle(article);

            if (response) {
                setTimeout(() => {
                    window.location.href = "/";
                }, 4000);
            }
        }
    }
    validateArticle(data) {
        const editorValidator = new EditorValidator(data);
        return editorValidator.start();
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
