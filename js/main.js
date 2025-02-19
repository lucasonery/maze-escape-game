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
};

const livesDisplay = document.getElementById("livesDisplay");
const timerDisplay = document.getElementById("timerDisplay");

// Criação dos Buffers do Cubo (paredes do labirinto)
const cubeData = createCube(1);

// 🔹 Criando o buffer de vértices do cubo
const cubeVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.positions, gl.STATIC_DRAW);

// 🔹 Criando o buffer de normais do cubo
const cubeNormalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.normals, gl.STATIC_DRAW);

// 🔹 Criando o buffer de coordenadas UV do cubo
const cubeTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData.texCoords, gl.STATIC_DRAW);

// 🔹 Criando o buffer de índices do cubo
const cubeIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeData.indices, gl.STATIC_DRAW);

// Carrega a textura para as paredes do labirinto
const wallTexture = loadTexture(gl, "assets/textures/wall.png");

// carrega textura para jogador (esfera)
const playerTexture = loadTexture(gl, "assets/textures/player.jpg");

// Cria instâncias do labirinto, jogador e gerenciamento do jogo
const maze = new Maze();
const player = new Player();
player.texture = playerTexture;
const game = new Game(maze, player);

// Define uma rota fixa para o inimigo (um quadrado no labirinto)
const enemyRoute = [
  [3, 0, 3],
  [7, 0, 3],
  [7, 0, 7],
  [5, 0, 7],
  [5, 0, 5],
  [3, 0, 5],
  [3, 0, 7],
  [1, 0, 7],
  [1, 0, 3],
  [3, 0, 3]
];

// Cria o inimigo passando o contexto gl e a rota
const enemy = new Enemy(gl, enemyRoute);

const floorWidth = maze.grid[0].length;
const floorHeight = maze.grid.length;

// ***************
// Atualizações para multiplas fontes de luz
// ***************

// uniforms para as luzes
const uLightPositionsLoc = gl.getUniformLocation(shaderProgram, "uLightPositions");
const uLightColorsLoc = gl.getUniformLocation(shaderProgram, "uLightColors");
const uLightRadiiLoc = gl.getUniformLocation(shaderProgram, "uLightRadii");

const lightPositions = [
  [floorWidth / 2, 4.0, floorHeight / 2], // Luz central, acima do labirinto
  [2.0, 3.0, 2.0], // Luz 1
  [floorWidth - 2, 3.0, floorHeight - 2], // Luz 2
  [floorWidth - 2, 3.0, 2.0], // Luz 3
  [2.0, 3.0, floorHeight - 2], // Luz 4
]

const lightColors = [
  [1.0, 1.0, 1.0], // Luz branca
  [1.0, 0.0, 0.0], // Luz vermelha
  [0.0, 0.0, 1.0], // Luz azul
  [0.0, 1.0, 0.0], // Luz verde
  [1.0, 1.0, 0.0], // Luz amarela
]

const lightRadii = [6.0, 4.0, 4.0, 4.0, 4.0];

// função aux para transformar arrays 2D em Float32Array
function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

// envia as luzes para o shader
gl.uniform3fv(uLightPositionsLoc, flatten(lightPositions));
gl.uniform3fv(uLightColorsLoc, flatten(lightColors));
gl.uniform1fv(uLightRadiiLoc, lightRadii);

// ******************
// Buffers e dados do cubo (paredes do labirinto)
// ******************

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

// Função auxiliar que retorna uma posição válida para a câmera
// Ela percorre a reta entre playerPos e desiredPos, e verifica se há colisão com as paredes do labirinto
// cameraRadius define um buffer para câmera -> 0.2
function computeValidCameraPosition(playerPos, desiredPos, maze, cameraRadius) {
  let validPos = vec3.create();
  // começamos com a posição desejada e vamos retrocedendo até encontrar uma posição válida
  // usamos t = 1 para começar na posição desejada
  for (let t = 1; t >= 0; t -= 0.05) {
    vec3.lerp(validPos, playerPos, desiredPos, t);
    // verifica colisão usando projeção no plano XZ
    if (!maze.isColliding(validPos[0], validPos[2], cameraRadius)) {
      return validPos;
    }
  }
  // Se nenhum ponto for válido, retorna playerPos
  return playerPos;
}

function updateCamera() {
  // Vetor padrão de offset: quando o jogador está com rotation = 0, a câmera fica 2 unidades atrás (no sentido +Z)
  const defaultOffset = vec3.fromValues(0, 5, 10);
  
  // Cria uma matriz de rotação em torno do eixo Y, usando a rotação do jogador
  let rotationMatrix = mat4.create();
  mat4.fromYRotation(rotationMatrix, player.rotation);
  
  // Aplica a rotação ao vetor offset
  let rotatedOffset = vec3.create();
  vec3.transformMat4(rotatedOffset, defaultOffset, rotationMatrix);

  let desiredPos = vec3.create();
  vec3.add(desiredPos, player.position, rotatedOffset);

  // Calcula uma posição válida para a câmera, evitando que ela fique dentro de paredes
  let validCameraPos = computeValidCameraPosition(player.position, desiredPos, maze, 0.2);
  
  mat4.lookAt(viewMatrix, validCameraPos, player.position, [0, 1, 0]);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, wallNormalBuffer);
    gl.vertexAttribPointer(attribLocations.vertexNormal,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(attribLocations.vertexNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, wallTexCoordBuffer);
    gl.vertexAttribPointer(attribLocations.textureCoord,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(attribLocations.textureCoord);

    // Vincula o buffer de índices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallIndexBuffer);
    // 🔹 Declara as variáveis ANTES de usá-las!
    let vertexBufferSize = gl.getBufferParameter(gl.ARRAY_BUFFER,gl.BUFFER_SIZE);
    let indexBufferSize = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE);

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

  // atualiza tempo (em segundos) e exibe no display
  let elapsedSeconds = Math.floor((Date.now() - game.startTime) / 1000);

  // atualiza HUD
  livesDisplay.innerText = 'Vidas: ' + game.lives;
  timerDisplay.innerText = 'Tempo: ' + elapsedSeconds + 's';
  
  // Renderiza o labirinto e o jogador
  renderFloor();
  renderMaze();
  renderPlayer();

  // Atualiza e desenha o inimigo
  enemy.update();
  enemy.draw(gl, shaderProgram, viewMatrix, projMatrix);
  
  // Verifica colisão entre o jogador e o inimigo:
  let dx = player.position[0] - enemy.position[0];
  let dz = player.position[2] - enemy.position[2];
  let distance = Math.sqrt(dx * dx + dz * dz);
  // Supondo que ambos têm raio 0.5; colidem se a distância for menor que 1.0
  if (distance < 1.0) {
    game.lives--;
    if (game.lives <= 0) {
      alert("Game Over");
      game.gameOver = true;
    } else {
      // Reinicia o jogador à posição inicial (entrada do labirinto)
      player.position = [1, 0, 0];
    }
  }
  
  if (!game.gameOver) {
    requestAnimationFrame(render);
  }
}

render();
