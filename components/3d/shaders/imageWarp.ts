// Image warp shader for water/ripple distortion effect
// Used on 3D cards to create fluid motion feel

export const imageWarpVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Calculate distance from mouse position (normalized)
    vec2 mousePos = uMouse * 0.5 + 0.5;
    float dist = distance(vUv, mousePos);

    // Wave distortion based on mouse proximity
    float wave = sin(dist * 20.0 - uTime * 2.0) * uIntensity;
    wave *= smoothstep(0.5, 0.0, dist);

    pos.z += wave * 0.1;
    vDistortion = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const imageWarpFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uGlowColor;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    vec2 uv = vUv;

    // Ripple distortion effect
    float dist = distance(uv, uMouse * 0.5 + 0.5);
    float ripple = sin(dist * 30.0 - uTime * 3.0) * 0.01 * uIntensity;
    ripple *= smoothstep(0.6, 0.0, dist);

    // Water-like offset
    vec2 offset = vec2(
      sin(uv.y * 10.0 + uTime * 2.0) * 0.003,
      cos(uv.x * 10.0 + uTime * 2.0) * 0.003
    ) * uIntensity;

    vec2 distortedUv = uv + offset + ripple;

    vec4 color = texture2D(uTexture, distortedUv);

    // Add glow bleeding from edges
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeGlow = smoothstep(0.15, 0.0, edgeDist) * 0.3;
    vec3 glowContrib = uGlowColor * edgeGlow * (1.0 + abs(vDistortion) * 2.0);

    color.rgb += glowContrib;

    // Slight chromatic aberration for lens effect
    float aberration = 0.002 * uIntensity;
    float r = texture2D(uTexture, distortedUv + vec2(aberration, 0.0)).r;
    float b = texture2D(uTexture, distortedUv - vec2(aberration, 0.0)).b;
    color.r = mix(color.r, r, 0.5);
    color.b = mix(color.b, b, 0.5);

    gl_FragColor = color;
  }
`;

// Simpler version without texture input for solid backgrounds
export const solidWarpFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uGlowColor;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    vec2 uv = vUv;

    // Ripple distortion
    float dist = distance(uv, uMouse * 0.5 + 0.5);
    float ripple = sin(dist * 25.0 - uTime * 2.5) * 0.015 * uIntensity;
    ripple *= smoothstep(0.5, 0.0, dist);

    // Base color with ripple distortion
    vec3 color = uColor;

    // Add wave-based highlights
    float highlight = sin(uv.y * 15.0 + uTime * 1.5) * 0.5 + 0.5;
    highlight *= sin(uv.x * 15.0 - uTime * 1.2) * 0.5 + 0.5;
    color += highlight * 0.08;

    // Edge glow
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeGlow = smoothstep(0.12, 0.0, edgeDist);
    color = mix(color, uGlowColor, edgeGlow * 0.5);

    // Apply ripple brightness variation
    color += abs(ripple) * uGlowColor * 0.8;

    gl_FragColor = vec4(color, 1.0);
  }
`;