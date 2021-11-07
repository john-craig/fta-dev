import React from 'react'
import Drawer from './subcomponent/drawer'

import SystemIcon from "../../assets/images/solar-system.png"
import MapBackground from "../../assets/images/background.jpg"

export default class Canvas extends React.Component {

    constructor(props){
        super(props)

        //Placeholder
        const mapData = {
            "systems": {
              "0": {
                "pos": [0, 0],
                "name": "Sol"
              },
              "1": {
                "pos": [2, 1],
                "name": "Mu Herculis"
              },
              "2": {
                "pos": [-3, -1],
                "name": "Alpha Centauri"
              },
              "3": {
                "pos": [-6, 2],
                "name": "Wolf 359"
              },
              "4": {
                "pos": [4, -3],
                "name": "Sirius"
              },
              "5": {
                "pos": [6, -3],
                "name": "Lambda Serpentis"
              },
              "6": {
                "pos": [-9, -3],
                "name": "Lalande 21185"
              },
              "7": {
                "pos": [22, 5],
                "name": "Achelinde"
              }
            },
            "connections": [
              ["0", "1"],
              ["3", "6"],
              ["1", "3"],
              ["1", "4"],
              ["5", "4"],
              ["3", "2"],
              ["1", "7"]
            ]
          }

        this.state = {
            zoom: 1.0,
            viewportDimensions: [-1, -1],
            viewportOffset: [0, 0],
            mapData: mapData,
            targetSystem: undefined,
            selectionPosition: undefined,
            wasDragged: false
        }

        this.handleSysIconLoad = this.handleSysIconLoad.bind(this)
        this.handleMapBgLoad = this.handleMapBgLoad.bind(this)

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

        //Load System Icon
        const sysIconImg = new Image()
        sysIconImg.src = SystemIcon
        sysIconImg.onload = this.handleSysIconLoad

        //Load Map Background
        const mapBgImg = new Image()
        mapBgImg.src = MapBackground
        mapBgImg.onload = this.handleMapBgLoad
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

    handleMapBgLoad(event){
        const mapBg = event.target

        this.setState({
            mapBackground: mapBg
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
        if(!this.state.wasDragged){
            console.log("Clicking mouse...")
            const xPos = event.pageX
            const yPos = event.pageY - this.getToolbarHeight()

            const selPos = [xPos, yPos]

            this.setState({
                selectionPosition: selPos
            })
        } else {
            this.setState({
                wasDragged: false
            })
        }
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
        const mapBg = this.state['mapBackground']

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
            (mapBg) &&
            <Drawer
                zoom={zoom}
                vpDim={vpDim}
                vpOff={vpOff}
                mapData={mapData}
                targSys={targSys}

                selPos={selectionPosition}
                setTargSys={this.setTargetSystem}

                sysIcon={sysIcon}
                mapBg={mapBg}
            />
        }
        </div>
    }

}