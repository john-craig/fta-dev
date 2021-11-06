import { MinimizeTwoTone } from '@material-ui/icons'
import React, { useRef, useEffect } from 'react'
import {
  getScaleFactor,
  resolveSystemSelection
} from '../utils/miscUtils'
import {
  getActualTotalDimensions, getActualViewportPosition
} from '../utils/actualUtils'
import {
  getLogicalViewportDimensions, getLogicalViewportPosition,
  getLogicalTotalDimensions, getLogicallyVisibleSystems, getLogicallyVisibleConnections
} from '../utils/logicalUtils'
import {
  getRelativeConnectionPositions, getRelativeSystemPositions,
  getRelativeConnectionLines, getRelativeSystemRectangles
} from '../utils/relativeUtils'

/*

  Canvas is the object that renders the map. It has 
  the following props:
   - *unitSize*, the length in pixels of the sides of a square
                 used as a basic unit on the map, given as an integer. 
                 n.b., systems are drawn as unit-sized squares
   - *zoom*,     the scale at which the map is zoomed in, given as
                 a double representing the scaling factor relative to one
                 unit of the map
   - *vpPos*,    the position of the viewport relative to 
                 the absolute dimensions of the map in terms of pixels, 
                 given as [x, y]
   - *vpDim*,    the actual physical dimensions of the viewport in terms of pixels, 
                 given as [w,h]
   - *totDim*,   the absolute dimensions of the map in terms of pixels, given as [w,h]
   - *mapData*,  data about the star positions and connection to be draw by the map,
                 given as a JSON object

  For more information about how these interact and are used, see the "reference.md"
  document.

*/

const Drawer = props => {
  const canvasRef = useRef(null)

  const unitSize = 20

  useEffect(() => {
    const zoom = props.zoom
    const vpDim = props.vpDim
    const vpOff = props.vpOff
    const mapData = props.mapData
    const targSys = props.targSys

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.fillStyle = '#999999'
    context.fillRect(0, 0, vpDim[0], vpDim[1])

    //Scale factor
    const scaleFactor = getScaleFactor(vpDim, unitSize, zoom)

    // console.log("*** ZOOM ACTUALS ***")
    // console.log("Zoom:          ", zoom)
    // console.log("Unit Size:     ", unitSize)
    // console.log("Scale Factor:  ", scaleFactor)

    //Determine the calculable actual dimensions in pixels
    const totDim = getActualTotalDimensions(mapData, vpDim, scaleFactor)
    const vpPos = getActualViewportPosition(targSys, vpDim, vpOff, totDim, scaleFactor)

    // console.log("*** BASE ACTUALS ***")
    // console.log("Actual Viewport Dimensions: ", vpDim)
    // console.log("Actual Viewport Position:   ", vpPos)
    // console.log("Actual Total Dimensions:    ", totDim)

    //Logical positions and dimensions of viewport and canvas
    const logVpPos = getLogicalViewportPosition(vpPos, scaleFactor)
    const logVpDim = getLogicalViewportDimensions(vpDim, scaleFactor)
    const logTotDim = getLogicalTotalDimensions(totDim, scaleFactor)

    // console.log("*** BASE LOGICALS ***")
    // console.log("Logical Viewport Dimensions: ", logVpDim)
    // console.log("Logical Viewport Position:   ", logVpPos)
    // console.log("Logical Total Dimensions:    ", logTotDim)

    //Logical positions of systems and connections
    const logVisSys = getLogicallyVisibleSystems(mapData, logVpPos, logVpDim, logTotDim)
    const logVisCons = getLogicallyVisibleConnections(mapData, logVisSys, logTotDim)

    // console.log("*** MAP LOGICALS ***")
    // console.log("Logically Visible Systems:       ", logVisSys)
    // console.log("Logically Visible Connections:   ", logVisCons)

    //Relative positions of systems and connections
    const relSys = getRelativeSystemPositions(logVisSys, logVpPos, scaleFactor)
    const relCons = getRelativeConnectionPositions(logVisCons, logVpPos, scaleFactor)

    // console.log("*** MAP RELATIVES ***")
    // console.log("Relative System Positions:       ", relSys)
    // console.log("Relative Connection Positions:   ", relCons)

    //Relative positions of system rectangles and connection lines
    const relSysRects = getRelativeSystemRectangles(relSys, unitSize)
    const relConLines = getRelativeConnectionLines(relCons)

    //If selection position is defined, we should resolve it
    if (props.selPos){
      const selSysId = resolveSystemSelection(props.selPos, relSysRects)

      //This will either set the target system to the system
      //which was collided with, or it will unset the "selectedPosition"
      //variable in the parent, preventing collision detection from
      //being repeated.
      props.setTargSys(selSysId)
    }

    // console.log("*** DRAWN RELATIVES ***")
    // console.log("Relative System Rectangles:  ", relSysRects)
    // console.log("Relative Connection Lines:   ", relConLines)

    //Drawing of system rectangles and connection lines
    drawMap(
      relSysRects, 
      relConLines, 
      props.sysIcon,
      context)
  }, [
    props.zoom,
    props.vpOff,
    props.selPos,
    props.targSys
  ])
  
  /*
    Drawing Functions
  */

  function drawSystemRectangle(sysRect, sysIcon, context){
    //To do: handle colors and images

    //console.log("Drawing Rect:  ", sysRect)
    context.fillStyle = "ff00ff";

    context.drawImage(
      sysIcon,
      sysRect['x'],
      sysRect['y'],
      sysRect['w'],
      sysRect['h'],
    )
    // context.fillRect(
    //   sysRect['x'],
    //   sysRect['y'],
    //   sysRect['w'],
    //   sysRect['h'],
    // )
  }

  function drawConnectionLine(conLine, context){
    //To do: handle colors and images
    context.fillStyle = '#0000ff'

    context.beginPath();
    context.moveTo(
      conLine[0]['x'],
      conLine[0]['y']
    );
    context.lineTo(
      conLine[1]['x'],
      conLine[1]['y']
    );
    context.stroke();
  }

  function drawMap(relSysRects, relConLines, sysIcon, context){
    relConLines.forEach(function(conLine){
      drawConnectionLine(conLine, context)
    })

    Object.keys(relSysRects).forEach(function(key){
      drawSystemRectangle(relSysRects[key], sysIcon, context)
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