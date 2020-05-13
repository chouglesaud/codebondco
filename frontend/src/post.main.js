import Page from "./post/page";

const page = new Page();
page.render();

// import Editorjs from "@editorjs/editorjs";
// var para = document.querySelectorAll(".para");
// var read = document.querySelector(".rootcontainer");
// var p = document.querySelector(".para").textContent;
// var commentbtn = document.querySelector(".commentbtn");
// var url = window.location.href.split("/");
// var commentBox = document.querySelectorAll(".comment");
// var text = document.querySelectorAll(".text p");
// var list = document.querySelectorAll(".list li");
// var showhidebtn = document.querySelector("#showhidebtn");
// var month = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "June",
//     "July",
//     "Aug",
//     "Sept",
//     "Oct",
//     "Nov",
//     "Dec",
// ];
// var date = new Date();
// var fulldate = "";
// list.forEach(function (el) {
//     TextToHtml(el);
// });
// // text.forEach(function (el) {
// //     console.log(el);

// //     TextToHtml(el);
// // });
// para.forEach(function (el) {
//     TextToHtml(el);
// });
// // $("a").attr({
// //     rel: "noopener",
// // });
// // $(".comment-section a").attr({
// //     rel: "noopner nofollow",
// // });

// function TextToHtml(element) {
//     var tc = element.textContent;
//     element.innerHTML = tc;
// }

// // if (commentBox.length < 4) {
// //     showhidebtn.style.display = "none";
// // }

// // for (var i = 3; i < commentBox.length; i++) {
// //     commentBox[i].style.display = "none";
// // }

// // showhidebtn.addEventListener("click", function (e) {
// //     if (e.target.innerHTML == "show all") {
// //         for (var _i = 0; _i < commentBox.length; _i++) {
// //             commentBox[_i].style.display = "block";
// //             e.target.innerHTML = "hide";
// //         }
// //     } else {
// //         for (var _i2 = 3; _i2 < commentBox.length; _i2++) {
// //             commentBox[_i2].style.display = "none";
// //             e.target.innerHTML = "show all";
// //         }
// //     }
// // });
// // var editor = new Editorjs({
// //     holder: "editorjs",
// //     tools: {},
// //     initialBlock: "paragraph",
// //     placeholder: "write your comment...",
// //     data: {},
// // });
// // commentbtn.addEventListener("click", makecomment);

// // async function makecomment() {
// //     var outputData = await editor.save(),
// //         comment,
// //         slug,
// //         tech;
// //     comment = outputData.blocks;
// //     slug = url[5];
// //     tech = url[4];
// //     axios
// //         .post("/comment/post", {
// //             date: fulldate,
// //             tech: tech,
// //             slug: slug,
// //             comment: comment,
// //         })
// //         .then(function (res) {
// //             window.location.reload();
// //         });
// // }
