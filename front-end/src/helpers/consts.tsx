export class RGB {
  public css: string;
  public values: [number, number, number];

  constructor(
    private red: number,
    private green: number,
    private blue: number
  ) {
    this.css = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    this.values = [red, green, blue];
  }
}

export const colors = {
  white: new RGB(255, 255, 255),
  cyan: new RGB(0, 255, 255),
  magenta: new RGB(255, 0, 255),
  yellow: new RGB(255, 255, 0),
  red: new RGB(255, 0, 0),
  green: new RGB(0, 255, 0),
  blue: new RGB(0, 0, 255),
  black: new RGB(0, 0, 0),
};

export type ColorsType = RGB;
