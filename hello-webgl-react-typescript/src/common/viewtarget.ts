export interface ViewTarget {
  bind(): void
  width(): number
  height(): number
}

export class CanvasViewTarget implements ViewTarget {
  gl: WebGL2RenderingContext
  canvas: HTMLCanvasElement;

  constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    this.gl = gl;
    this.canvas = canvas
  }

  width(): number {
    return this.canvas.clientWidth
  }

  height(): number {
    return this.canvas.clientHeight
  }

  bind() {
    const gl = this.gl;
    const canvas = this.canvas;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (gl.canvas.width != width || gl.canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  }
}

/**
 * Example rendedering onto a frame buffer
 *
 *  const frameBufferViewTarget = new FrameBufferViewTarget(gl, 256, 256);
 *  const cubeRenderer = new CubeRenderer(gl, frameBufferViewTarget);
 *  frameBufferViewTarget.bind();
 *  cubeRenderer.render(0.0);
 *  frameBufferViewTarget.draw(canvasDestRef.current)
 *  frameBufferViewTarget.dispose();
 */
export class FrameBufferViewTarget implements ViewTarget {
  gl: WebGL2RenderingContext;

  frameBuffer: WebGLFramebuffer | null = null;
  renderBuffer: WebGLRenderbuffer | null = null;
  textureTarget: WebGLTexture | null = null;
  targetWidth: number;
  targetHeight: number;

  internalFormat: GLint
  border: GLint
  format: GLint
  type: GLenum
  arrayBufferView: Uint8ClampedArray;

  constructor(gl: WebGL2RenderingContext, targetWidth: number, targetHeight: number) {
    this.gl = gl;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.internalFormat = gl.RGBA;
    this.border = 0;
    this.format = gl.RGBA;
    this.type = gl.UNSIGNED_BYTE;
    this.arrayBufferView = new Uint8ClampedArray(this.targetWidth * this.targetHeight * 4);
  }

  width(): number {
    return this.targetWidth
  }

  height(): number {
    return this.targetHeight
  }

  bind(): void {
    const gl = this.gl;
    const level: GLint = 0;

    /**
     * Step 1: Create the texture
     */
    this.textureTarget = gl.createTexture();
    if (!this.textureTarget) {
      console.error("Failed to create a texture");
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.textureTarget);

    gl.texImage2D(gl.TEXTURE_2D, level, this.internalFormat,
      this.targetWidth, this.targetHeight, this.border, this.format, this.type, null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    /**
     * Step 2: Create the frame buffer
     */
    this.frameBuffer = gl.createFramebuffer()
    if (!this.frameBuffer) {
      console.error("gl.createFramebuffer returned null")
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, this.textureTarget, level
    );

    /**
     * Step 3: (optional) Attach a render buffer with a depth test
     */
    this.renderBuffer = gl.createRenderbuffer();
    if (!this.frameBuffer) {
      console.error("gl.createRenderbuffer returned null")
      return;
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
      this.targetWidth, this.targetHeight
    );
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER, this.renderBuffer
    );

    /**
     * Step 4: Check the status to ensure it actually works for
     * the system. There are a few things that can go wrong.
     */
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
      let errorType = "unknown"
      if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
        errorType = "FRAMEBUFFER_INCOMPLETE_ATTACHMENT"
      } else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
        errorType = "FRAMEBUFFER_INCOMPLETE_DIMENSIONS"
      } else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
        errorType = "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
      } else if (status === gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
        errorType = "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"
      } else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
        errorType = "FRAMEBUFFER_UNSUPPORTED"
      }
      console.error(`Failed to attach frame buffer with status: ${errorType}`);
      return;
    }

    gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    gl.bindTexture(this.gl.TEXTURE_2D, this.textureTarget);
    gl.viewport(0, 0, this.targetWidth, this.targetHeight);
  }

  readPixels(): Uint8ClampedArray {
    this.gl.readPixels(0, 0, this.targetWidth, this.targetHeight,
      this.internalFormat, this.type, this.arrayBufferView
    );
    return this.arrayBufferView;
  }

  draw(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      console.error("Could not find image to show texture");
      return;
    }
    const pixels = this.readPixels();
    const context = canvas.getContext("2d");
    const imageData = context?.createImageData(
      this.targetWidth, this.targetHeight
    )
    if (imageData && context) {
      const block = 4
      const stride = this.targetWidth * block
      for (let row = 0; row < this.targetHeight; row++) {
        const fromIndexStart = row * stride
        const fromIndexEnd = (row + 1) * stride - 1;
        const toIndexStart = (this.targetHeight - row - 1) * stride;
        const fromPixels = pixels.subarray(fromIndexStart, fromIndexEnd);
        imageData.data.set(fromPixels, toIndexStart);
      }
      context.putImageData(imageData, 0, 0);
    } else {
      console.error("Could not createImageData");
    }
  }

  dispose(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null)
    this.gl.deleteTexture(this.textureTarget)
    this.gl.deleteFramebuffer(this.frameBuffer);
    this.gl.deleteRenderbuffer(this.renderBuffer);
  }
}