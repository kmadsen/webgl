export function viewport(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement
) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width * 2.0 / 3.0;

  if (canvas.width >= canvas.height) {
    const aspectRatio = canvas.height / canvas.width;
    const xOffset = (canvas.width - (canvas.width * aspectRatio)) / 2.0;
    gl.viewport(xOffset, 0, canvas.width * aspectRatio, canvas.height);
  }
  else if (canvas.width < canvas.height) {
    const aspectRatio = canvas.width / canvas.height;
    const yOffset = (canvas.height - (canvas.height * aspectRatio)) / 2.0;
    gl.viewport(0, yOffset, canvas.width, canvas.height * aspectRatio);
  }
}
