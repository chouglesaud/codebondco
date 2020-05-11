import lazyload from "lozad";
const images = document.querySelectorAll(".lazy");

images.forEach((el) => {
    const observer = lazyload(el);
    observer.observe();
});
