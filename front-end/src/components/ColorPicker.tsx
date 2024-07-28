import { colors, ColorsType, RGB } from "../helpers/consts";

interface ColorPickerProps {
  color: ColorsType;
  changeColor: (color: ColorsType) => void;
}

const borderSize = {
  height: 2,
  width: 2,
};

const rectSize = {
  height: 25,
  width: 25,
};

const colorPickerMargins = {
  top: 25,
  left: 30,
};

export function ColorPicker(props: ColorPickerProps) {
  function colorClickHandler(color: ColorsType) {
    props.changeColor(color);
  }

  return (
    <div
      style={{
        marginTop: colorPickerMargins.top,
        marginLeft: colorPickerMargins.left,
      }}
    >
      {Object.keys(colors).map((key) => {
        return (
          <div
            key={key}
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                borderWidth: borderSize.height,
                borderStyle: "solid",
                borderColor: new RGB(100, 100, 100).css,
                width: rectSize.width - borderSize.width * 2,
                height: rectSize.height - borderSize.height * 2,
                marginTop: 10,
                backgroundColor: colors[key as keyof typeof colors].css,
                cursor: "pointer",
              }}
              title={key}
              onClick={() =>
                colorClickHandler(colors[key as keyof typeof colors])
              }
            ></div>
            {colors[key as keyof typeof colors] === props.color ? (
              <p
                style={{
                  margin: 0,
                  marginTop: rectSize.height / 2 + 1,
                  marginLeft: 5,
                }}
              >
                &lt;
              </p>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
}
