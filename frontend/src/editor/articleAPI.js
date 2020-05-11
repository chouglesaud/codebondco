import axios from "axios";

export default class ArticleAPI {
    constructor() {
        this.apiRoutes = {
            get_article: "/post/reload",
            save_article: "/post/preview",
            publish_article: "/publish/post",
            clear_article: "/post/preview",
        };
    }
    async getArticle() {
        const response = await axios.post(this.apiRoutes.get_article);
        return response.data;
    }
    async saveArticle(data) {
        const response = await axios.post(this.apiRoutes.save_article, data);
        // button.removeAttribute("disabled")
        // save.textContent = "Saved"
        return response.data;
    }

    async publishArticle(data) {
        let article = {
            date: data.date,
            title: data.title,
            img:
                data.content[0].type === "hostedImage"
                    ? data.content[0].data.file.url
                    : data.content[0].type === "image"
                    ? data.content[0].data.url
                    : null,
            tech: data.tech,
            content: data.content,
        };

        const response = await axios.post(
            this.apiRoutes.publish_article,
            article
        );
        return response.data.done;
    }
    clearArticle() {
        axios.post(this.apiRoutes.clear_article, null);
    }
}
