import React from "react";

import { MainContainer } from "./styles";
import Canvas from "../../components/Canvas";

const systems = [
  {x: 1, y: 2},
  {x: 2, y: 1}
]

const Map = () => {
  return (
    <MainContainer>
      <Canvas
        systems={systems}
      />
    </MainContainer>
  );
};

export default Map;
