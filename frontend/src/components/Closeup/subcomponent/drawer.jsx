import React, { useRef, useEffect } from 'react'
import {
    getActualDistance,
    getActualPosition,
    getActualDimensions,
    getAdjustedPosition
} from '../utils/actualUtils'

import {
  drawStar, drawPlanet, drawFleet
} from '../utils/drawUtils'

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
    const opacity = props.opacity

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // context.fillStyle = '#999999'
    // context.fillRect(0, 0, vpDim[0], vpDim[1])
    // context.drawImage(props.mapBg, 0, 0, vpDim[0], vpDim[1])
    context.clearRect(0, 0, vpDim[0], vpDim[1]);
    context.globalAlpha = opacity;

    //console.log(sysData)
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
            'angle': fleet['angle'],
            'rotation': fleet['angle'] + 90,
            'position': getActualPosition(
                getActualDistance(unitSize, fleet['distance']), 
                fleet['angle'], 
                vpDim
            ),
            'color': fleet['color'],
            'number': fleet['number']
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
    props.targSys,
    props.opacity
  ])
  
  /*
    Drawing Functions
  */

  
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
        drawFleet(shipImgs[7], fleet['length'], fleet['angle'], fleet['rotation'], fleet['position'], fleet['color'], fleet['number'], context)
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