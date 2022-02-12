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

        return <LegendPaper
            elevation={3}
        >
            "FAS"
        </LegendPaper>
    }
}