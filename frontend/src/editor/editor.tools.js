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
import ImageTool from "./tools/image/image";

import embedPlugin from "./plugins/plugin.embed";

export default {
    embed: {
        class: Embed,
        shortcut: "ALT+E",
        config: {
            services: {
                youtube: true, //default
                codepen: embedPlugin.codepen,
                codesandbox: embedPlugin.codesandbox,
                pythonsandbox: embedPlugin.pythonsandbox,
                gist: embedPlugin.gist,
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
};
