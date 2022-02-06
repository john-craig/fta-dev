import React from 'react'
import Drawer from './subcomponent/drawer'

import SystemIcon from "../../assets/images/solar-system.png"
import MapBackground from "../../assets/images/background.jpg"

export default class Canvas extends React.Component {
    ZOOM_INCREMENT = 0.1
    MAX_ZOOM_IN = 0.1
    MAX_ZOOM_OUT = 20

    constructor(props){
        super(props)

        this.state = {
            zoom: 1.0,
            viewportDimensions: [-1, -1],
            viewportOffset: [0, 0],
            targetSystem: undefined,
            selectionPosition: undefined,
            wasDragged: false,
            doubleClick: false
        }

        this.handleSysIconLoad = this.handleSysIconLoad.bind(this)
        this.handleMapBgLoad = this.handleMapBgLoad.bind(this)

        this.handleScroll = this.handleScroll.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this)
        this.handleMouseDoubleClick = this.handleMouseDoubleClick.bind(this);
        this.handleMouseMovement = this.handleMouseMovement.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.setTargetSystem = this.setTargetSystem.bind(this)
    }

    /* Component Mounting */

    async componentDidMount() {
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
      
    componentDidUpdate(prevProps){
        //If the focused system has either changed to another system, or if 
        //it has become defined where it wasn't before
        if(
            this.props['targetSystem'] && this.props['isZoomed'] &&
            (this.props['isZoomed'] != prevProps['isZoomed'] ||
            this.props['targetSystem'] != prevProps['targetSystem'])
        ){
            const targSys = this.props.mapData['systems'][this.props['targetSystem']]
            const vpOff = [0, 0]

            this.setState({
                targetSystem: targSys,
                selectionPosition: undefined,
                viewportOffset: vpOff,
                zoom: this.MAX_ZOOM_IN
            })
        }


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
        console.log("Window resize")
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

        if(event.deltaY < 1){
            newZoom = (newZoom > (this.MAX_ZOOM_IN + this.ZOOM_INCREMENT)) ? (newZoom - this.ZOOM_INCREMENT) : newZoom
        } else {
            newZoom += this.ZOOM_INCREMENT
        }

        //If we are zooming out after focusing on a system,
        //then we are no longer focused on it
        if(this.props.isZoomed && newZoom != this.state.zoom){
            this.props.unsetZoomedSystem();
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

    handleMouseDoubleClick(event){
        const xPos = event.pageX
        const yPos = event.pageY - this.getToolbarHeight()

        const selPos = [xPos, yPos]

        this.setState({
            selectionPosition: selPos,
            doubleClick: true
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

    handleKeyPress(event){
        //To-do: move map in response to keypress
    }

    /* Drawer Update Functions

    

    /* Drawer Callback Functions */
    
    //This handler is called by the drawer if it resolves
    //a mouse click to a target system
    setTargetSystem(targSysId){
        /*
            The zoomed system has the map zoomed in on it. A zoomed system is always focused, but a focused system
            is not always zoomed.
                - zoom is set or changed if a system is double-clicked
                - zoom is unset if the user scrolls outwards or drags away

            If the system is not focused, it is not zoomed.
        */
       /*
            The focused system has its information being currently displayed.
            - focus is set or changed if a system is clicked on
            - focus is unset if any other part of the screen is double-clicked
        */
        if(this.state.doubleClick){
            if(targSysId){
                console.log("A system was double-clicked")
                this.props.setZoomedSystem(targSysId)
            } else {
                console.log("Somewhere else on the map was double-clicked")
                this.props.unsetFocusedSystem()
            }

            this.setState({
                doubleClick: false
            })
        } else {
            if(targSysId){
                console.log("A system was single-clicked")
                this.props.setFocusedSystem(targSysId)
            } else {
                console.log("Somewhere else on the map was single-clicked")
            }
        }
    }


    render(){
        const zoom = this.state['zoom']
        const vpDim = this.state['viewportDimensions']
        const vpOff = this.state['viewportOffset']
        const selectionPosition = this.state['selectionPosition']

        const sysIcon = this.state['sysIcon']
        const mapBg = this.state['mapBackground']

        const mapData = this.props.mapData
        const targSys = this.state.targetSystem

        return <div
            onWheel={this.handleScroll}
            //onMouseDown={this.handleMouseButtonDown}
            onClick={this.handleMouseClick}
            onDoubleClick={this.handleMouseDoubleClick}
            onMouseMove={this.handleMouseMovement}
            onKeyPress={this.handleKeyPress}
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