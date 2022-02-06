import {
    getActualDistance,
    getActualPosition,
    getActualDimensions,
    getAdjustedPosition
} from '../utils/actualUtils'
import {
    createCanvas,
      recolorImage, rotateCanvas, rotateImage
  } from '../utils/imageUtils'

export function drawStar(radius, position, context){
    context.beginPath();
    context.arc(position[0], position[1], radius, 0, Math.PI * 2, true);
    context.closePath();

    context.fillStyle="#FFFFFF"
    context.fill()
}

export function drawPlanet(radius, position, context){
    context.beginPath();
    context.arc(position[0], position[1], radius, 0, Math.PI * 2, true);
    context.closePath();

    context.fillStyle="#FFFFFF"
    context.fill()
}

export function drawShip(image, length, rotation, position, color, context){
    var shipCanvas = createCanvas(
        [Math.max(image.height, image.width), Math.max(image.height, image.width)]
    )
    shipCanvas = rotateCanvas(shipCanvas, rotation)
    shipCanvas = recolorImage(image, shipCanvas, color)

    const actualDimensions = getActualDimensions(length, [shipCanvas.width, shipCanvas.height])
    //const adjustedPosition = getAdjustedPosition(position, actualDimensions)

    context.drawImage(shipCanvas, position[0], position[1], length, length)
    //context.drawImage(shipCanvas, adjustedPosition[0], adjustedPosition[1], actualDimensions[0], actualDimensions[1])
}

export function drawFleet(image, length, angle, rotation, position, color, number, context){
    const fleetRows = getFleetRows(number)
    const horizontalOffset = length * 1.1
    const verticalOffset = (image.height * (length / image.width)) * 1.1

    console.log(fleetRows)

    var shipDelta = []
    for(var i=0;i<fleetRows.length;i++){
        //Starting from the top
        shipDelta[0] = verticalOffset * (i - ((fleetRows.length - 1) / 2))

        for(var j=0;j<fleetRows[i];j++){
            shipDelta[1] = horizontalOffset * (j - ((fleetRows[i] - 1) / 2))

            console.log(i + " " + j)
            console.log(shipDelta)

            const rotShipDelta = [
                Math.cos(angle) * shipDelta[0] - Math.sin(angle) * shipDelta[1],
                Math.cos(angle) * shipDelta[1] + Math.sin(angle) * shipDelta[0]
            ]
            const shipFormationPosition = [
                position[0] + rotShipDelta[0],
                position[1] + rotShipDelta[1]
            ]

            drawShip(image, length, rotation, shipFormationPosition, color, context)
        }
    }
}

export function getFleetRows(number){
    //The middlemost row will have about half
    var rows = [Math.ceil(number / 2)]

    var rem = number - rows[0]
    var top = 0;
    var bottom = 0
    while(rem > 0){
        top = Math.floor(rem / 2) > 0 ? Math.floor(rem / 2) : 1
        bottom = Math.floor(rem / 2) > 0 ? Math.floor(rem / 2) : 1

        if(rem - top >= 0){
            rem -= top
            rows.unshift(top)
        }

        if(rem - bottom >= 0){
            rem -= bottom
            rows.push(bottom)
        }
    }

    return rows
}