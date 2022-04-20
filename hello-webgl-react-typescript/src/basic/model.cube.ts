class Cube3D {
  vertices: Float32Array
  indices: Uint16Array
  textureCoords: Float32Array
  
  STRIDE = 3;
  FBYTES = 4;

  constructor() {
    this.vertices = new Float32Array([
      -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1, // -z plane
      -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1, // +z plane
      -1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1, // +x plane
       1,-1,-1,  1, 1,-1,  1, 1, 1,  1,-1, 1, // -x plane
      -1,-1,-1, -1,-1, 1,  1,-1, 1,  1,-1,-1, // -y plane
      -1, 1,-1, -1, 1, 1,  1, 1, 1,  1, 1,-1, // +y plane
    ]);
    this.textureCoords = new Float32Array([
       0,0,  1,0,  1,1, 0,1,
       0,0,  1,0,  1,1, 0,1,
       0,0,  1,0,  1,1, 0,1,
       0,0,  1,0,  1,1, 0,1,
       0,0,  1,0,  1,1, 0,1,
       0,0,  1,0,  1,1, 0,1,
    ])
    this.indices = new Uint16Array([
       0, 1, 2,  0, 2, 3,  4, 5, 6,  4, 6, 7,
       8, 9,10,  8,10,11, 12,13,14, 12,14,15,
      16,17,18, 16,18,19, 20,21,22, 20,22,23 
    ]);
  }

  getDrawMode(gl: WebGL2RenderingContext): GLuint {
    return gl.TRIANGLES
  }
}

export default Cube3D;