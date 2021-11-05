export function getScaleFactor(vpDim, unitSize, zoom){
    return Math.min(...vpDim) / (unitSize * zoom)
}

//Used to determine if a click has collided with a
//system rectangle, returning the corresponding ID
//if it has
export function resolveSystemSelection(selPos, relSysRects){

}