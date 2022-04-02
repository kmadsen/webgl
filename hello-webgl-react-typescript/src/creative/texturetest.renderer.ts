import { vec2, vec3 } from "gl-matrix"

/**
 * Add this to a canvas to render a tiny image. It's hard
 * coded to build a 16 by 16 image.
 *
 *  const imageCanvas = canvasDestRef.current
 *  if (imageCanvas) {
 *    const imageRenderer = new TextureTestRenderer()
 *    imageRenderer.render(imageCanvas)
 *  }
 *  <canvas width="16" height="16" ref={canvasDestRef}/>
 */
export default class TextureTestRenderer {
  constructor() {
    // Nothing
  }

  render(canvas: HTMLCanvasElement) {
    const renderingContext: CanvasRenderingContext2D | null = canvas.getContext("2d")
    if (renderingContext) {
      const imageData: ImageData = new ImageData(16, 16)
      const dataArray: Uint8ClampedArray = new Uint8ClampedArray(16 * 16 * 4)

      const curve = this.hermiteCurve()
      for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
          const center = (curve[row][1] + curve[col][1]) / 2 * 255;
          const checker = (row + col) % 2 ? 25 : center * 0.7;
          const isTop = (row < 8);
          const isRight = (col >= 8);
          const color = vec3.fromValues(
            isTop ? checker : center,
            isRight ? center : checker,
            checker
          )
          this.setPixel(dataArray, row, col, color);
        }
      }
      this.setPixel(dataArray,  0,  0, vec3.fromValues(255, 255, 255))
      this.setPixel(dataArray,  0, 15, vec3.fromValues(255,   0,   0))
      this.setPixel(dataArray, 15,  0, vec3.fromValues(  0, 255,   0))
      this.setPixel(dataArray, 15, 15, vec3.fromValues(  0,   0, 255))
      imageData.data.set(dataArray, 0)
      renderingContext.putImageData(imageData, 0, 0)
    }
  }

  setPixel(dataArray: Uint8ClampedArray, row: number, col: number, color: vec3) {
    const index = row * 16 * 4 + col * 4
    dataArray[index + 0] = Math.floor(color[0])
    dataArray[index + 1] = Math.floor(color[1])
    dataArray[index + 2] = Math.floor(color[2])
    dataArray[index + 3] = 255
  }

  /**
   * Creates a circular curve that is 1.0 near the center and 0.0 at the edge.
   */
  hermiteCurve(): vec2[] {
    const out = vec3.create();
    const p0 = vec3.fromValues(0.0, 0.0, 0.0)
    const d0 = vec3.fromValues(0.0, 4.02, 0.0)
    const p1 = vec3.fromValues(16.0, 0.0, 0.0)
    const d1 = vec3.fromValues(0.0, -4.02, 0.0)
    return Array.from({length: 16}, (_, i) => {
      const t = i / 15
      vec3.hermite(out, p0, d0, d1, p1, t)
      return vec2.fromValues(out[0], out[1]);
    });
  }
}
