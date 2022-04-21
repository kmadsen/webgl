import * as shader from './shader'
import { vertSource, fragSource } from './texture.shaders';
import Cube3D from './model.cube';
import { mat4 } from 'gl-matrix';
import { viewMatrix, perspectiveProjection } from './basic.camera';
import { ViewTarget } from './viewtarget';

class TextureRenderer {
  gl: WebGL2RenderingContext
  viewTarget: ViewTarget

  program: WebGLProgram | null = null;

  model: Cube3D;
  vao: WebGLVertexArrayObject | null = null;
  vbo: WebGLBuffer | null = null;
  ibo: WebGLBuffer | null = null;
  texture: WebGLTexture | null = null

  viewMat4: mat4;
  modelViewMat4: mat4;
  projectionMat4: mat4;
  modelViewMat4Location: WebGLUniformLocation | null = null;
  projectionMat4Location: WebGLUniformLocation | null = null;
  sampler2DLocation: WebGLUniformLocation | null = null;

  constructor(gl: WebGL2RenderingContext, viewTarget: ViewTarget) {
    this.gl = gl;
    this.viewTarget = viewTarget;

    this.model = new Cube3D();
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
  
  render(modelMat4: mat4) {
    const gl = this.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(this.program);

    perspectiveProjection(this.projectionMat4, this.viewTarget.width(), this.viewTarget.height());
    gl.uniformMatrix4fv(this.projectionMat4Location, false, this.projectionMat4);

    mat4.multiply(this.modelViewMat4, this.viewMat4, modelMat4);
    gl.uniformMatrix4fv(this.modelViewMat4Location, false, this.modelViewMat4);

    if (this.model.textureCoords) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(this.sampler2DLocation, 0)
    }

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
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  dispose() {
    this.gl.deleteTexture(this.texture);
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.ibo);
    this.gl.deleteProgram(this.program);
  }

  private initProgram(): WebGLProgram | null {
    const gl = this.gl;

    this.texture = gl.createTexture();
    if (!this.texture) {
      console.error('Unable to createTexture');
    } else {
      const image = new Image();
      image.src = './texture/test.png';
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
      image.onerror = (event) => {
        console.error("Failed to load texture")
        console.error(event)
        gl.deleteTexture(this.texture)
        this.texture = null
      }
    }

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

    const aVertexTextureCoord: GLint = gl.getAttribLocation(program, "aVertexTextureCoord");
    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.model.textureCoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aVertexTextureCoord);
    gl.vertexAttribPointer(aVertexTextureCoord, 2, gl.FLOAT, true, 0, 0);

    this.modelViewMat4Location = gl.getUniformLocation(program, "uModelView")
    this.projectionMat4Location = gl.getUniformLocation(program, "uProjection")
    this.sampler2DLocation = gl.getUniformLocation(program, "uSampler")

    const ibo: WebGLBuffer | null = this.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.model.indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return program;
  }
}

export default TextureRenderer;