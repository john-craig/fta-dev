export function createCanvas(dimensions){
    const canvas = document.createElement("canvas");
    
    canvas.height = dimensions[0];
    canvas.width = dimensions[1];

    return canvas
}

export function recolorImage(image, canvas, color){
    const context = canvas.getContext("2d");

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // set composite mode
    context.globalCompositeOperation = "destination-in";
    
    // draw image
    context.drawImage(image, 0, 0);

    return canvas
}

export function rotateCanvas(canvas, theta){
    const context = canvas.getContext("2d")

    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((Math.PI/180)*theta)
    context.translate(canvas.width / -2, canvas.height / -2)

    return canvas
}