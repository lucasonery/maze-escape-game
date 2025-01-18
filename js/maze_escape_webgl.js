// maze_escape_webgl.js - Main game logic for Maze Escape

import { generateMaze, renderMaze3D } from './maze.js';
import { vertexShaderSource, fragmentShaderSource } from './shaders.js';

// Use glMatrix namespace from global script
const mat4 = glMatrix.mat4;

// Initialize WebGL
const canvas = document.getElementById('gameCanvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    console.error('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
    alert('Your browser does not support WebGL');
}

// Compile shader function
function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Initialize shaders
function initializeShaders() {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        return null;
    }

    gl.useProgram(program);
    return program;
}

// Main function
function main() {
   gl.clearColor(0.1, 0.1, 0.1, 1.0); // Dark background
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable depth testing for 3D rendering
    gl.enable(gl.DEPTH_TEST);

    const program = initializeShaders();
    if (!program) return;

    // Generate a 3D maze
    const maze = generateMaze(11, 11); // Fixed size maze

    // Create projection matrix
    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix,
        Math.PI / 4, // Field of view (45 degrees)
        canvas.width / canvas.height, // Aspect ratio
        0.1, // Near clipping plane
        100.0 // Far clipping plane
    );

    // Create and adjust view matrix
    const viewMatrix = mat4.create();
    mat4.lookAt(
        viewMatrix,
        [5, 10, 5], // Camera position (elevated and looking down)
        [0, 0, 0],   // Look-at position (center of the maze)
        [0, 1, 0]    // Up vector
    );

    // Render the 3D maze
    renderMaze3D(gl, maze, program, projectionMatrix, viewMatrix);

    console.log('Maze rendered with 3D perspective and updated view.');
}

main();
