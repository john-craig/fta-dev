import React, { useRef, useEffect } from 'react'
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

/*

*/

const Drawer = props => {
  const canvasRef = useRef(null)

  const unitSize = 35
  const starSizes = {
      'medium': 1.0
  }
  const planetSizes = {
      'medium': 0.6
  }
  const shipSize = 1.6

  useEffect(() => {
    const sysData = props.sysData
    const vpDim = props.vpDim

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // context.fillStyle = '#999999'
    // context.fillRect(0, 0, vpDim[0], vpDim[1])
    context.drawImage(props.mapBg, 0, 0, vpDim[0], vpDim[1])

    console.log(sysData)
    const actualStar = {
        'radius': unitSize * starSizes[sysData['star']['size']],
        'position': [vpDim[0] / 2, vpDim[1] / 2]
    }

    const actualPlanets = sysData['planets'].map(planet => {
        return {
            'radius': unitSize * planetSizes[planet['size']],
            'position': getActualPosition(
                getActualDistance(unitSize, planet['distance']), 
                planet['angle'], 
                vpDim
            )
        }
    })

    const actualFleets = sysData['fleets'].map(fleet => {
        return {
            'length': unitSize * shipSize,
            'rotation': fleet['angle'] + 90,
            'position': getActualPosition(
                getActualDistance(unitSize, fleet['distance']), 
                fleet['angle'], 
                vpDim
            ),
            'color': fleet['color']
        }
    })

    //If selection position is defined, we should resolve it
    if (props.selPos){
      const selSysId = resolveSystemSelection(props.selPos, relSysRects)

      //This will either set the target system to the system
      //which was collided with, or it will unset the "selectedPosition"
      //variable in the parent, preventing collision detection from
      //being repeated.
      props.setTargSys(selSysId)
    }

    //Drawing of system rectangles and connection lines
    drawMap(
        actualStar,
        actualPlanets,
        actualFleets,
        props.shipImgs,
        context
    )
  }, [
    props.selPos,
    props.targSys
  ])
  
  /*
    Drawing Functions
  */

  function drawStar(radius, position, context){


    context.beginPath();
    context.arc(position[0], position[1], radius, 0, Math.PI * 2, true);
    context.closePath();

    context.fillStyle="#FFFFFF"
    context.fill()
  }

  function drawPlanet(radius, position, context){
    context.beginPath();
    context.arc(position[0], position[1], radius, 0, Math.PI * 2, true);
    context.closePath();

    context.fillStyle="#FFFFFF"
    context.fill()
  }

  function drawFleet(image, length, rotation, position, color, context){
    console.log("Drawing fleet at " + position + " with rotation " + rotation + " and length " + length)

    var fleetCanvas = createCanvas(
      [Math.max(image.height, image.width), Math.max(image.height, image.width)]
    )
    fleetCanvas = rotateCanvas(fleetCanvas, rotation)
    fleetCanvas = recolorImage(image, fleetCanvas, color)

    const actualDimensions = getActualDimensions(length, [fleetCanvas.width, fleetCanvas.height])
    //const adjustedPosition = getAdjustedPosition(position, actualDimensions)

    context.drawImage(fleetCanvas, position[0], position[1], length, length)
    //context.drawImage(fleetCanvas, adjustedPosition[0], adjustedPosition[1], actualDimensions[0], actualDimensions[1])
  }
// 
  function drawMap(actualStar, actualPlanets, actualFleets, shipImgs, context){
    drawStar(
        actualStar['radius'],
        actualStar['position'],
        context
    )
    
    actualPlanets.forEach(planet => {
        drawPlanet(planet['radius'], planet['position'], context)
    })

    actualFleets.forEach(fleet => {
        drawFleet(shipImgs[0], fleet['length'], fleet['rotation'], fleet['position'], fleet['color'], context)
    })
  }

  return <canvas 
    ref={canvasRef} 
    width={props.vpDim[0]}
    height={props.vpDim[1]}
    {...props}
  />
}

export default Drawer