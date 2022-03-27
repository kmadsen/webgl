import { useRef, useEffect } from 'react'

import './triangle.component.css'
import TriangleRenderer from './triangle.renderer';

const Triangle = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas) {
      console.error('Sorry! No HTML5 Canvas was found on this page');
      return;
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 is not supported by your browser');
      return;
    }

    const triangleRenderer = new TriangleRenderer(canvas, gl);

    console.log(`Start draw: ${gl.canvas.width}, ${gl.canvas.height}`);
    
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    triangleRenderer.render();

    triangleRenderer.dispose();
  }, [])

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default Triangle
