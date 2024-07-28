import { useEffect, useRef, useState } from "react";
import { ColorsType, RGB } from "../helpers/consts";
import {
  CanvasType,
  ChangesType,
  getInitialCanvasState,
  postSetPixels,
} from "../helpers/queries";

interface CanvasProps {
  color: ColorsType;
}

const rectSize = {
  height: 10,
  width: 10,
};

const borderSize = {
  height: 1,
  width: 1,
};

const canvasMargins = {
  top: 25,
  left: 30,
};

const canvasSize = {
  height: rectSize.height * 75,
  width: rectSize.width * 150,
};

export default function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<CanvasType>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const changes = useRef<ChangesType>({
    poses: [],
    values: [],
  });

  async function getCanvas() {
    if (isDrawing) return;
    setIsLoading(true);
    setCanvas(await getInitialCanvasState());
    setIsLoading(false);
  }

  useEffect(() => {
    getCanvas();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      getCanvas();
    }, 2000);

    return () => clearInterval(id);
  }, [isDrawing]);

  useEffect(() => {
    if (isLoading) return;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;

      for (let h = 0; h < canvas.length; h++) {
        for (let w = 0; w < canvas[h].length; w++) {
          ctx.fillStyle = new RGB(50, 50, 50).css;
          ctx.fillRect(
            w * rectSize.width,
            h * rectSize.height,
            rectSize.width,
            rectSize.height
          );

          ctx.fillStyle = new RGB(
            canvas[h][w][0],
            canvas[h][w][1],
            canvas[h][w][2]
          ).css;
          ctx.fillRect(
            w * rectSize.width + borderSize.width,
            h * rectSize.height + borderSize.height,
            rectSize.width - borderSize.width * 2,
            rectSize.height - borderSize.height * 2
          );
        }
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (isDrawing) return;
    postSetPixels(changes.current);
    changes.current = {
      poses: [],
      values: [],
    };
  }, [isDrawing]);

  function draw(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const pos = {
      x:
        (e.pageX -
          canvasMargins.left -
          ((e.pageX - canvasMargins.left) % rectSize.width)) /
        rectSize.width,
      y:
        (e.pageY -
          canvasMargins.top -
          ((e.pageY - canvasMargins.top) % rectSize.height)) /
        rectSize.height,
    };
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.fillStyle = props.color.css;
      ctx.fillRect(
        pos.x * rectSize.width + borderSize.width,
        pos.y * rectSize.height + borderSize.height,
        rectSize.width - borderSize.width * 2,
        rectSize.height - borderSize.height * 2
      );

      changes.current.poses.push([pos.x, pos.y]);
      changes.current.values.push(props.color.values);
    }
  }

  function canvasMouseDownHandler(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    setIsDrawing(true);
    draw(e);
  }

  function canvasMouseMoveHandler(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    if (!isDrawing) return;
    draw(e);
  }

  function canvasMouseUpHandler() {
    setIsDrawing(false);
  }

  function canvasMouseLeaveHandler() {
    setIsDrawing(false);
  }

  function canvasMouseEnterHandler() {
    setIsDrawing(document.body.matches(":active"));
  }

  return (
    <canvas
      id="main-canvas"
      onMouseDown={canvasMouseDownHandler}
      onMouseMove={canvasMouseMoveHandler}
      onMouseUp={canvasMouseUpHandler}
      onMouseLeave={canvasMouseLeaveHandler}
      onMouseEnter={canvasMouseEnterHandler}
      ref={canvasRef}
      height={canvasSize.height}
      width={canvasSize.width}
      style={{
        marginTop: canvasMargins.top,
        marginLeft: canvasMargins.left,
      }}
    ></canvas>
  );
}
