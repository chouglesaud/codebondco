import ArticleAPI from "./articleAPI";
import EditorValidator from "./editor.validator";
import customAlert from "../customAlert";

export default class DataProcessor {
    constructor() {
        this.api = new ArticleAPI();
    }
    async get() {
        return this.api.getArticle();
    }
    async save(data) {
        return await this.api.saveArticle(data);
    }

    async publish(data) {
        return await this.api.publishArticle(data);
    }
    async clear() {
        const decision = await customAlert("Are you sure?", {
            dangerMode: true,
            buttons: ["No", "Yes"],
        });
        if (decision) {
            this.api.clearArticle();
            localStorage.clear();
            window.location.reload();
        }
    }
    async validate(data) {
        const editorValidator = new EditorValidator(data);
        return editorValidator.start();
    }
}
