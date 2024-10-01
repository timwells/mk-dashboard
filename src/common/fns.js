export function genRndColor() {
    // Generate a random color by picking a random number and converting it to a hex code
    // return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // Generate bold colors by setting one or two components to 255 or 0, and the third to a random high or low value.
    let r = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128); // Either close to 255 or a low value
    let g = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128);
    let b = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128);

    return `rgb(${r}, ${g}, ${b})`;
}