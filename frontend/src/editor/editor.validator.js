import axios from "axios";
import customAlert from "../customAlert";
import Validator from "../validator";

export default class EditorValidator extends Validator {
    constructor(data) {
        super(data);
    }
    start() {
        return this.validateTitle();
    }
    async validateTitle() {
        if (this.data.title === null) {
            customAlert("title is empty", { buttons: "Close" });
            return false;
        }

        if (this.data.title.length < 5) {
            customAlert("title is too short", { buttons: "Close" });
            return false;
        }

        let slug = this.data.title.toLowerCase().replace(/\s/g, "-");
        const response = await axios.post("/confirm", { slug });

        if (response.data.confirmation) {
            customAlert("title already exist.", { buttons: "Close" });
            return false;
        }
        return this.validateContent();
    }
    validateContent() {
        if (this.data.content.length < 7) {
            customAlert("Content is too short.", { buttons: "Close" });
            return false;
        }
        return this.validateTechnology();
    }
    validateTechnology() {
        const tech = JSON.parse(localStorage.getItem("post")).tech;
        if (!document.querySelector(`#${tech}`)) {
            customAlert("please select the post category", {
                buttons: "Close",
            });
            return false;
        }
        return this.isReady();
    }
    async isReady() {
        const decision = await swal("Are you ready to publish?", {
            buttons: ["No", "Yes"],
        });
        return decision ? true : false;
    }
}
