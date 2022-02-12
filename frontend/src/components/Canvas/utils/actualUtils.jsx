import { getScaleFactor, getScaleUnit } from "./miscUtils"

//This determines what the actual total dimensions of the map
//must be based on positions of the further systems
export function getActualTotalDimensions(mapData, vpDim, scaleUnit){
    const systems = mapData['systems']
    var leastX = 0
    var leastY = 0
    var greatX = 0
    var greatY = 0

    Object.keys(systems).forEach(function(key){
        const sys = systems[key]

        leastX = (sys['pos'][0] < leastX) ? sys['pos'][0] : leastX
        leastY = (sys['pos'][1] < leastY) ? sys['pos'][1] : leastY
        greatX = (sys['pos'][0] > greatX) ? sys['pos'][0] : greatX
        greatY = (sys['pos'][1] > greatY) ? sys['pos'][1] : greatY
    })

    //The hypothetical edges of the map
    const hypoWidth = (greatX - leastX) * scaleUnit
    const hypoHeight = (greatY - leastY) * scaleUnit

    //If the hypothetical dimension is larger, use that; if the actual
    //viewport dimension is larger, use it instead. 
    const actualWidth = (hypoWidth > vpDim[0]) ? hypoWidth : vpDim[0]
    const actualHeight = (hypoHeight > vpDim[1]) ? hypoHeight : vpDim[1]

    //Lastly add on the viewport dimensions so there is an extra
    //buffe of half the viewport at each edge of the map
    const totalDimensions = [
        actualWidth + vpDim[0],
        actualHeight + vpDim[1]
    ]

    return totalDimensions
}

//This determines what the actual position of the viewport must be
//in order for it to be centered upon the logical position of a target
//system. When the target system is undefined, it instead returns
//the position for the viewport to be at the center of the map.
export function getActualViewportPosition(targSys, vpDim, vpOff, totDim, scaleUnit){
    //If there is a target system, use its actual position
    //in pixels to the target position. Otherwise, use the origin
    const targPos = (targSys) ? 
        [targSys['pos'][0] * scaleUnit, targSys['pos'][1] * scaleUnit] :
        [0, 0]
    
    //Add the target position and the current offsets to the 
    //center of the total map
    const basePos = [
        vpOff[0] + targPos[0] + (totDim[0] / 2),
        vpOff[1] + targPos[1] + (totDim[1] / 2)
    ]

    //Finally adjust by the size of the viewport dimensions
    var vpPos = [
        basePos[0] - (vpDim[0] / 2),
        basePos[1] - (vpDim[1] / 2)
    ]

    //Force the viewport position to remain within the bounds of the total
    //dimensions. 
    vpPos[0] = (vpPos[0] < 0) ? 0 : vpPos[0]
    vpPos[0] = (vpPos[0] + vpDim[0] > totDim[0]) ? totDim[0] - vpDim[0] : vpPos[0]
    vpPos[1] = (vpPos[1] < 0) ? 0 : vpPos[1]
    vpPos[1] = (vpPos[1] + vpDim[1] > totDim[1]) ? totDim[1] - vpDim[1] : vpPos[1]

    /*
        Note: 
            This does not stop the viewport offset from increasing.
            If a user hits the edge of the map and attempts to keep dragging, 
            it will be as if they went beyond the edge, but the map itself will 
            not scroll, so they will have to drag back just as far to actually 
            scroll in another direction away from the edge.

            Tough shit for them.
    */

    return vpPos
}

//Determines the actual position of a system
export function getActualPosition(targSys, vpDim, unitSize){
    const scaleUnit = getScaleUnit(vpDim, unitSize)

    return [
        targSys['pos'][0] * scaleUnit,
        targSys['pos'][1] * scaleUnit
    ]
}