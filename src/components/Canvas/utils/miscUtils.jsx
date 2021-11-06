export function getScaleFactor(vpDim, unitSize, zoom){
    return Math.min(...vpDim) / (unitSize * zoom)
}

//Used to determine if a click has collided with a
//system rectangle, returning the corresponding ID
//if it has
export function resolveSystemSelection(selPos, relSysRects){
    var selSys = undefined

    Object.keys(relSysRects).forEach(function(key){
        const relSys = relSysRects[key]

        if(
            selPos[0] > relSys['x'] && selPos[0] < (relSys['x'] + relSys['w']) &&
            selPos[1] > relSys['y'] && selPos[1] < (relSys['y'] + relSys['h'])
        ){
            selSys = key
        }
    })

    return selSys
}