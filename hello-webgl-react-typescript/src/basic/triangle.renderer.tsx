import { vertSource, fragSource } from './triangle.shaders'

class TriangleRenderer {
  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  program: WebGLProgram | null = null;
  vbo: WebGLBuffer | null = null;
  ibo: WebGLBuffer | null = null;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas;
    this.gl = gl;

    const vertices = [
      -0.5, -0.5, 0,
       0.5, -0.5, 0,
       0.0,  0.5, 0
    ];
  
    // Indices defined in counter-clockwise order
    const indices = [0, 1, 2];
  
    gl.enableVertexAttribArray(0);
  
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    this.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    if (!this.vbo || !this.ibo) {
      console.error('Unable to initialize buffers');
      return;
    }

    const program = this.program = this.initProgram();
    if (!program) {
      // Error log in initProgram
      return;
    }
  }

  private initProgram(): WebGLProgram | null {
    const gl = this.gl;

    const program: WebGLProgram | null = gl.createProgram();
    if (!program) {
      console.error("Could not create program")
      return null;
    }
    const vertShader = this.prepareShader(
      gl,
      gl.VERTEX_SHADER,
      vertSource()
    );
    if (!vertShader) {
      // Error log assumed in prepareShader function
      return null;
    }
    const fragShader = this.prepareShader(gl, gl.FRAGMENT_SHADER, fragSource(
      [1.0, 0.0, 1.0, 1.0]
    ));
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
    const aVertexPosition: GLint = gl.getAttribLocation(program, 'aVertexPosition');
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);
    this.logAttributes(gl, program);
  
    return program;
  }

  public render() {
    const gl = this.gl;
    const program = this.program;
    
    gl.useProgram(program);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  
  public dispose() {
    this.gl.deleteProgram(this.program);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.ibo);
  }

  prepareShader(
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
  
  logAttributes(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ) {
    const attributeCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attributeCount; i++) {
      const attributeInfo: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
      console.log(attributeInfo);
    }
  }
}

export default TriangleRenderer;