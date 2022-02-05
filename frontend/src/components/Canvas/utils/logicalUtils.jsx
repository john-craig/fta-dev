 /*
    Logical Calculation Functions
 */

import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions"

//Determines the position of the viewport, in terms of unitSize,
//relative to the upper-left hand corner of the total size of the map
export function getLogicalViewportPosition(
    targSys,
    vpOff,
    vpDim,
    totDim,
    scaleFactor,
    scaleUnit
){
    const logTargPos = (targSys) ? 
        [targSys['pos'][0], targSys['pos'][1]] :
        [0, 0]

    const logBasePos = [
        (vpOff[0] / scaleUnit) + ((totDim[0] / 2) / scaleFactor),
        (vpOff[1] / scaleUnit) + ((totDim[1] / 2) / scaleFactor),
    ]

    const logVpDim = [
        logBasePos[0] - ((vpDim[0] / 2) / scaleFactor) + logTargPos[0],
        logBasePos[1] - ((vpDim[1] / 2) / scaleFactor) + logTargPos[1]
    ]

    return logVpDim

    // return [
    //     ((vpPos[0] + (vpDim[0] / 2)) / scaleFactor) - (logVpDim[0] / 2),
    //     ((vpPos[1] + (vpDim[1] / 2)) / scaleFactor) - (logVpDim[1] / 2)
    // ]
}
    
//Determines the dimensions of the viewport in terms of unitSize
export function getLogicalViewportDimensions(vpDim, scaleFactor){
    return [
        vpDim[0] / scaleFactor,
        vpDim[1] / scaleFactor
    ]
}

//Determines the total size of the map in terms of unitSize
export function getLogicalTotalDimensions(totDim, scaleFactor){
    return [
        totDim[0] / scaleFactor,
        totDim[1] / scaleFactor
    ]
}

//Determines a position relative to the upper-lefthand corner of the
//map based on a position relative to the origin of the map
export function getLogicalPosition(pos, logTotDim){
    return [
        pos[0] + (logTotDim[0] / 2),
        pos[1] + (logTotDim[1] / 2),
    ]
}
    
//Determines whether a position relative to the upper-left hand corner
//of the map is inside of the current viewport
export function logicallyInsideViewport(logPos, logVpPos, logVpDim){
    return logPos[0] > logVpPos[0] && logPos[0] < (logVpPos[0]+ logVpDim[0]) &&
        logPos[1] > logVpPos[1] && logPos[1] < (logVpPos[1]+ logVpDim[0])
}

//Determines the cardinal direction from which a logical position is
//located with respect to the viewport, where:
//  0 is North
//  1 is West
//  2 is South
//  3 is East
//additionally,
//  -1 indicates the position has no cardinal relation or
//     it is inside the viewport
export function logicalViewportCardinal(logPos, logVpPos, logVpDim){
    var cardinal = -1

    //This means it is within the horizontal bounds of the viewport
    if(logPos[0] > logVpPos[0] && logPos[0] < (logVpPos[0] + logVpDim[0])){
        //North
        if(logPos[1] < logVpPos[1]){
            cardinal = 0
        }

        //South
        if(logPos[1] > logVpPos[1] + logVpDim[1]){
            cardinal = 2
        }
    }

    //This means it is within the vertical bounds of the viewport
    if(logPos[1] > logVpPos[1] && logPos[1] < (logVpPos[1] + logVpDim[1])){
        //East
        if(logPos[0] < logVpPos[0]){
            cardinal = 3
        }

        //West
        if(logPos[0] > logVpPos[0] + logVpDim[0]){
            cardinal = 1
        }
    }

    return cardinal
}

//Determines all the systems currently inside of the viewport. It returns
//an object with the ID's of each visible system as the keys and the 
//position of each system relative to the upper-left hand corner of the
//map as the values.
export function getLogicallyVisibleSystems(mapData, logVpPos, logVpDim, logTotDim){
    const systems = mapData['systems']

    return Object.keys(systems).reduce(function (previous, key) {
        const logPos = getLogicalPosition(systems[key]['pos'], logTotDim)

        //console.log("Logical Position of System ", key, ": ", logPos)

        if (logicallyInsideViewport(logPos, logVpPos, logVpDim)) {
            previous[key] = logPos
        }

        return previous
    }, {});
}

//Determines all connections with at least one of their systems currently
//inside of the viewport. It returns an array with the positions of both
//systems of the connection, relative to the upper left-hand corner of
//the map.
export function getLogicallyVisibleConnections(
        mapData, 
        logVisSys, 
        logVpPos, 
        logVpDim,
        logTotDim
    ){
    const connections = mapData['connections']
    const systems = mapData['systems']

    return connections.reduce(function(previous, con){
        const conIdA = con[0]
        const conIdB = con[1]

        var logCon = {}
        var visible = false

        //If the first ID is already a visible system, use it
        if(conIdA in logVisSys){
            logCon[conIdA] = logVisSys[conIdA]
            visible = true
        } else {
            //Otherwise calculate it for later
            logCon[conIdA] = getLogicalPosition(systems[conIdA]['pos'], logTotDim)
        }

        //If the second ID is already a visible system, use it
        if(conIdB in logVisSys){
            logCon[conIdB] = logVisSys[conIdB]
            visible = true
        } else {
            //Otherwise calculate it for later
            logCon[conIdB] = getLogicalPosition(systems[conIdB]['pos'], logTotDim)
        }

        if(!visible){
            //It's possible that even if neither system is actually visible,
            //the connection itself will still be visible because it is passing
            //though the viewport
            const sysOrdA = logicalViewportCardinal(
                logCon[conIdA], logVpPos, logVpDim
            )
            const sysOrdB = logicalViewportCardinal(
                logCon[conIdB], logVpPos, logVpDim
            )

            //This basically says that the connection is visible if
            //one system is East and the other system is West
            //or if one system is North and the other system in South
            visible = (sysOrdA % 2 == sysOrdB % 2) && (sysOrdA != sysOrdB)
        }

        if(visible){
            previous.push(logCon)
        }

        return previous
    }, [])
}