const months = [
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
function getFullDate() {
    const date = new Date();

    return `${months[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`;
}

export { getFullDate };
