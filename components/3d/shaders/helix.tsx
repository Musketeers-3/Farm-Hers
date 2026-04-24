export const helixVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float twistFactor = 3.5;
    float speed = 1.2;
    float angle = (position.y * twistFactor) - (uTime * speed);
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    vec3 transformed = position;
    transformed.xz = rotationMatrix * transformed.xz;
    float pulse = sin(uTime * 2.0 - position.y * 5.0) * 0.1 + 0.9;
    transformed.xz *= pulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const helixFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // FarmHers Green to Gold
    vec3 colorA = vec3(0.13, 0.77, 0.36); 
    vec3 colorB = vec3(0.98, 0.75, 0.14); 
    float mixRatio = sin(vUv.y * 10.0 + uTime * 3.0) * 0.5 + 0.5;
    vec3 finalColor = mix(colorA, colorB, mixRatio);
    gl_FragColor = vec4(finalColor * 2.5, 1.0);
  }
`;