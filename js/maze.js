// maze.js - Maze generation and rendering in 3D

// Function to generate a basic maze using a fixed map
function generateMaze(rows, cols) {
    // Fixed maze map (1 = wall, 0 = path)
    const maze = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
    ];

    // Ensure the provided rows and cols match the fixed map
    if (maze.length !== rows || maze[0].length !== cols) {
        console.warn("Fixed maze map dimensions do not match specified rows and cols.");
    }

    return maze;
}

function renderMaze3D(gl, maze, program, projectionMatrix, viewMatrix) {
    const vertices = [];
    const colors = [];

    const tileSize = 1.0; // Tamanho da célula
    const wallHeight = 1.0; // Altura das paredes

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const x = j * tileSize - (maze[0].length / 2) * tileSize;
            const z = -(i * tileSize - (maze.length / 2) * tileSize);
            const wallY = wallHeight / 2;

            if (maze[i][j] === 1) { // Renderizar paredes
                vertices.push(
                    // Front face
                    x, wallY, z, x + tileSize, wallY, z, x, wallY + wallHeight, z,
                    x, wallY + wallHeight, z, x + tileSize, wallY, z, x + tileSize, wallY + wallHeight, z,

                    // Back face
                    x, wallY, z - tileSize, x + tileSize, wallY, z - tileSize, x, wallY + wallHeight, z - tileSize,
                    x, wallY + wallHeight, z - tileSize, x + tileSize, wallY, z - tileSize, x + tileSize, wallY + wallHeight, z - tileSize,

                    // Left face
                    x, wallY, z, x, wallY, z - tileSize, x, wallY + wallHeight, z,
                    x, wallY + wallHeight, z, x, wallY, z - tileSize, x, wallY + wallHeight, z - tileSize,

                    // Right face
                    x + tileSize, wallY, z, x + tileSize, wallY, z - tileSize, x + tileSize, wallY + wallHeight, z,
                    x + tileSize, wallY + wallHeight, z, x + tileSize, wallY, z - tileSize, x + tileSize, wallY + wallHeight, z - tileSize,

                    // Top face
                    x, wallY + wallHeight, z, x + tileSize, wallY + wallHeight, z, x, wallY + wallHeight, z - tileSize,
                    x, wallY + wallHeight, z - tileSize, x + tileSize, wallY + wallHeight, z, x + tileSize, wallY + wallHeight, z - tileSize
                );

                // Cor branca para paredes
                for (let k = 0; k < 36; k++) {
                    colors.push(1.0, 1.0, 1.0, 1.0);
                }
            } else if (i === 1 && j === 1) { // Entrada (verde)
                vertices.push(
                    x, wallY, z, x + tileSize, wallY, z, x, wallY + wallHeight, z,
                    x, wallY + wallHeight, z, x + tileSize, wallY, z, x + tileSize, wallY + wallHeight, z
                );
                for (let k = 0; k < 6; k++) {
                    colors.push(0.0, 1.0, 0.0, 1.0); // Verde
                }
            } else if (i === 5 && j === 5) { // Saída (vermelho)
                vertices.push(
                    x, wallY, z, x + tileSize, wallY, z, x, wallY + wallHeight, z,
                    x, wallY + wallHeight, z, x + tileSize, wallY, z, x + tileSize, wallY + wallHeight, z
                );
                for (let k = 0; k < 6; k++) {
                    colors.push(1.0, 0.0, 0.0, 1.0); // Vermelho
                }
            }
        }
    }

    // Criar buffers para os vértices e cores
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Vincular dados aos atributos do shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    // Passar matrizes para os shaders
    const projectionLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const viewLocation = gl.getUniformLocation(program, 'u_viewMatrix');
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);

    // Desenhar as paredes
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}


export { generateMaze, renderMaze3D };
