const defaultColor: Array<number> = [1.0, 1.0, 0.0, 1.0]

export const vertSource = () => {
  return `
  #version 300 es
  precision mediump float;
  
  in vec3 aVertexPosition;
  
  void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
  }`;
};

export const fragSource = (color: Array<number> = defaultColor) => {
  return `
  #version 300 es
  precision mediump float;
  
  out vec4 fragColor;
  
  void main(void) {
    fragColor = vec4(${color.join(",")});
  }`;
};
