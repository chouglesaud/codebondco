import EditorJS from "@editorjs/editorjs";
import tools from "./editor/editor.tools";
import Editor from "./editor/editor";

const saveBtn = document.querySelector("#save");
const clearBtn = document.querySelector(".clear");
const publishBtn = document.querySelector(".publishbtn");

const radioBtn = document.querySelectorAll("input[type='radio']");

const editor = new Editor();

window.addEventListener("load", loadEditor);

async function loadEditor() {
    await editor.initialize();
    editor.render();

    let editorjs = new EditorJS({
        holder: "postContent",
        tools,
        data: editor.data,
        initialBlock: "paragraph",
        onChange: () => {
            editor.onChange();
        },
        validate(savedData) {
            if (savedData.text.trim() === "") {
                return false;
            }
            return true;
        },
    });

    radioBtn.forEach((button) => {
        button.addEventListener("change", (e) => {
            editor.onChange();
            editor.changeTechnology(e.target.id);
        });
    });
    saveBtn.addEventListener("click", async () => {
        editor.save(await editorjs.save());
    });
    clearBtn.addEventListener("click", () => {
        editor.clear();
    });
    publishBtn.addEventListener("click", () => {
        editor.publish();
    });

    $(window).keydown(async (event) => {
        if (event.ctrlKey && event.keyCode == 83) {
            event.preventDefault();
            editor.save(await editorjs.save());
        }
        if (event.ctrlKey && event.keyCode == 76) {
            event.preventDefault();
            editor.clear();
        }
    });
}
