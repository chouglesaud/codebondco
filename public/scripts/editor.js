import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/simple-image";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import Icode from "@editorjs/inline-code";
import Warning from "@editorjs/warning";
import Para from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "../../plugin/image/image";

let button = document.querySelector(".publishbtn");
let imageUrl = document.querySelector("#image-url");
let title = document.querySelector("#postTitle h1");
let publishbtn = document.querySelector(".publishbtn");
let save = document.querySelector("#save");
let clear = document.querySelector(".clear");
let today = document.querySelector(".Today");
let Radio = document.querySelectorAll("input[type='radio']");

if (localStorage.getItem("tech")) {
    if (document.querySelector(`#${localStorage.getItem("tech")}`)) {
        document
            .querySelector(`#${localStorage.getItem("tech")}`)
            .setAttribute("checked", "true");
    }
}

Radio.forEach((element) => {
    element.addEventListener("change", (e) => {
        save.textContent = "Save";
        button.setAttribute("disabled", "disabled");
        localStorage.setItem("tech", e.target.id);
    });
});
let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
];
let date = new Date();

let fulldate = `${
    month[date.getMonth()]
} ${date.getDate()},${date.getFullYear()}`;

today.innerHTML = fulldate;

let techNumber, editor, obj, rawObj, titleList;

clear.addEventListener("click", clearContent);

async function clearContent() {
    let decision = await swal("Are you sure?", {
        dangerMode: true,
        buttons: ["No", "Yes"],
    });
    if (decision) {
        axios.post("/post/preview", null).then((res) => {
            localStorage.clear();

            window.location.reload();
        });
    }
}
window.addEventListener("load", async () => {
    await axios
        .post("/post/reload")
        .then(async (res) => {
            await localStorage.setItem("post", JSON.stringify(res.data));
        })
        .then(() => {
            if (localStorage.getItem("post") !== null) {
                rawObj = localStorage.getItem("post");
                obj = JSON.parse(rawObj);
                if (obj.title) {
                    title.innerHTML = obj.title;
                }
            } else {
                obj = {
                    savedData: null,
                };
            }
            editor = new EditorJS({
                holder: "postContent",

                tools: {
                    embed: {
                        class: Embed,
                        shortcut: "ALT+E",
                        config: {
                            services: {
                                youtube: true,
                                codepen: {
                                    regex: /https:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                                    embedUrl:
                                        "https://codepen.io/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2",
                                    html:
                                        "<iframe class='embed-responsive embed-responsive-16by9' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",

                                    id: (groups) =>
                                        groups.join("/embed/preview/"),
                                },
                                codesandbox: {
                                    regex: /https:\/\/codesandbox.io\/embed\/([^\/\?\&]*)/,
                                    embedUrl:
                                        "https://codesandbox.io/embed/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2",
                                    html:
                                        "<iframe class='embed-responsive embed-responsive-16by9' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                                    height: 300,
                                    width: 600,
                                    id: (groups) =>
                                        groups.join("/embed/preview/"),
                                },
                                pythonsandbox: {
                                    regex: /https:\/\/repl.it\/([^\/\?\&]*)\/([^\/\?\&]*)/,
                                    embedUrl:
                                        "https://repl.it/<%= remote_id %>?lite=true",
                                    html:
                                        "<iframe class='embed-responsive embed-responsive-16by9' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                                    height: 200,
                                    width: 600,
                                    id: (groups) => groups.join("/"),
                                },
                            },
                        },
                    },
                    hostedImage: {
                        class: ImageTool,
                        shortcut: "ALT+I",
                    },
                    delimiter: {
                        class: Delimiter,
                        shortcut: "ALT+D",
                        inlineToolbar: true,
                    },
                    Marker: {
                        class: Marker,
                        inlineToolbar: true,
                    },
                    image: {
                        class: Image,
                        inlineToolbar: ["link"],
                        placeholder: "caption",
                    },

                    code: {
                        class: Code,
                        shortcut: "ALT+X",
                    },
                    list: {
                        class: List,
                        shortcut: "ALT+L",
                        inlineToolbar: true,
                    },
                    header: {
                        class: Header,
                        shortcut: "ALT+H",

                        config: {
                            placeholder: "Enter a header",
                        },
                    },

                    quote: {
                        class: Quote,
                        shortcut: "ALT+Q",
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: "Enter a quote",
                            captionPlaceholder: "Quote's author",
                        },
                    },
                    icode: {
                        class: Icode,
                    },
                    paragraph: {
                        class: Para,
                        inlineToolbar: true,
                        config: {
                            placeholder: "Start Writing",
                        },
                    },
                    warning: {
                        class: Warning,
                        inlineToolbar: true,
                        shortcut: "ALT+W",

                        config: {
                            messagePlaceholder: "Message",
                        },
                    },
                },
                data: obj.savedData,
                initialBlock: "paragraph",

                onChange: () => {
                    save.textContent = "Save";
                    button.setAttribute("disabled", "disabled");
                },
                validate(savedData) {
                    if (savedData.text.trim() === "") {
                        return false;
                    }

                    return true;
                },
            });
        });
});

$(window).keydown(function (event) {
    if (event.ctrlKey && event.keyCode == 83) {
        event.preventDefault();
        preview();
    }
    if (event.ctrlKey && event.keyCode == 76) {
        event.preventDefault();
        clearContent();
    }
});
title.addEventListener("focus", () => {
    save.textContent = "Save";
    button.setAttribute("disabled", "disabled");
});

button.addEventListener("click", varification);
save.addEventListener("click", preview);

async function preview(e) {
    let outputData = await editor.save();
    let content = outputData.blocks;
    let postTitle = title.innerHTML.replace(/[^A-Za-z0-9\-#$*%?]/g, " ");

    title.innerHTML = postTitle;

    save.textContent = "Saving";

    let hero1 = await {
        date: fulldate,
        title: postTitle,
        savedData: outputData,
        content,
    };

    axios.post("/post/preview", hero1).then((res) => {
        button.removeAttribute("disabled");
        save.textContent = "Saved";
        localStorage.setItem("post", JSON.stringify(res.data));
    });
}

publishbtn.addEventListener("click", varification);

async function varification(e) {
    let outputData = await editor.save();
    let content = outputData.blocks;
    let score = 0;
    let noSpecialChar = title.innerHTML
        .toLowerCase()
        .replace(/[^A-Za-z0-9]/g, " ");
    let noWSpaceAtStartAndEnd = noSpecialChar.trim();
    let slug = noWSpaceAtStartAndEnd.replace(/\s/g, "-");

    await axios.post("/confirm", { slug }).then((res) => {
        if (res.data.confirmation) {
            swal("title already exist.", { buttons: "Close" });
        } else {
            score++;
        }
    });

    if (title.innerHTML === "") {
        swal("title is empty", { buttons: "Close" });
    } else {
        score++;
    }

    if (!document.querySelector(`#${localStorage.getItem("tech")}`)) {
        swal("please select the post category", { buttons: "Close" });
    } else {
        score++;
    }

    if (title.innerHTML.length < 5) {
        swal("title is too short", { buttons: "Close" });
    } else {
        score++;
    }

    if (content.length < 7) {
        swal("Content is too short.", { buttons: "Close" });
    } else {
        score++;
    }

    if (score === 5) {
        let decision = await swal("Are you ready to publish?", {
            buttons: ["No", "Yes"],
        });

        if (decision) {
            button.textContent = "Publishing..";
            button.setAttribute("disabled", "disabled");
            let hero = {
                date: fulldate,
                title: title.innerHTML,
                img:
                    content[0].type === "hostedImage"
                        ? content[0].data.file.url
                        : content[0].type === "image"
                        ? content[0].data.url
                        : null,
                tech: localStorage.getItem("tech"),
                content,
            };
            publish(hero);
        }
    }
}

function publish(hero) {
    axios.post("/publish/post", hero).then((res) => {
        if (res.data.done) {
            setTimeout(() => {
                window.location.href = "/";
            }, 4000);
        }
    });
}

$("a").attr({
    rel: "noopener nofollow",
});

jQuery(function ($) {
    $("#postTitle h1").blur(function () {
        var $element = $(this);

        if ($element.html().length && !$element.text().trim().length) {
            $element.empty();
        }
    });
});
jQuery(function ($) {
    $(".image-tool__caption[contentEditable='true']").blur(function () {
        var $element = $(this);

        if ($element.html().length && !$element.text().trim().length) {
            $element.empty();
        }
    });
});
