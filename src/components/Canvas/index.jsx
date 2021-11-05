import React from 'react'
import Drawer from './subcomponent/drawer'

export default class Canvas extends React.Component {

    constructor(props){
        super(props)


        this.state = {
            zoom: 1.0
        }

        this.handleScroll = this.handleScroll.bind(this)
    }

    handleScroll(event){
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

    render(){
        const zoom = this.state['zoom']

        return <div
            onWheel={this.handleScroll}
        >
            <Drawer
                zoom={zoom}
            />
        </div>
    }


}