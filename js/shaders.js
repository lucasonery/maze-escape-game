// Vertex Shader for 3D Rendering
const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec4 a_color;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    varying vec4 v_color;

    void main() {
        gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
        v_color = a_color;
    }
`;

// Fragment Shader for 3D Rendering
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

export { vertexShaderSource, fragmentShaderSource };
