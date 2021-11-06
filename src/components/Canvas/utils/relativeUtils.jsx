//Accepts a position relative to the upper left-hand corner of the
//map which is in terms of unitSizes, and returns a position
//relative to the upper-left hand corner of the viewport
//in terms of pixels.
function getRelativePosition(logPos, logVpPos, scaleFactor){
    return [
      (logPos[0] - logVpPos[0]) * scaleFactor,
      (logPos[1] - logVpPos[1]) * scaleFactor
    ]
  }

//Returns an object containing the ID's of visible systems as the keys
//and the relative positions of each system as the values. See above for
//explanation of relative position.
export function getRelativeSystemPositions(logVisSys, logVpPos, scaleFactor){
    return Object.keys(logVisSys).reduce(function(previous, key){
      const relPos = getRelativePosition(logVisSys[key], logVpPos, scaleFactor)

      previous[key] = relPos

      return previous
    }, {})
  }

//Returns an array containing the relative positions of both systems in
//each visible connection. See above for explanation of relative system.
export function getRelativeConnectionPositions(logVisCons, logVpPos, scaleFactor){
    return logVisCons.map(function(con){
      return Object.keys(con).map(function(key){

        return getRelativePosition(con[key], logVpPos, scaleFactor)
      })
    })
  }

//Returns an object containing the ID's of visible systems as the keys
//and sub-objects as the values. These sub-objects have the x,y and height
//and width of the system mapped to corresponding values.
export function getRelativeSystemRectangles(relSys, unitSize){
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

//You get it now hopefully.
export function getRelativeConnectionLines(relCons){
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
