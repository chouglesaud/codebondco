export default class Page {
    constructor() {
        this.text = document.querySelectorAll(".text p");
        this.list = document.querySelectorAll(".list li");
        this.paragraphs = document.querySelectorAll(".para");
    }
    render() {
        if (this.isElementExist(this.paragraphs)) this._randerParagraph();
        if (this.isElementExist(this.list)) this._randerList();
        this._renderSecureLink();
    }
    _randerList() {
        this.list.forEach((item) => {
            this.textToHtml(item);
        });
    }
    _randerParagraph() {
        this.paragraphs.forEach((paragraph) => {
            this.textToHtml(paragraph);
        });
    }
    _renderSecureLink() {
        $("a").attr({
            rel: "noopner",
        });
        $(".comment-section a").attr({
            rel: "noopner nofollow",
        });
    }
    textToHtml(element) {
        const text = element.textContent;
        element.innerHTML = text;
    }
    isElementExist(element) {
        return element.length === 0 || element === null ? false : true;
    }
}
