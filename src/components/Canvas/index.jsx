import React from 'react'
import Drawer from './subcomponent/drawer'

import SystemIcon from "../../assets/images/solar-system.png"

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

        this.handleSysIconLoad = this.handleSysIconLoad.bind(this)
        
        this.handleScroll = this.handleScroll.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this)
        this.handleMouseMovement = this.handleMouseMovement.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.setTargetSystem = this.setTargetSystem.bind(this)
    }

    /* Component Mounting */

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        const sysIconImg = new Image()
        sysIconImg.src = SystemIcon

        sysIconImg.onload = this.handleSysIconLoad
      }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    /* Constant methods */
    getToolbarHeight(){
        return 0
        //return 46 //Constant taken from inspector tool
    }

    /* Image Loading */
    handleSysIconLoad(event){
        const sysIcon = event.target

        this.setState({
            sysIcon: sysIcon
        })
    }

    /* Window Event Handler */

    //Used to determine the size of the screen, AKA the viewport dimensions
    updateWindowDimensions() {
        const toolBarHeight = this.getToolbarHeight()

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
            newZoom = (newZoom > 0.25) ? (newZoom - 0.1) : newZoom
        } else {
            newZoom += 0.1
        }

        this.setState({
            zoom: newZoom
        })
    }

    //Used to determine whether a click collided with a system
    handleMouseClick(event){
        console.log("Clicking mouse...")
        const xPos = event.pageX
        const yPos = event.pageY - this.getToolbarHeight()

        const selPos = [xPos, yPos]

        this.setState({
            selectionPosition: selPos
        })
    }

    //Used to handle a mouse drag event, which will move/translate
    //the map's viewport
    handleMouseMovement(event){
        //We only care about mouse movements if the mouse
        //is being dragged
        if(event.buttons == 1){
            const offset = [
                this.state.viewportOffset[0] - event.movementX,
                this.state.viewportOffset[1] - event.movementY,
            ]

            this.setState({
                wasDragged: true,
                viewportOffset: offset
            })

            console.log("Dragging mouse...")
        }
    }

    /* Drawer Callback Functions */
    
    //This handler is called by the drawer if it resolves
    //a mouse click to a target system
    setTargetSystem(targSysId){
        const targetSystem = (targSysId) ? 
            this.state.mapData['systems'][targSysId] : 
            undefined

        const vpOff = (targSysId) ? [0, 0] : this.state.viewportOffset

        this.setState({
            targetSystem: targetSystem,
            selectionPosition: undefined,
            viewportOffset: vpOff
        })
    }


    render(){
        const zoom = this.state['zoom']
        const vpDim = this.state['viewportDimensions']
        const vpOff = this.state['viewportOffset']
        const mapData = this.state['mapData']
        const targSys = this.state['targetSystem']
        const selectionPosition = this.state['selectionPosition']
        const sysIcon = this.state['sysIcon']

        return <div
            onWheel={this.handleScroll}
            onMouseDown={this.handleMouseButtonDown}
            onClick={this.handleMouseClick}
            onMouseMove={this.handleMouseMovement}
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                top: 0,
                left: 0
            }}
        > {
            (vpDim[0] != -1) &&
            (sysIcon) &&
            <Drawer
                zoom={zoom}
                vpDim={vpDim}
                vpOff={vpOff}
                mapData={mapData}
                targSys={targSys}

                selPos={selectionPosition}
                setTargSys={this.setTargetSystem}

                sysIcon={sysIcon}
            />
        }
        </div>
    }

}