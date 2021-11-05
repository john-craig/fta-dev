import { MinimizeTwoTone } from '@material-ui/icons'
import React, { useRef, useEffect } from 'react'

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
  const unitSize = 10

  /* These should be passed in as props */
  var vpDim = []
  var vpPos = []
  var totDim = []
  var mapData = []

  //const []
  const canvasRef = useRef(null)

  useEffect(() => {
    const zoom = props.zoom
    console.log(zoom)

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')


    // vpDim = [
    //   1000,
    //   800
    // ]

    vpDim = [
      context.canvas.width,
      context.canvas.height
    ]

    var canvas_width = context.canvas.clientWidth;
    var canvas_height = context.canvas.clientHeight;

    context.fillStyle = '#999999'
    context.fillRect(0, 0, vpDim[0], vpDim[1])

    //Temporary
    totDim = [
      vpDim[0] * 10,
      vpDim[1] * 10,
    ]
    
    //Temporary
    vpPos = [
      (totDim[0] - vpDim[0]) / 2,
      (totDim[1] - vpDim[1]) / 2,
    ]

    mapData = {
      "systems": {
        "0": {
          "pos": [0, 0]
        },
        "1": {
          "pos": [2, 1]
        },
        "2": {
          "pos": [-3, -1]
        }
      },
      "connections": [
        ["0", "1"]
      ]
    }

    console.log("*** BASE ACTUALS ***")
    console.log("Actual Viewport Dimensions: ", vpDim)
    console.log("Actual Viewport Position:   ", vpPos)
    console.log("Actual Total Dimensions:    ", totDim)

    //Scale factor
    const scaleFactor = getScaleFactor(vpDim, unitSize, zoom)

    console.log("*** ZOOM ACTUALS ***")
    console.log("Zoom:          ", zoom)
    console.log("Unit Size:     ", unitSize)
    console.log("Scale Factor:  ", scaleFactor)

    //Logical positions and dimensions of viewport and canvas
    const logVpPos = getLogicalViewportPosition(vpPos, scaleFactor)
    const logVpDim = getLogicalViewportDimensions(vpDim, scaleFactor)
    const logTotDim = getLogicalTotalDimensions(totDim, scaleFactor)

    console.log("*** BASE LOGICALS ***")
    console.log("Logical Viewport Dimensions: ", logVpDim)
    console.log("Logical Viewport Position:   ", logVpPos)
    console.log("Logical Total Dimensions:    ", logTotDim)

    //Logical positions of systems and connections
    const logVisSys = getLogicallyVisibleSystems(mapData, logVpPos, logVpDim, logTotDim)
    const logVisCons = getLogicallyVisibleConnections(mapData, logVisSys, logTotDim)

    console.log("*** MAP LOGICALS ***")
    console.log("Logically Visible Systems:       ", logVisSys)
    console.log("Logically Visible Connections:   ", logVisCons)

    //Relative positions of systems and connections
    const relSys = getRelativeSystemPositions(logVisSys, logVpPos, scaleFactor)
    const relCons = getRelativeConnectionPositions(logVisCons, logVpPos, scaleFactor)

    console.log("*** MAP RELATIVES ***")
    console.log("Relative System Positions:       ", relSys)
    console.log("Relative Connection Positions:   ", relCons)

    //Relative positions of system rectangles and connection lines
    const relSysRects = getRelativeSystemRectangles(relSys, unitSize)
    const relConLines = getRelativeConnectionLines(relCons)


    console.log("*** DRAWN RELATIVES ***")
    console.log("Relative System Rectangles:  ", relSysRects)
    console.log("Relative Connection Lines:   ", relConLines)

    //Drawing of system rectangles and connection lines
    drawMap(relSysRects, relConLines, context)

    /*

    //Our first draw
    context.fillStyle = '#0000ff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    */
  }, [props])
  

  function getScaleFactor(vpDim, unitSize, zoom){
    return Math.min(...vpDim) / (unitSize * zoom)
  }

 /*
    Logical Calculation Functions
 */

  function getLogicalViewportPosition(vpPos, scaleFactor){
    return [
      vpPos[0] / scaleFactor,
      vpPos[1] / scaleFactor
    ]
  }

  function getLogicalViewportDimensions(vpDim, scaleFactor){
    // return [
    //   (vpDim[0] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
    //   (vpDim[1] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
    // ]
    return [
      vpDim[0] / scaleFactor,
      vpDim[1] / scaleFactor
    ]
  }

  function getLogicalTotalDimensions(totDim, scaleFactor){
    return [
      totDim[0] / scaleFactor,
      totDim[1] / scaleFactor
    ]
  }

  function getLogicalPosition(pos, logTotDim){
    return [
      pos[0] + (logTotDim[0] / 2),
      pos[1] + (logTotDim[1] / 2),
    ]
  }

  function logicallyInsideViewport(logPos, logVpPos, logVpDim){
    return logPos[0] > logVpPos[0] && logPos[0] < (logVpPos[0]+ logVpDim[0]) &&
      logPos[1] > logVpPos[1] && logPos[1] < (logVpPos[1]+ logVpDim[0])
  }

  function getLogicallyVisibleSystems(mapData, logVpPos, logVpDim, logTotDim){
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

  function getLogicallyVisibleConnections(mapData, logVisSys, logTotDim){
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

  /*
    Relative Calculation Functions
  */

  function getRelativePosition(logPos, logVpPos, scaleFactor){
    return [
      (logPos[0] - logVpPos[0]) * scaleFactor,
      (logPos[1] - logVpPos[1]) * scaleFactor
    ]
  }

  function getRelativeSystemPositions(logVisSys, logVpPos, scaleFactor){
    return Object.keys(logVisSys).map(function(key){

      const relPos = getRelativePosition(logVisSys[key], logVpPos, scaleFactor)

      //console.log("Relative System Position:  ", relPos)

      return relPos
    })
  }

  function getRelativeConnectionPositions(logVisCons, logVpPos, scaleFactor){
    return logVisCons.map(function(con){
      return Object.keys(con).map(function(key){

        return getRelativePosition(con[key], logVpPos, scaleFactor)
      })
    })
  }

  function getRelativeSystemRectangles(relSys, unitSize){
    return Object.keys(relSys).reduce(function(previous, key){
      const relPos = relSys[key]

      previous[key] = {
        'x': relPos[0] - (unitSize /2),
        'y': relPos[1] - (unitSize /2),
        'w': unitSize,
        'h': unitSize
      }

      return previous
    }, {})
  }

  function getRelativeConnectionLines(relCons){
    return relCons.map(function(con){
      const relConPos = Object.values(con)

      return [
        {
          'x': relConPos[0][0],
          'y': relConPos[0][1]
        },
        {
          'x': relConPos[1][0],
          'y': relConPos[1][1]
        }
      ]
    })
  }

  /*
    Drawing Functions
  */

  function drawSystemRectangle(sysRect, context){
    //To do: handle colors and images
    context.fillStyle = '#0000ff'

    //console.log("Drawing Rect:  ", sysRect)

    context.fillRect(
      sysRect['x'],
      sysRect['y'],
      sysRect['w'],
      sysRect['h'],
    )
    //context.fillRect(100, 100, 50, 50)
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

  function drawMap(relSysRects, relConLines, context){
    relConLines.forEach(function(conLine){
      drawConnectionLine(conLine, context)
    })

    Object.keys(relSysRects).forEach(function(key){
      drawSystemRectangle(relSysRects[key], context)
    })
  }

  return <canvas 
    ref={canvasRef} 
    width="1000px"
    height="600px"
    {...props}
  />
}

export default Drawer