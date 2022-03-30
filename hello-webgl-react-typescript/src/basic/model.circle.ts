class Circle2D {
  radius: number
  vertices: Float32Array
  indices: Uint16Array
  
  STRIDE = 3;
  FBYTES = 4;

  constructor(radius: number, density: number, offset = 0.0) {
    this.radius = radius;
  
    this.vertices = new Float32Array((1 + density) * 3)
    for (let i = 3; i < this.vertices.length;) {
      const angle = ((i / 3.0) / density) * 2.0 * Math.PI + offset; 
      this.vertices[i++] = this.round(radius * Math.cos(angle), 3);
      this.vertices[i++] = this.round(radius * Math.sin(angle), 3);
      this.vertices[i++] = 0.0;
    }

    this.indices = new Uint16Array(density * 3);
    for (let i = 0; i < density; i++) {
      this.indices[i * 3 + 0] = 0;
      this.indices[i * 3 + 1] = i + 1;
      this.indices[i * 3 + 2] = i + 2;
    }
    this.indices[this.indices.length - 1] = 1;
  }

  getDrawMode(gl: WebGL2RenderingContext): GLuint {
    return gl.TRIANGLE_FAN
  }

  round(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;  
  }
}

export default Circle2D;