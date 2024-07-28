const baseURL = "http://localhost:3000/";

export type CanvasType = [number, number, number][][];

export async function getInitialCanvasState() {
  const url = baseURL + "canvas";
  const request = await fetch(url);
  return (await request.json()) as CanvasType;
}

export type ChangesType = {
  poses: [number, number][];
  values: [number, number, number][];
};

export async function postSetPixels(changes: ChangesType) {
  const url = baseURL + "set-pixels";
  const request = await fetch(url, {
    method: "POST",
    body: JSON.stringify(changes),
  });
  return request.ok;
}
