export function genRndColor() {
    // Generate a random color by picking a random number and converting it to a hex code
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
