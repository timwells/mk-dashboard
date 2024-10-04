const ColorSingleton = (function () {
    let instance; // Store the single instance
    const colors = [
        "Red", "Blue", "Green", "DarkGoldenRod", "Orange", "Purple", "Cyan", 
        "Magenta", "Lime", "Crimson", "DarkBlue", "DarkGreen", "Gold",
        "FireBrick", "DeepPink", "DodgerBlue", "DarkOrange", "DarkViolet", 
        "MediumSeaGreen", "Tomato"      
    ]
    let index = 0;
  
    function createInstance() {
      return {
        getNextColor: function () {
          const color = colors[index];
          index = (index + 1) % colors.length; // Loop back to the start when reaching the end
          return color;
        }
      };
    }
  
    return {
      getInstance: function () {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      }
    };
  })();
  
  // Example usage:
  //const color1 = ColorSingleton.getInstance().getNextColor(); // "Red"
  //const color2 = ColorSingleton.getInstance().getNextColor(); // "Blue"
  //console.log(color1, color2); // Outputs: "Red Blue"
  
export function genRndColor() {  
    // Generate a random color by picking a random number and converting it to a hex code
    // return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // Generate bold colors by setting one or two components to 255 or 0, and the third to a random high or low value.
    let r = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128); // Either close to 255 or a low value
    let g = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128);
    let b = Math.random() < 0.08 ? 255 : Math.floor(Math.random() * 128);

    return `rgb(${r}, ${g}, ${b})`;
}

export function genRndColor2() {  
  return ColorSingleton.getInstance().getNextColor(); // "Red"
}

