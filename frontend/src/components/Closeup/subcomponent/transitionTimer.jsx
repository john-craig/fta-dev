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

export function fadeIn(changeOpacity){
    const idealDuration = 200;
    const numFrames = 60 / (1000 / idealDuration)
    const deltaOpacity = 1 * (1 / numFrames)

    console.log("Beginning fade-in in Closeup")

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

    console.log("Beginning fade-out in Closeup")

    function incrementState(){
        changeOpacity(deltaOpacity)
    }
    
    //Starts the interval timer and removes it when it's finished
    const interval = setInterval(incrementState, idealDuration / numFrames);
    setTimeout(function() {clearInterval(interval)},
         idealDuration
    )
}