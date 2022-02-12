import React from "react";
//import GoogleSheetsData from "google-sheets-data";
import PublicGoogleSheetsParser from 'public-google-sheets-parser'

import { MainContainer } from "./styles";
import Canvas from "../../components/Canvas";
import Closeup from "../../components/Closeup";
import Legend from "../../components/Legend";

import Background from "../../assets/images/background.jpg"

export default class Map extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      isFocused: false,
      mapState: "full",
      targetSystem: undefined
    }

    this.setMapState = this.setMapState.bind(this);
    this.setFocusedSystem = this.setFocusedSystem.bind(this);
    this.unsetFocusedSystem = this.unsetFocusedSystem.bind(this);
    this.setZoomedSystem = this.setZoomedSystem.bind(this);
    this.unsetZoomedSystem = this.unsetZoomedSystem.bind(this);
  }

  async componentDidMount(){
    const mapData = await this.getMapData();
    //console.log(mapData)

    this.setState({
      mapData: mapData
    })
  }


  async getMapData(){
    const mapData = {'systems': {}, 'connections': []}
    const sheetId = "19AejpZTl2aPQqSjkmGejyIplYPKFgwH7CLnTNplUQZ0"
  
    const parser = new PublicGoogleSheetsParser(sheetId)
    
    const systemData = await parser.parse(sheetId, "Systems")
    const connectionData = await parser.parse(sheetId, "Connections")
  
    //Convert sheet data
    systemData.forEach(function(elem, index){
      mapData['systems'][index.toString()] = {
        "name": elem["Name"],
        "pos": [
          parseInt(elem["Position"].split(',')[0]),
          parseInt(elem["Position"].split(',')[1])
        ],
        "desc": elem['Description']
      }
    });
  
    connectionData.forEach(function(elem){
      mapData['connections'].push([
        systemData.map(function(e) { return e['Name']; }).indexOf(elem['Start']),
        systemData.map(function(e) { return e['Name']; }).indexOf(elem['End']),
      ])
    })
  
    return mapData
  }

  setMapState(state){
    console.log(state)

    this.setState({
      mapState: state
    })
  }

  //Focused System:
  /*
    The focused system has its information being currently displayed.
     - focus is set or changed if a system is clicked on
     - focus is unset if any other part of the screen is double-clicked
  */
  setFocusedSystem(sysId){
    this.setState({
      isFocused: true,
      targetSystem: sysId
    })
  }

  unsetFocusedSystem(){
    this.setState({
      isFocused: false,
      mapState: "shiftIn",
      targetSystem: undefined
    })
  }

  //Zoomed System
  /*
    The zoomed system has the map zoomed in on it. A zoomed system is always focused, but a focused system
    is not always zoomed.
     - zoom is set or changed if a system is double-clicked
     - zoom is unset if the user scrolls outwards or drags away
    
    If the system is not focused, it is not zoomed.
  */
  setZoomedSystem(sysId){
    this.setState({
      isFocused: true,
      mapState: "shiftIn",
      targetSystem: sysId
    })
  }

  unsetZoomedSystem(){
    console.log("Zooming out from close up")
    this.setState({
      mapState: "shiftOut"
    })
  }

  render(){
    const mapData = this.state.mapData;
    const isFocused = this.state.isFocused
    const mapState = this.state.mapState
    const targetSystem = this.state.targetSystem;

    return (
      <MainContainer>
        { mapData &&
          <div
            className="background"
          >
              <Closeup 
                mapState={mapState}
                setMapState={this.setMapState}
                unsetZoomedSystem={this.unsetZoomedSystem}
              /> 
              <Canvas
                mapData={mapData}
                isZoomed={false}
                mapState={mapState}
                targetSystem={targetSystem}

                setMapState={this.setMapState}
                setFocusedSystem={this.setFocusedSystem}
                unsetFocusedSystem={this.unsetFocusedSystem}
                setZoomedSystem={this.setZoomedSystem}
                unsetZoomedSystem={this.unsetZoomedSystem}
              />
            {/* { (mapState=="close" || mapState=="shiftIn" || mapState == "shiftOut") &&
              <Closeup 
                mapState={mapState}
                setMapState={this.setMapState}
                unsetZoomedSystem={this.unsetZoomedSystem}
              /> 
            }
            { (mapState=="full" || mapState=="shiftIn" || mapState == "shiftOut") &&
              <Canvas
                mapData={mapData}
                isZoomed={false}
                mapState={mapState}
                targetSystem={targetSystem}

                setMapState={this.setMapState}
                setFocusedSystem={this.setFocusedSystem}
                unsetFocusedSystem={this.unsetFocusedSystem}
                setZoomedSystem={this.setZoomedSystem}
                unsetZoomedSystem={this.unsetZoomedSystem}
              />
            } */}
          { isFocused &&
            <Legend
              name={mapData['systems'][targetSystem]['name']}
              desc={mapData['systems'][targetSystem]['desc']}
            />
          }
          </div>
        }
      </MainContainer>
    );
  }

};

//export default Map;
