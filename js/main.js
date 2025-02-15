// js/main.js

// Obtém o canvas e inicializa o contexto WebGL
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  console.error("WebGL não suportado.");
}

// Matrizes de transformação: view, projeção e modelo
let viewMatrix = mat4.create();
let projMatrix = mat4.create();
let modelMatrix = mat4.create();

// Configuração da projeção perspectiva
const fov = 45 * Math.PI / 180;
const aspect = canvas.clientWidth / canvas.clientHeight;
const near = 0.1;
const far = 100.0;
mat4.perspective(projMatrix, fov, aspect, near, far);

// Carrega os shaders (obtidos do index.html)
const vertexShaderSource = document.getElementById("vertex-shader").textContent;
const fragmentShaderSource = document.getElementById("fragment-shader").textContent;
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(shaderProgram);

// Recupera atributos e uniforms do shader
const attribLocations = {
  vertexPosition: gl.getAttribLocation(shaderProgram, "aPosition"),
  vertexNormal: gl.getAttribLocation(shaderProgram, "aNormal"),
  textureCoord: gl.getAttribLocation(shaderProgram, "aTexCoord")
};

const uniformLocations = {
  modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
  viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
  projMatrix: gl.getUniformLocation(shaderProgram, "uProjMatrix"),
  uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
  lightDirection: gl.getUniformLocation(shaderProgram, "uLightPosition")
};

// Carrega a textura para as paredes do labirinto
const wallTexture = loadTexture(gl, "assets/textures/wall.png");

// Cria instâncias do labirinto, jogador e gerenciamento do jogo
const maze = new Maze();
const player = new Player();
const game = new Game(maze, player);

// ******************
// Buffers e dados do cubo (paredes do labirinto)
// ******************
const cubeData = createCube(1);

// Buffer de posições para as paredes
const wallPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, wallPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.positions, gl.STATIC_DRAW);

// Buffer de normais para as paredes
const wallNormalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, wallNormalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.normals, gl.STATIC_DRAW);

// Buffer de coordenadas de textura para as paredes
const wallTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, wallTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.texCoords, gl.STATIC_DRAW);

// Buffer de índices para as paredes
const wallIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeData.indices, gl.STATIC_DRAW);

// ******************
// Buffers e textura para o chão do labirinto
// ******************
// define dimensões do chão com base no tamanho do labirinto
const floorWidth = maze.grid[0].length;
const floorHeight = maze.grid.length;
const floorData = createPlane(floorWidth, floorHeight);

// Buffer de posições para o chão
const floorPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, floorPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, floorData.positions, gl.STATIC_DRAW);

// Buffer de normais para o chão
const floorNormalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, floorNormalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, floorData.normals, gl.STATIC_DRAW);

// Buffer de coordenadas de textura para o chão
const floorTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, floorTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, floorData.texCoords, gl.STATIC_DRAW);

// Buffer de índices para o chão
const floorIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorData.indices, gl.STATIC_DRAW);

const floorTexture = loadTexture(gl, "assets/textures/wall1.jpg");

// Função para atualizar a câmera para acompanhar o jogador
function updateCamera() {
  const cameraOffset = [0, 3, 3]; // Ajuste conforme desejado
  const cameraPos = [
    player.position[0] + cameraOffset[0],
    player.position[1] + cameraOffset[1],
    player.position[2] + cameraOffset[2]
  ];
  const target = player.position;
  const up = [0, 1, 0];
  mat4.lookAt(viewMatrix, cameraPos, target, up);
}

// Evento de teclado para movimentar o jogador
document.addEventListener("keydown", (event) => {
  switch(event.key) {
    case "ArrowUp":
      player.move("up", maze);
      break;
    case "ArrowDown":
      player.move("down", maze);
      break;
    case "ArrowLeft":
      player.move("left", maze);
      break;
    case "ArrowRight":
      player.move("right", maze);
      break;
  }
});

// Função para renderizar o labirinto (paredes)
function renderMaze() {
  const wallPositions = maze.getWallPositions();
  
  wallPositions.forEach(pos => {
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, pos);
    
    // Envia as matrizes para o shader
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(uniformLocations.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(uniformLocations.projMatrix, false, projMatrix);
    
    // Configura o atributo de posição do cubo
    gl.bindBuffer(gl.ARRAY_BUFFER, wallPositionBuffer);
    gl.vertexAttribPointer(attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
    
    // Vincula o buffer de índices e a textura
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallIndexBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(uniformLocations.uSampler, 0);
    
    // Define uma direção de luz (exemplo simples)
    gl.uniform3fv(uniformLocations.lightPosition, [100, 100, 100]);
    
    // Desenha o cubo (paredes)
    gl.drawElements(gl.TRIANGLES, cubeData.indices.length, gl.UNSIGNED_SHORT, 0);
  });
}

function renderFloor() {
    mat4.identity(modelMatrix);
    
    // posicionar o chão no centro do labirinto
    // o ultimo parametro 
    mat4.translate(modelMatrix, modelMatrix, [floorWidth / 2 - 0.5, -0.30, floorHeight / 2 - 0.5]);

    // Envia as matrizes para o shader
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(uniformLocations.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(uniformLocations.projMatrix, false, projMatrix);

    // Atributos de posição
    gl.bindBuffer(gl.ARRAY_BUFFER, floorPositionBuffer);
    gl.vertexAttribPointer(attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLocations.vertexPosition);

    // Atributos de normais
    gl.bindBuffer(gl.ARRAY_BUFFER, floorNormalBuffer);
    gl.vertexAttribPointer(attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLocations.vertexNormal);

    // Atributos de coordenadas de textura
    gl.bindBuffer(gl.ARRAY_BUFFER, floorTexCoordBuffer);
    gl.vertexAttribPointer(attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLocations.textureCoord);

    // Vincula o buffer de índices e a textura
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorIndexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.uniform1i(uniformLocations.uSampler, 0);

    // Define uma direção de luz (exemplo simples)
    gl.uniform3fv(uniformLocations.lightPosition, [100, 100, 100]);

    // Desenha o chão
    gl.drawElements(gl.TRIANGLES, floorData.indices.length, gl.UNSIGNED_SHORT, 0);
}

// Função para renderizar o jogador (a esfera)
// Aqui a implementação é similar, porém você poderá configurar os buffers da esfera
function renderPlayer() {
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix, modelMatrix, player.position);
  
  gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix);
  gl.uniformMatrix4fv(uniformLocations.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(uniformLocations.projMatrix, false, projMatrix);
  
  // Chame a função de desenho da esfera do jogador, se estiver implementada
  // Exemplo: player.draw(gl, shaderProgram, viewMatrix, projMatrix);
  player.draw(gl, shaderProgram, viewMatrix, projMatrix);
}

// Loop principal de renderização
function render() {
  updateCamera();
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
  // Atualiza o estado do jogo (verifica se o jogador chegou na saída)
  game.update();
  
  // Renderiza o labirinto e o jogador
  renderFloor();
  renderMaze();
  renderPlayer();
  
  if (!game.gameOver) {
    requestAnimationFrame(render);
  }
}

render();
