# Reference

## Props and Variables

### vpDim
Suppose you are using a phone with a screen that
has dimensions 1024 x 600 pixels. This means *vpDim* would be
set to [600, 1024].

### unitSize
Now maybe you want stars to be drawn 50 x 50 pixels, so you
set *unitSize* to 50.

### zoom
Last let's say our zoom is 1.00.

### scaleFactor
This means the viewport of the canvas will be "zoomed in" to the
point where one unit takes up as much of the canvas as can be fit.
We know that our viewport is taller than it is wide, so we will
use its smaller dimension for calculations.

This means we want to represent 50 x 50 pixels as 600 x 600
pixels. In other words we are multiplying the dimensions of 
everything being draw by a scaleFactor of 12.

Thus,

    scaleFactor = min(vpDim) / unitSize

Now let's consider a different zoom, like 2.00. At this level of zoom
we would want to display two units in the viewPort. That is, we want
to represent 100 x 100 pixels as 600 x 600 pixels, resulting in a 
scaleFactor of 6. This means we can add zoom to our equation as:

    scaleFactor = min(vpDim) / (unitSize * zoom)

Okay, so we've now dealt with the *vpDim*, *unitSize*, and *zoom* props.
Next let's look at *totDim*, *vpPos* and *mapData*. 

### vpPos
This is sort of an ephemeral prop, because we want to quickly convert it from pixels
into units to facilitate later calculations. To accomplish this we just need to divide
by the *scaleFactor* and we get the "logical" viewport position:

    logVpPos[0] = vpPos[0] / scaleFactor
    logVpPos[1] = vpPos[1] / scaleFactor

### totDim
We will then do the same thing with the *totDim* variable, however, for reason that will
be explored below, it is possible we will want to override this value ourselves,

    logTotDim[0] = totDim[0] / scaleFactor
    logTotDim[1] = totDim[1] / scaleFactor

### mapData
The systems are stored in the *mapData* variable. For now this is a JSON object
containing two keys "systems" and "connections", which are mapped to another
object and an array, respectively.

The object mapped to the "systems" key takes the following form:

    {
        "id1": {
                "xPos": signed int
                "yPos": signed int,
                ...
            },
        "id2": {
                "xPos": signed int
                "yPos": signed int,
                ...
            },
        ...
    }

While each element of the "connections" array should contain a JSON object taking
the form,

    {
        "idA": unsigned int,
        "idB": unsigned int
    }

## Determining which Systems to Draw
Let's tackle the systems first. As you can see, their positions are unsigned integers.
This means that a system can be placed at an arbitarily positive or negative position
on the X or Y axis, using the center of the map as the origin.

If one of the systems is positioned in such as way that it would be outside of the
bounds of the *logTotDim* then *logTotDim* must simply be expanded to account for this.
Arguably this makes *totDim* an unnecessary input but I'll deal with that later.

This condition works out to be somewhat complicated, so let's start out with a few
helper terms to simplify:

    logXPos = xPos + (logTotDim[0] / 2)
    logYPos = yPos + (logTotDim[1] / 2)

These are just used to shift the coordinates of a given system so that they are 
in terms of offset from the upper-left corner rather than from the origin,
and incidentally so that they are all positive numbers. In short, the "logical"
positions of the systems.

    logVpW = zoom if (vpDim[0] == min(vpDim)) else zoom * (max(vpDim) / min(vpDim))
    logVpH = zoom if (vpDim[1] == min(vpDim)) else zoom * (max(vpDim) / min(vpDim))

These are the "logical" height and width of the viewport, or the viewport in terms
of displayed units. Remember the *zoom* prop determines how many units we want to
display on the viewport in its minimum dimension. So we have a little bit of inline
if-statement trickery to determine which dimension is actually the minimum, and for
the larger dimension we multiply *zoom* by the ratio of the dimensions.  

So for our final condition we get:

    logXPos > logVpPos[0] && logXPos < logVpPos[0] + logVpW &&
    logYPos > logVpPos[1] && logYPos < logVpPos[1] + logVpH

Which simply determines if the logical position of the system falls within the 
logical bounds of the viewport.

Now we have the list of systems we want to draw. The next thing is to handle the
connections we need to draw. This is, comparatively, very easy. We just take our
list of systems that need drawing and see if their *id*'s show up anywhere in the
connections list.

A simple condition like,

    id == idA || id == idB

will do the trick.

## Actually Drawing the Map
At this point we know the systems and connections which need to be drawn, now
we just go about the process of drawing them.

For each system we want to determine what its position is relative to the upper
left corner of the viewport. This looks like the following:

    relXPos = (xPos + (logTotDim[0] / 2) - logVpPos[0]) * scaleFactor
    relYPos = (yPos + (logTotDim[1] / 2) - logVpPos[1]) * scaleFactor

or to reuse some previous terms,

    relXPos = (logXPos - logVpPos[0]) * scaleFactor
    relYPos = (logYPos - logVpPos[1]) * scaleFactor

Now, technically these give us the **center** of the system. When we actually
go to draw each system, we want to draw a rectangle like so:

    Rectangle(
        x = relXPos - (unitSize / 2),
        y = relYPos - (unitSize / 2),
        w = unitSize,
        h = unitSize
    )

Now this leaves the connections. These will just be straight lines which connect
the systems. If a system is not visible , we just draw a line leading outside of
the viewport.

For these we can just calculate the relative positions of either end of the connection
and draw a line between them.
    relXPosA = (xPosA + (logTotDim[0] / 2) - logVpPos[0]) * scaleFactor
    relYPosA = (yPosA + (logTotDim[1] / 2) - logVpPos[1]) * scaleFactor
    relXPosB = (xPosB + (logTotDim[0] / 2) - logVpPos[0]) * scaleFactor
    relYPosB = (yPosb + (logTotDim[1] / 2) - logVpPos[1]) * scaleFactor

    Line(
        pointAX = relXPosA
        pointAY = relYPosA
        pointBX = relXPosB
        pointBY = relYPosB
    )

Canvas can handle it if we end up drawing a line which is actually outside of
the canvas so that isn't a big issue.

## Map Interactions
Okay so for this we have to implement collision detection which shouldn't be
that hard, hold on...

### Selecting a System
When a mouse click occurs it will register the (x,y) position of the click. So
we can compare this against the rectangles that we used to draw each of the 
systems. The condition looks like this:

    mousePosX > (relXPos - (unitSize / 2)) && 
    mousePosX < (relXPos - (unitSize / 2) + unitSize) &&
    mousePosY > (relYPos - (unitSize / 2)) && 
    mousePosY < (relYPos - (unitSize / 2) + unitSize)

## Map Transformations
We also want users to be able to interact with the map, with two primary
functions: zooming in and out, and scrolling.

### Zooming
This is pretty simple. We just increase and decrease the value of the *zoom*
prop.

### Scrolling
Also pretty simple, just adjust the *vpPos* values as a user drags the mouse.

### Setting Position
Now we may also want to suddenly jump 