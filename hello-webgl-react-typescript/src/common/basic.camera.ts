import { mat4, ReadonlyVec3 } from 'gl-matrix';

export function viewMatrix(
  out: mat4
) {
  const eye:    ReadonlyVec3 = [0.0, 0.0,-5.0];
  const center: ReadonlyVec3 = [0.0, 0.0, 0.0];
  const up:     ReadonlyVec3 = [0.0, 1.0, 0.0];
  mat4.lookAt(out, eye, center, up);
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
  out: mat4, width: number, height: number
) {
  const left = -1;
  const right = 1;
  const bottom = 1;
  const top = -1;
  const near = 0;
  const far = 10;
  mat4.ortho(out, left, right, bottom, top, near, far)

  if (width > height) {
    const scaleX = height / width;
    mat4.scale(out, out, [scaleX, 1.0, 1.0])
  } else {
    const scaleY = width / height;
    mat4.scale(out, out, [1.0, scaleY, 1.0])
  }
}

export function perspectiveProjection(
  out: mat4, width: number, height: number
) {
  const fovy = 45;
  const near = 0.1;
  const far = 100;
  const aspect = width / height;
  mat4.perspective(out, fovy, aspect, near, far)
}
