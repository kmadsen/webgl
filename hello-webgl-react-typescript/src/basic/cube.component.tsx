import React, { useRef, useEffect } from 'react';
import '../common/basic.component.css';
import CubeRenderer from './cube.renderer';
import { CanvasViewTarget } from '../common/viewtarget';

const CubeComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const requestRef = React.useRef<number>();
  const timeoutRef = React.useRef<NodeJS.Timeout>();

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

    const canvasViewTarget = new CanvasViewTarget(gl, canvas);
    const renderer = new CubeRenderer(gl, canvasViewTarget);

    function render(time: DOMHighResTimeStamp) {
      if (gl != null && canvas != null) {
        canvasViewTarget.bind();
        renderer.render(time);
        requestRef.current = requestAnimationFrame(render);
      }
    }
    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas className="fill-window" ref={canvasRef}/>
    </div>
  )
}

export default CubeComponent;
