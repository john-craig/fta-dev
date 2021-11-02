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

const Canvas = props => {
  const unitSize = 50
  const zoom = 1.0

  /* These should be passed in as props */
  var vpDim = []
  var vpPos = []
  var totDim = []
  var mapData = []

  /* Working variables */
  var scaleFactor
  var logVpPos

  //const []
  const canvasRef = useRef(null)


  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    vpDim = [
      context.canvas.width, 
      context.canvas.height
    ]

    //Temporary
    totDim = [
      vpDim[0] * 10,
      vpDim[1] * 10,
    ]
    
    //Temporary
    vpPos = [
      (totDim[0] + vpDim[0]) / 2,
      (totDim[1] + vpDim[1]) / 2,
    ]

    mapData = {
      "systems": {
        "0": {
          "pos": [0, 0]
        }
      },
      "connections": []
    }

    scaleFactor = getScaleFactor()

    /*

    //Our first draw
    context.fillStyle = '#0000ff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    */
  }, [])
  

  function getScaleFactor(){
    return Math.min(...vpDim) / (unitSize * zoom)
  }


  function getLogicalViewportPosition(vpPos, scaleFactor){
    return [
      vpPos[0] / scaleFactor,
      vpPos[1] / scaleFactor
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

  function getLogicalViewportDimensions(vpDim, zoom){
    return [
      (vpDim[0] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
      (vpDim[1] == Math.min(...vpDim)) ? zoom : (Math.max(...vpDim) / Math.min(...vpDim)) * zoom,
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

      return logicallyInsideViewport(logPos, logVpPos, logVpDim) ? previous[key] = logPos : previous
    }, {});
  }

  function getLogicallyVisibleConnections(mapData, logVisSys, logTotDim){
    const connections = mapData['connections']
    const systems = mapData['systems']

    return connections.reduce(function(previous, con){
      const conIdA = con[0]
      const conIdB = con[1]

      return (
        conIdA in logVisSys || conIdB in logVisSys
      ) ? previous + {
        conIdA: (conIdA in logVisSys) ? logVisSys[conIdA] : getLogicalPosition(systems[conIdA], logTotDim),
        conIdB: (conIdB in logVisSys) ? logVisSys[conIdB] : getLogicalPosition(systems[conIdB], logTotDim)
      } : previous
    }, [])
  }

  function getRelativePosition(logPos, logVpPos, scaleFactor){
    return [
      (logPos[0] - logVpPos[0]) * scaleFactor,
      (logPos[1] - logVpPos[1]) * scaleFactor,
    ]
  }

  function getRelativeSystemPositions(logVisSys, logVpPos, scaleFactor){
    return Object.keys(logVisSys).map(function(key){
      return getRelativePosition(logVisSys[key], logVpPos, scaleFactor)
    })
  }

  function getRelativeConnectionPositions(logVisCons, relSys, logVpPos, scaleFactor){
    return logVisCons.map(function(con){
      ret
    })
  }

  function getRelativeSystemRectangle(relPos, unitSize){
    return {
      'x': relPos[0] - (unitSize /2),
      'x': relPos[1] - (unitSize /2),
      'w': unitSize,
      'h': unitSize
    }
  }

  function getRelativeConnectionLine(relPosA, relPosB){
    return [
      {
        'x': relPosA[0],
        'y': relPosA[1]
      },
      {
        'x': relPosB[0],
        'y': relPosB[1]
      }
    ]
  }

  function drawSystemRectangle(sysRect, context){
    //To do: handle colors and images
    context.fillStyle = '#0000ff'

    context.fillRect(
      sysRect['x'],
      sysRect['y'],
      sysRect['w'],
      sysRect['h'],
    )
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
    context.fill();
  }

  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas