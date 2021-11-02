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
  const canvasRef = useRef(null)
  

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    //Our first draw
    context.fillStyle = '#0000ff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    console.log(props['systems'])
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas