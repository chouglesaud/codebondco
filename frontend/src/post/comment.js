export default class Comment {
    constructor() {
        this.data = null;
    }

    submit() {}
    validate() {}
}

// if (commentBox.length < 4) {
//     showhidebtn.style.display = "none";
// }

// for (var i = 3; i < commentBox.length; i++) {
//     commentBox[i].style.display = "none";
// }

// showhidebtn.addEventListener("click", function (e) {
//     if (e.target.innerHTML == "show all") {
//         for (var _i = 0; _i < commentBox.length; _i++) {
//             commentBox[_i].style.display = "block";
//             e.target.innerHTML = "hide";
//         }
//     } else {
//         for (var _i2 = 3; _i2 < commentBox.length; _i2++) {
//             commentBox[_i2].style.display = "none";
//             e.target.innerHTML = "show all";
//         }
//     }
// });
// var editor = new Editorjs({
//     holder: "editorjs",
//     tools: {},
//     initialBlock: "paragraph",
//     placeholder: "write your comment...",
//     data: {},
// });
// commentbtn.addEventListener("click", makecomment);

// async function makecomment() {
//     var outputData = await editor.save(),
//         comment,
//         slug,
//         tech;
//     comment = outputData.blocks;
//     slug = url[5];
//     tech = url[4];
//     axios
//         .post("/comment/post", {
//             date: fulldate,
//             tech: tech,
//             slug: slug,
//             comment: comment,
//         })
//         .then(function (res) {
//             window.location.reload();
//         });
// }
