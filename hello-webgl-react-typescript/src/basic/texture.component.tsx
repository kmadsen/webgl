import React, { useRef, useEffect } from 'react';
import './basic.component.css';
import TextureRenderer from './texture.renderer';
import { CanvasViewTarget } from './viewtarget';
import { mat4, vec2 } from 'gl-matrix';
import ModelTrackMouse from './model.trackmouse';

const TextureComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

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

    const modelMat4 = mat4.create();
    const trackMouse = new ModelTrackMouse(canvas)
    const canvasViewTarget = new CanvasViewTarget(gl, canvas);
    const renderer = new TextureRenderer(gl, canvasViewTarget);

    function render(time: DOMHighResTimeStamp) {
      if (gl != null && canvas != null) {
        canvasViewTarget.bind();

        const mouseMovePosition: vec2 | null = trackMouse.getMovePosition();
        if (mouseMovePosition) {
          mat4.identity(modelMat4);
          mat4.rotate(modelMat4, modelMat4, mouseMovePosition[0] * Math.PI, [0.0, 1.0, 0.0])
          mat4.rotate(modelMat4, modelMat4, mouseMovePosition[1] * Math.PI, [1.0, 0.0, 0.0])
          renderer.render(modelMat4);
        } else {
          mat4.identity(modelMat4);
          const radianLoop = ((time % 20000) / 20000) * Math.PI * 2;
          mat4.rotate(modelMat4, modelMat4, radianLoop, [1.0, 0.0, 0.0]);
          mat4.rotate(modelMat4, modelMat4, radianLoop, [0.0, 1.0, 0.0]);
          mat4.rotate(modelMat4, modelMat4, radianLoop, [0.0, 0.0, 1.0]);
          renderer.render(modelMat4);
        }

        animationRef.current = requestAnimationFrame(render);
      }
    }
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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

export default TextureComponent;
