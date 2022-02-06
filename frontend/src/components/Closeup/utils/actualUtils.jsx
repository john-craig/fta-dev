//
export function getActualDistance(unitSize, distance){
    return distance * unitSize
}

//
export function getActualPosition(distance, theta, vpDim){
    return [
        (Math.cos(theta * (Math.PI/180)) * distance) + (vpDim[0] / 2),
        (Math.sin(theta * (Math.PI/180)) * distance) + (vpDim[1] / 2)
    ]
}

export function getActualDimensions(length, dimensions){
    return [
        length,
        dimensions[1] * (length / dimensions[0])
    ]
}

export function getAdjustedPosition(position, dimensions){
    return [
        position[0] - (dimensions[0] / 2),
        position[1] - (dimensions[1] / 2),
    ]
}