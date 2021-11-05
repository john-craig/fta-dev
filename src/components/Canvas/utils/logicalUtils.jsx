 /*
    Logical Calculation Functions
 */

//Determines the position of the viewport, in terms of unitSize,
//relative to the upper-left hand corner of the total size of the map
export function getLogicalViewportPosition(vpPos, scaleFactor){
    return [
        vpPos[0] / scaleFactor,
        vpPos[1] / scaleFactor
    ]
}
    
//Determines the dimensions of the viewport in terms of unitSize
export function getLogicalViewportDimensions(vpDim, scaleFactor){
    // return [
    //   (vpDim[0] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
    //   (vpDim[1] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
    // ]
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
export function getLogicallyVisibleConnections(mapData, logVisSys, logTotDim){
    const connections = mapData['connections']
    const systems = mapData['systems']

    return connections.reduce(function(previous, con){
        const conIdA = con[0]
        const conIdB = con[1]

        if(conIdA in logVisSys || conIdB in logVisSys){
        previous.push({
            conIdA: (conIdA in logVisSys) ? logVisSys[conIdA] : getLogicalPosition(systems[conIdA], logTotDim),
            conIdB: (conIdB in logVisSys) ? logVisSys[conIdB] : getLogicalPosition(systems[conIdB], logTotDim)
        })
        }

        return previous
    }, [])
}