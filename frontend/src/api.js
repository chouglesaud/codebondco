import axios from "axios";

export default class API {
    constructor() {
        this.data = {};
    }
    async get(route) {
        return await axios.get(route);
    }
    async post(route, data) {
        return await axios.post(route, data);
    }
    async getAsPost(route) {
        return await axios.post(route);
    }

    async commentArticle(comment) {
        const response = await axios.post(
            this.apiRoutes.comment_article,
            comment
        );
    }
}
