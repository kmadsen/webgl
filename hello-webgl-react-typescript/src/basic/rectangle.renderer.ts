import * as shader from './shader'
import { vertSource, fragSource } from './rectangle.shaders';

class RectangleRenderer {
  gl: WebGL2RenderingContext

  FBYTES = 4;
  stride = 6;
  vertices = [
    -0.5,  0.5, 0, 0.5, 0.5, 0.0,
    -0.5, -0.5, 0, 0.0, 0.5, 0.5,
     0.5, -0.5, 0, 0.5, 0.0, 0.5,
     0.5,  0.5, 0, 0.5, 0.0, 0.0
  ];
  indices = [
    0, 1, 2,
    0, 2, 3
  ];
  
  program: WebGLProgram | null = null;
  vao: WebGLVertexArrayObject | null = null;
  vbo: WebGLBuffer | null = null;
  ibo: WebGLBuffer | null = null;
  
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    
    const program = this.program = this.initProgram();
    if (!program) {
      // Error log in initProgram
      return;
    }
  }
  
  render() {
    const gl = this.gl;

    gl.useProgram(this.program);

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  dispose() {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.ibo);
    this.gl.deleteProgram(this.program);
  }

  initProgram(): WebGLProgram | null {
    const gl = this.gl;

    const vao: WebGLVertexArrayObject | null = this.vao = gl.createVertexArray();
    if (!vao) {
      console.error('Unable to initialize WebGLVertexArrayObject');
      return null;
    }
    gl.bindVertexArray(vao);

    const vbo: WebGLBuffer | null = this.vbo = gl.createBuffer();
    if (!vbo) {
      console.error('Unable to initialize vertex WebGLBuffer');
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const program: WebGLProgram | null = gl.createProgram();
    if (!program) {
      console.error('Could not create program')
      return null;
    }

    const vertShader = shader.prepare(gl, gl.VERTEX_SHADER, vertSource());
    if (!vertShader) {
      // Error log assumed in prepareShader function
      return null;
    }
    const fragShader = shader.prepare(gl, gl.FRAGMENT_SHADER, fragSource());
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

    const vaoStride = this.FBYTES * this.stride;
    const aVertexPosition: GLint = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, vaoStride, this.FBYTES * 0);

    const aVertexColor: GLint = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(aVertexColor);
    gl.vertexAttribPointer(aVertexColor, 3, gl.FLOAT, false, vaoStride, this.FBYTES * 3);

    const ibo: WebGLBuffer | null = this.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return program;
  }
}

export default RectangleRenderer;