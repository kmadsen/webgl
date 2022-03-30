export const vertSource = () => {
  return `
  #version 300 es
  precision mediump float;
  
  in vec3 aVertexPosition;

  out vec3 vColor;
  
  void main(void) {
    vColor.bgr = aVertexPosition + 0.5;
    gl_Position = vec4(aVertexPosition, 1.0);
  }`;
};

export const fragSource = () => {
  return `
  #version 300 es
  precision mediump float;
  
  in vec3 vColor;

  out vec4 fragColor;
  
  void main(void) {
    fragColor = vec4(vColor, 1.0);
  }`;
};
