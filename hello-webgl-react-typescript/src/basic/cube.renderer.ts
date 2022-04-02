import * as shader from '../common/shader'
import { vertSource, fragSource } from './cube.shaders';
import Cube3D from './model.cube';
import { mat4 } from 'gl-matrix';
import { viewMatrix, perspectiveProjection } from '../common/basic.camera';
import { ViewTarget } from '../common/viewtarget';

class CubeRenderer {
  gl: WebGL2RenderingContext
  viewTarget: ViewTarget

  program: WebGLProgram | null = null;

  model: Cube3D;
  vao: WebGLVertexArrayObject | null = null;
  vbo: WebGLBuffer | null = null;
  ibo: WebGLBuffer | null = null;

  modelMat4: mat4;
  viewMat4: mat4;
  modelViewMat4: mat4;
  projectionMat4: mat4;
  modelViewMat4Location: WebGLUniformLocation | null = null;
  projectionMat4Location: WebGLUniformLocation | null = null;

  constructor(gl: WebGL2RenderingContext, viewTarget: ViewTarget) {
    this.gl = gl;
    this.viewTarget = viewTarget;

    this.model = new Cube3D();
    this.modelMat4 = mat4.create();
    this.viewMat4 = mat4.create();
    this.modelViewMat4 = mat4.create();
    this.projectionMat4= mat4.create();

    viewMatrix(this.viewMat4);

    const program = this.program = this.initProgram();
    if (!program) {
      // Error log in initProgram
      return;
    }
  }
  
  render(time: number) {
    const gl = this.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(this.program);

    perspectiveProjection(this.projectionMat4, this.viewTarget.width(), this.viewTarget.height());
    gl.uniformMatrix4fv(this.projectionMat4Location, false, this.projectionMat4);

    mat4.identity(this.modelMat4);
    const radianLoop = ((time % 10000) / 10000) * Math.PI * 2;
    mat4.rotate(this.modelMat4, this.modelMat4, -radianLoop * 2.0, [0.0, 1.0, 0.0]);

    mat4.multiply(this.modelViewMat4, this.viewMat4, this.modelMat4);
    gl.uniformMatrix4fv(this.modelViewMat4Location, false, this.modelViewMat4);

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(
      this.model.getDrawMode(gl),
      this.model.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );

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
    gl.bufferData(gl.ARRAY_BUFFER, this.model.vertices, gl.STATIC_DRAW);

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

    gl.useProgram(program);

    const vaoStride = this.model.FBYTES * this.model.STRIDE;
    const aVertexPosition: GLint = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, vaoStride, this.model.FBYTES * 0);

    this.modelViewMat4Location = gl.getUniformLocation(program, "uModelView")
    this.projectionMat4Location = gl.getUniformLocation(program, "uProjection")

    const ibo: WebGLBuffer | null = this.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.model.indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return program;
  }
}

export default CubeRenderer;