import Autocomplete from '@material-ui/lab/Autocomplete';
import Popper from '@material-ui/core/Popper';
import styled from "styled-components";
import { TextField, MenuItem } from '@material-ui/core';

export const DropdownComponent = styled(Autocomplete)`
    position: absolute;
    left: 1vw;
    top: 10vh;
    width: 250px;
    background-color: rgba(85,156,214,0.5);
    box-shadow: 2px 2px blue;
`;

export const DropdownField = styled(TextField)`
    background-color: rgba(85,156,214,0.5);
    color: black;
    padding: 5px;
`

export const DropdownItem = styled(MenuItem)`
    width: 100%;
    background-color: rgba(85,156,214,0.5);
    color: black;
`