import Bar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import styled from "styled-components";

export const AppBarStyle = styled(Bar)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const ToolbarStyle = styled(Toolbar)`
  flex-wrap: wrap;
`;

export const ToolbarTitleStyle = styled(Typography)`
  flex-grow: 1;
`;

export const LinkStyle = styled(Link)`
  margin: ${({ theme }) => theme.spacing(1, 1.5)};
`;
