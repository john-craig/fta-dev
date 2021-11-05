import React from 'react'
import Drawer from './subcomponent/drawer'

export default class Canvas extends React.Component {

    constructor(props){
        super(props)

        //Placeholder
        const mapData = {
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

        this.state = {
            zoom: 1.0,
            viewportDimensions: [-1, -1],
            viewportOffset: [0, 0],
            mapData: mapData,
            targetSystem: undefined,
            selectionPosition: undefined
        }

        this.handleScroll = this.handleScroll.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    /* Component Mounting */

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    /* Window Event Handler */

    //Used to determine the size of the screen, AKA the viewport dimensions
    updateWindowDimensions() {
        const toolBarHeight = 70 //Constant taken from inspector tool

        const windowWidth = window.innerWidth
        const windowHeight = (window.innerHeight - toolBarHeight)

        this.setState({ 
            viewportDimensions: [windowWidth, windowHeight]
        });
    }
    
    /* User Interaction Handler */

    //Used to handle mouse scrolls, which zoom the map in and out
    handleScroll(event){
        event.preventDefault()
        var newZoom = this.state['zoom']

        if(event.deltaY > 1){
            newZoom -= 0.1
        } else {
            newZoom += 0.1
        }

        this.setState({
            zoom: newZoom
        }, console.log(this.state))
    }

    //Used to determine whether the mouse is being dragged
    handleMouseButtonDown(event){

    }

    //Used to determine whether the mouse is being dragged,
    //and also handles mouse click completion, which is used
    //to open sidebar info about a system
    handleMouseButtonUp(event){

    }

    //Used to handle a mouse drag event, which will move/translate
    //the map's viewport
    handleMouseMovement(){

    }

    /* Drawer Callback Functions */
    
    //This handler is called by the drawer if it resolves
    //a mouse click to a target system
    setTargetSystem(targetSystem){

    }


    render(){
        const zoom = this.state['zoom']
        const vpDim = this.state['viewportDimensions']
        const mapData = this.state['mapData']

        return <div
            onWheel={this.handleScroll}
            width="100%"
            height="100%"
        > {
            (vpDim[0] != -1) &&
            <Drawer
                zoom={zoom}
                vpDim={vpDim}
                mapData={mapData}
            />
        }
        </div>
    }


}