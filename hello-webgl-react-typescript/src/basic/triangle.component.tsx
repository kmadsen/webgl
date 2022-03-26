import { useRef, useEffect } from 'react'

import './triangle.component.css'

const frag_source = `
  #version 300 es
  precision mediump float;

  out vec4 fragColor;

  void main(void) {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }`;

const vert_source = `
  #version 300 es
  precision mediump float;

  in vec3 aVertexPosition;

  void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
  }`;

function prepareShader(
  gl: WebGL2RenderingContext,
  shaderType: GLenum,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(shaderType);
  if (!shader) {
    console.error("Could not create shader")
    return null;
  }

  gl.shaderSource(shader, source.trim());
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    console.log(source);
    return null;
  }

  return shader;
}

function initProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const program: WebGLProgram | null = gl.createProgram();
  if (!program) {
    console.error("Could not create program")
    return null;
  }
  const vertShader = prepareShader(gl, gl.VERTEX_SHADER, vert_source);
  if (!vertShader) {
    // Error log assumed in prepareShader function
    return null;
  }
  const fragShader = prepareShader(gl, gl.FRAGMENT_SHADER, frag_source);
  if (!fragShader) {
    // Error log assumed in prepareShader function
    return null;
  }

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  gl.detachShader(program, vertShader);
  gl.detachShader(program, fragShader);
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not link shaders');
    return null;
  }  

  gl.useProgram(program);

  return program;
}

function logAttributes(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
) {
  const attributeCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < attributeCount; i++) {
    const attributeInfo: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
    console.log(attributeInfo);
  }
}

const Triangle = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Sorry! No HTML5 Canvas was found on this page');
      return;
    }

    const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 is not supported by your browser');
      return;
    }

    const vertices = [
      -0.5, -0.5, 0,
       0.5, -0.5, 0,
       0.0,  0.5, 0
    ];
  
    // Indices defined in counter-clockwise order
    const indices = [0, 1, 2];
  
    gl.enableVertexAttribArray(0);
  
    const vbo: WebGLBuffer | null = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    const ibo: WebGLBuffer | null = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    if (!vbo || !ibo) {
      console.error('Unable to initialize buffers');
      return;
    }

    const program: WebGLProgram | null = initProgram(gl);
    if (!program) {
      // Error log in initProgram
      return;
    }

    // Enable attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    const aVertexPosition: GLint = gl.getAttribLocation(program, 'aVertexPosition');
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    logAttributes(gl, program);
    
    console.log(`Start draw: ${gl.canvas.width}, ${gl.canvas.height}`);
    
    gl.useProgram(program);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.deleteProgram(program);
  }, [])

  return <canvas className="fill-window" ref={canvasRef}/>
}

export default Triangle
