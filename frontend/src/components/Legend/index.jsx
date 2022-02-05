import React from 'react'

import {
    LegendPaper
} from "./styles";

export default class Legend extends React.Component {
    
    constructor(props){
        super(props)
    }

    render(){
        const name = this.props.name;
        const desc = this.props.desc;

        return <div
            style={{
                "position": "absolute",
                "left": "70vw",
                "top": "10vh",
                "width": "25vw",
                "height": "80vh",
                "backgroundColor": "rgba(85,156,214,0.5)",
                "borderStyle": "solid",
                "borderWidth": "2px",
                "borderColor": "blue",
                "borderRadius": "25px",
                "padding": "15px"
            }}
        >
            <h1>{name}</h1>
            {desc}
        </div>
    }
}