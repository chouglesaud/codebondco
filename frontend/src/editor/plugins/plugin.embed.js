const html =
    "<iframe class='embed-responsive embed-responsive-16by9' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>";

export default {
    codepen: {
        regex: /https:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
        embedUrl:
            "https://codepen.io/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2",
        html,
        id: (groups) => groups.join("/embed/preview/"),
    },
    codesandbox: {
        regex: /https:\/\/codesandbox.io\/embed\/([^\/\?\&]*)/,
        embedUrl:
            "https://codesandbox.io/embed/<%= remote_id %>?height=400&theme-id=0&default-tab=css,result&embed-version=2",
        html,
        height: 300,
        width: 600,
        id: (groups) => groups.join("/embed/preview/"),
    },
    pythonsandbox: {
        regex: /https:\/\/repl.it\/([^\/\?\&]*)\/([^\/\?\&]*)/,
        embedUrl: "https://repl.it/<%= remote_id %>?lite=true",
        html,
        height: 200,
        width: 600,
        id: (groups) => groups.join("/"),
    },
    gist: {
        regex: /https:\/\/gist.github.com\/([^\/\?\&]*)\/([^\/\?\&]*)/,
        embedUrl: "https://gist.github.com/<%= remote_id %>",
        html:
            "<script src='https://gist.github.com/<%= remote_id %>.js'></script>",
        height: 300,
        width: 600,
        id: (groups) => groups.join("/"),
    },
};
