import { useState } from "react";
import Canvas from "./Canvas";
import { ColorPicker } from "./ColorPicker";
import { colors, ColorsType } from "../helpers/consts";

export function ColorProvider() {
  const [currentColor, setCurrentColor] = useState<ColorsType>(colors.black);

  function changeColor(color: ColorsType) {
    setCurrentColor(color);
  }

  return (
    <>
      <Canvas color={currentColor} />
      <ColorPicker color={currentColor} changeColor={changeColor} />
    </>
  );
}
