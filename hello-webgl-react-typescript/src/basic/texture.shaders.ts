export const vertSource = () => {
  return `
  #version 300 es
  precision mediump float;
  
  in vec3 aVertexPosition;
  in vec2 aVertexTextureCoord;

  uniform mat4 uModelView;
  uniform mat4 uProjection;

  out vec2 vTextureCoords;
  
  void main(void) {
    gl_Position = uProjection * uModelView * vec4(aVertexPosition, 1.0);
    vTextureCoords = aVertexTextureCoord;
  }`;
};

export const fragSource = () => {
  return `
  #version 300 es
  precision mediump float;
  
  in vec2 vTextureCoords;

  uniform sampler2D uSampler;

  out vec4 fragColor;
  
  void main(void) {
    fragColor = texture(uSampler, vTextureCoords);
  }`;
};
