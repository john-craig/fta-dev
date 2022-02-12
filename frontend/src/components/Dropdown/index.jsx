import React from 'react'
import { TextField } from '@material-ui/core';
import {
    DropdownComponent, DropdownField, DropdownItem
} from "./styles";

export default class Dropdown extends React.Component {
    
    constructor(props){
        super(props)

        this.handleSelect = this.handleSelect.bind(this)
    }

    handleSelect(event, value, reason){
        if(reason == "select-option"){
            this.props.setZoomedSystem(value['id'])
        }
    }

    render(){
        const items = Object.keys(this.props.mapData['systems']).map(sysId => {
            return {
                'label': this.props.mapData['systems'][sysId]['name'],
                'id': sysId
            }
        })

        return <DropdownComponent
            autoComplete
            autoSelect
            openOnFocus
            options={items}
            onChange={this.handleSelect}
            renderInput={(params) => <DropdownField {...params} label="System" />}
            getOptionLabel={(option) => option.label}
            renderOption={
                (option, props) => {
                    return <DropdownItem>{option['label']}</DropdownItem>
                }
            }
        />
    }
}