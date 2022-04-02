import React, { useRef, useEffect } from 'react';
import '../common/basic.component.css';
import ModelRenderer from './model.renderer';
import { CanvasViewTarget } from '../common/viewtarget';

const Model = () => {
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

    const viewTarget = new CanvasViewTarget(gl, canvas);
    const renderer = new ModelRenderer(gl);
    
    viewTarget.bind();

    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    renderer.render();
    renderer.dispose();
  }, [])

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default Model;
