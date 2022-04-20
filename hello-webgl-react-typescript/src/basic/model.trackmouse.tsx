import { vec2 } from "gl-matrix";

function mousePosition(canvas: HTMLCanvasElement, event: MouseEvent): vec2 {
  const rect: DOMRect = canvas.getBoundingClientRect()
  return [event.clientX - rect.left, event.clientY - rect.top]
}

class ModelTrackMouse {

  private mouseDownPosition: vec2 | null = null
  private mouseMovePosition = vec2.create()

  constructor(canvas: HTMLCanvasElement) {
    canvas.onmousedown = event => {
      const point = mousePosition(canvas, event)
      this.mouseDownPosition = point
      vec2.subtract(this.mouseMovePosition, this.mouseDownPosition, point)
    }

    canvas.onmouseleave = () => {
      this.mouseDownPosition = null
    }

    canvas.onmousemove = event => {
      if (this.mouseDownPosition) {
        const point: vec2 = mousePosition(canvas, event)
        const rect: DOMRect = canvas.getBoundingClientRect()
        const rectDimension: vec2 = vec2.fromValues(rect.width, rect.height)
        vec2.subtract(this.mouseMovePosition, point, this.mouseDownPosition)
        vec2.divide(this.mouseMovePosition, this.mouseMovePosition, rectDimension)
      }
    }

    canvas.onmouseup = () => {
      this.mouseDownPosition = null
    }
  }

  /**
   * getMovePosition
   */
  public getMovePosition(): vec2 | null {
    if (this.mouseDownPosition) {
      return this.mouseMovePosition
    } else {
      return null;
    }
  }
}

export default ModelTrackMouse;