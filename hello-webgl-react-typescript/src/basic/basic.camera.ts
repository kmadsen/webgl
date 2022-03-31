import { mat4 } from 'gl-matrix';

export function viewport(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement
) {
  const width = canvas.clientWidth;
  const height = Math.floor(canvas.clientHeight);

  if (gl.canvas.width != width || gl.canvas.height != height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

/**
 * Create a camera projection that optimizes for viewing models
 * in mobile and desktop environments. The camera space is
 * normalized to [-1.0, 1.0].
 *
 * If the aspect ratio of the viewer favors the height or width,
 * this projection will attempt to alwasy support visibility.
 * If the width is greater than the height, all models at location
 * 1.0 will be visible and there will be extra space available in
 * width direction.
 *
 * @param out The projection matrix that will be written to.
 */
export function orthoProjection(
  out: mat4,
  gl: WebGL2RenderingContext
) {
  const left = -1;
  const right = 1;
  const bottom = 1;
  const top = -1;
  const near = -1;
  const far = 1;
  mat4.ortho(out, left, right, bottom, top, near, far)

  if (gl.canvas.clientWidth > gl.canvas.clientHeight) {
    const scaleX = gl.canvas.clientHeight / gl.canvas.clientWidth;
    mat4.scale(out, out, [scaleX, 1.0, 1.0])
  } else {
    const scaleY = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.scale(out, out, [1.0, scaleY, 1.0])
  }
}
