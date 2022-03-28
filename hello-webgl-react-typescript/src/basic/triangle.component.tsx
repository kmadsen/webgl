import React, { useRef, useEffect } from 'react'

import './basic.component.css'
import TriangleRenderer from './triangle.renderer';

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
    canvas.getContext('webgl2')
    const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2', attributes);
    if (!gl) {
      console.error('WebGL2 is not supported by your browser');
      return;
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0, 0, canvas.width, canvas.height);

    const triangleRenderer = new TriangleRenderer(canvas, gl);

    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    triangleRenderer.render();

    triangleRenderer.dispose();
  }, [])

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default Triangle
