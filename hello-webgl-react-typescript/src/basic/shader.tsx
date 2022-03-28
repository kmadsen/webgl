export function prepare(
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

export function logAttributes(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
) {
  const attributeCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < attributeCount; i++) {
    const attributeInfo: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
    console.log(attributeInfo);
  }
}