// Ripple/wave distortion fragment shader for feature card images.

export const cardVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cardFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform float uMotion;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    float amp = 0.008 + uHover * 0.03 + uMotion * 0.018;
    vec2 distortedUv = vUv;
    distortedUv.x += sin(vUv.y * 14.0 + uTime * 1.6) * amp;
    distortedUv.y += cos(vUv.x * 12.0 + uTime * 1.3) * amp * 0.6;
    distortedUv += (vUv - 0.5) * uMotion * 0.03;

    vec4 color = texture2D(uTexture, distortedUv);

    float vignette = smoothstep(1.2, 0.3, length(vUv - 0.5));

    float edge = 1.0 - smoothstep(0.0, 0.08, min(min(vUv.x, vUv.y), min(1.0 - vUv.x, 1.0 - vUv.y)));
    color.rgb += uTint * edge * (0.4 + uHover * 0.45 + uMotion * 0.35);
    color.rgb += uTint * (0.08 + uMotion * 0.12);

    gl_FragColor = vec4(color.rgb * vignette, 1.0);
  }
`;