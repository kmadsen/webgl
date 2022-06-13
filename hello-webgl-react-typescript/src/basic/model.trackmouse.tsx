import { vec2 } from "gl-matrix";

function mousePosition(canvas: HTMLCanvasElement, event: MouseEvent): vec2 {
  const rect: DOMRect = canvas.getBoundingClientRect()
  return [event.clientX - rect.left, event.clientY - rect.top]
}

function touchPosition(canvas: HTMLCanvasElement, event: TouchEvent): vec2 {
  const rect: DOMRect = canvas.getBoundingClientRect()
  const touch = event.touches[0]
  return [touch.clientX - rect.left, touch.clientY - rect.top]
}


class TrackGestures {

  private mouseDownPosition: vec2 | null = null
  private mouseMovePosition = vec2.create()

  constructor(canvas: HTMLCanvasElement) {

    /**
     * Mouse tracking
     */

    canvas.onmousedown = event => {
      const point = mousePosition(canvas, event)
      this.onStart(canvas, point)
    }
    canvas.onmousemove = event => {
      const point = mousePosition(canvas, event)
      this.onMove(canvas, point)
    }
    canvas.onmouseleave = () => this.onEnd()
    canvas.onmouseup = () => this.onEnd()

    /**
     * Touch tracking
     */

    canvas.ontouchstart = event => {
      if (event.target == canvas) {
        const point = touchPosition(canvas, event)
        this.onStart(canvas, point)
      }
    }
    canvas.ontouchmove = event => {
      if (event.target == canvas) {
        const point = touchPosition(canvas, event)
        this.onMove(canvas, point)
      }
    }
    canvas.ontouchend = () => this.onEnd()
  }

  onStart(canvas: HTMLCanvasElement, point: vec2) {
    this.mouseDownPosition = point
    vec2.subtract(this.mouseMovePosition, this.mouseDownPosition, point)
  }

  onMove(canvas: HTMLCanvasElement, point: vec2) {
    if (this.mouseDownPosition) {
      const rect: DOMRect = canvas.getBoundingClientRect()
      const rectDimension: vec2 = vec2.fromValues(rect.width, rect.height)
      vec2.subtract(this.mouseMovePosition, point, this.mouseDownPosition)
      vec2.divide(this.mouseMovePosition, this.mouseMovePosition, rectDimension)
    }
  }

  onEnd() { this.mouseDownPosition = null }

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

export default TrackGestures;