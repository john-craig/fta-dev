import React from 'react'
import Drawer from './subcomponent/drawer'

import SystemIcon from "../../assets/images/solar-system.png"
import MapBackground from "../../assets/images/background.jpg"
import ShipImg1 from "../../assets/ships/ship1.png"
import ShipImg2 from "../../assets/ships/ship2.png"
import ShipImg3 from "../../assets/ships/ship3.png"
import ShipImg4 from "../../assets/ships/ship4.png"
import ShipImg5 from "../../assets/ships/ship5.png"
import ShipImg6 from "../../assets/ships/ship6.png"
import ShipImg7 from "../../assets/ships/ship7.png"
import ShipImg8 from "../../assets/ships/ship8.png"
import ShipImg9 from "../../assets/ships/ship9.png"
import ShipImg10 from "../../assets/ships/ship10.png"
import ShipImg11 from "../../assets/ships/ship11.png"
import ShipImg12 from "../../assets/ships/ship12.png"
import ShipImg13 from "../../assets/ships/ship13.png"
import ShipImg14 from "../../assets/ships/ship14.png"
import ShipImg15 from "../../assets/ships/ship15.png"
import ShipImg16 from "../../assets/ships/ship16.png"
import ShipImg17 from "../../assets/ships/ship17.png"
import ShipImg18 from "../../assets/ships/ship18.png"
import ShipImg19 from "../../assets/ships/ship19.png"
import ShipImg20 from "../../assets/ships/ship20.png"
import ShipImg21 from "../../assets/ships/ship21.png"

export default class Closeup extends React.Component {

    constructor(props){
        super(props)

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight


        const sysData = {
            'star': {
                'size': "medium"
            },
            'planets': [
                {
                    'size': "medium",
                    'distance': 8,
                    'angle': 45
                }
            ],
            'fleets': [
                {
                    'distance': 10,
                    'angle': -90,
                    'color': "#FF00FF",
                    'number': 3
                }
            ]
        }

        this.state = {
            viewportDimensions: [windowWidth, windowHeight],
            selectionPosition: undefined,
            sysData: sysData,
            shipImgs: []
        }
        
        this.handleMapBgLoad = this.handleMapBgLoad.bind(this)
        this.handleShipImgLoad = this.handleShipImgLoad.bind(this)

        this.handleScroll = this.handleScroll.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    /* Component Mounting */

    async componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //Load Map Background
        const mapBgImg = new Image()
        mapBgImg.src = MapBackground
        mapBgImg.onload = this.handleMapBgLoad

        const shipImgs = [
            ShipImg1, ShipImg2, ShipImg3, ShipImg4, ShipImg5, ShipImg6, ShipImg7, ShipImg8, ShipImg9, ShipImg10,
            ShipImg11, ShipImg12, ShipImg13, ShipImg14, ShipImg15, ShipImg16, ShipImg17, ShipImg18, ShipImg19,
            ShipImg20, ShipImg21
        ]

        shipImgs.forEach(img => {
            const shipImg = new Image()
            shipImg.src = img
            shipImg.onload = this.handleShipImgLoad
        })
    }
      
    componentDidUpdate(prevProps){

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    /* Image Loading */

    handleMapBgLoad(event){
        const mapBg = event.target

        this.setState({
            mapBackground: mapBg
        })
    }

    handleShipImgLoad(event){
        const shipImg = event.target
        const shipImgs = this.state.shipImgs

        shipImgs.push(shipImg)
        this.setState({
            shipImgs: shipImgs
        })
    }

    /* Window Event Handler */

    //Used to determine the size of the screen, AKA the viewport dimensions
    updateWindowDimensions() {
        console.log("Window resize")

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        this.setState({ 
            viewportDimensions: [windowWidth, windowHeight]
        });
    }
    
    /* User Interaction Handler */

    //Used to handle mouse scrolls, which zoom the map in and out
    handleScroll(event){
        event.preventDefault()
    }

    //Used to determine whether a click collided with a system
    handleMouseClick(event){

    }

    /* Drawer Update Functions

    

    /* Drawer Callback Functions */
    
    //This handler is called by the drawer if it resolves
    //a mouse click to a target system
    setTargetSystem(targSysId){
        
    }


    render(){
        const selectionPosition = this.state['selectionPosition']
        const vpDim = this.state['viewportDimensions']

        //const sysIcon = this.state['sysIcon']
        const mapBg = this.state['mapBackground']
        const shipImgs = this.state['shipImgs']

        const sysData = this.state['sysData']

        return <div
            onWheel={this.handleScroll}
            onClick={this.handleMouseClick}
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                top: 0,
                left: 0
            }}
        > {
            (vpDim[0] != -1) &&
            (mapBg) &&
            (shipImgs.length > 7) &&
            <Drawer
                selPos={selectionPosition}
                setTargSys={this.setTargetSystem}
                vpDim={vpDim}

                sysData={sysData}
                
                mapBg={mapBg}
                shipImgs={shipImgs}
            />
        }
        </div>
    }

}