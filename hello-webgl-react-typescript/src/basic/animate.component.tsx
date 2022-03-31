import React, { useRef, useEffect } from 'react';
import './basic.component.css';
import AnimateRenderer from './animate.renderer';

const AnimateComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const requestRef = React.useRef<number>();
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('Call useEffect');
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

    const renderer = new AnimateRenderer(canvas, gl);

    function render(time: DOMHighResTimeStamp) {
      if (gl != null && canvas != null) {
        renderer.render(time);
        requestRef.current = requestAnimationFrame(render);
      }

      // This allows you to throttle the animation loop
      // timeoutRef.current = setTimeout(() => {
      //   requestRef.current = requestAnimationFrame(render);
      // }, 1000.0);
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

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default AnimateComponent;
