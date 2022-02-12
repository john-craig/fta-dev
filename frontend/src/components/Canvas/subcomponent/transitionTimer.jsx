import React from 'react'
import { getActualPosition } from '../utils/actualUtils';
import { getScaleFactor, getScaleUnit} from '../utils/miscUtils';
/*
    So this needs to accept the current position and zoom level of the canvas, along with a target system.
    
    The timer will change the position and zoom level relative to the target until it is zoomed in all
    the way and completely centered.

    Once it's centered there is then a transition where the entire map needs to increase its opacity to zero.
    This will be coupled with a similar transition for the closeup view which begins at opacity of zero and
    increases until fully opaque.

    The reverse transition needs to be done when no longer focused in on a system.

    Target time for the whole process (for now) is 1/4 of a second. So .2 seconds spent on the zoom, .05 seconds
    spend on the fade-in.

    Also the parent component (the drawer) needs to stop accepting any inputs while the transition occurs or stuff
    will fuck up bigly.
*/
const unitSize = 20

export async function handleTransition(
    curOff,
    curDim,
    curZoom,
    targSys,

    changeOffset,
    changeZoom,
    changeOpacity,
){
    zoomIntoTarget(curOff, curDim, curZoom, targSys, changeOffset, changeZoom)


    return new Promise(function(resolve){
        setTimeout(function() {
            fadeOut(changeOpacity)
            resolve()
        },500)
    })
}


export function zoomIntoTarget(
    curOff,
    curDim,
    curZoom,
    targSys,

    changeOffset,
    changeZoom
){
    const idealDuration = 500;
    const numFrames = 60 / (1000 / idealDuration)

    //Zoom calculations
    const endZoom = 0.15
    var deltaZoom = -1 * ((curZoom - endZoom) / numFrames)

    const scaleFactor = getScaleFactor(curDim, unitSize, curZoom)
    const scaleUnit = getScaleUnit(curDim, unitSize)

    var endPos = getActualPosition(targSys, curDim, unitSize)
    var deltaPos = [
        (endPos[0] - curOff[0]) / numFrames,
        (endPos[1] - curOff[1]) / numFrames
    ]
    // console.log("Scale Unit: ", scaleUnit)
    // console.log("Scale Unit: ", scaleFactor)
    // console.log("Ending Position:", endPos)
    // console.log("Current Offset:", curOff)


    function incrementState(){
        changeZoom(deltaZoom)
        changeOffset(deltaPos)
    }
    
    //Starts the interval timer and removes it when it's finished
    const interval = setInterval(incrementState, idealDuration / numFrames);
    setTimeout(function() {clearInterval(interval)},
         idealDuration
    )
}

export function fadeIn(changeOpacity){
    const idealDuration = 200;
    const numFrames = 60 / (1000 / idealDuration)
    const deltaOpacity = 1 * (1 / numFrames)

    console.log("Beginning fade-in in Canvas")

    function incrementState(){
        changeOpacity(deltaOpacity)
    }
    
    //Starts the interval timer and removes it when it's finished
    const interval = setInterval(incrementState, idealDuration / numFrames);
    return new Promise(function(resolve){
        setTimeout(function() {
            clearInterval(interval)
            resolve()
        },
            idealDuration
        )
    })
}

export function fadeOut(changeOpacity){
    const idealDuration = 200;
    const numFrames = 60 / (1000 / idealDuration)
    const deltaOpacity = -1 * (1 / numFrames)

    function incrementState(){
        changeOpacity(deltaOpacity)
    }
    
    //Starts the interval timer and removes it when it's finished
    const interval = setInterval(incrementState, idealDuration / numFrames);
    setTimeout(function() {clearInterval(interval)},
         idealDuration
    )
}