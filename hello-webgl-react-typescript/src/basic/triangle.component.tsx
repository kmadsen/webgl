import React, { useRef, useEffect } from 'react'

import './basic.component.css'
import TriangleRenderer from './triangle.renderer';
import { CanvasViewTarget } from './viewtarget';

const Triangle = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas) {
      console.error('Sorry! No HTML5 Canvas was found on this page');
      return;
    }

    const attributes: WebGLContextAttributes = {
      antialias: false,
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: true
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2', attributes);
    if (!gl) {
      console.error('WebGL2 is not supported by your browser');
      return;
    }

    const viewTarget = new CanvasViewTarget(gl, canvas);
    const triangleRenderer = new TriangleRenderer(gl);

    viewTarget.bind();

    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    triangleRenderer.render();
    triangleRenderer.dispose();
  }, [])

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default Triangle
