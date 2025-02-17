class Player {
    constructor() {
      // Posição inicial ajustada conforme o layout do labirinto
      this.position = [1, 0, 1.5];
      // Velocidade de movimento
      this.speed = 0.1;

      // Rotação do jogador (em radianos)
      this.rotation = 0;
      // Cria a geometria da esfera para representar o jogador
      // (Utilizando a função createSphere definida em utils.js)
      this.geometry = createSphere(0.30, 20, 20);
    }
    
    // Método para mover o jogador, verificando colisões com o labirinto
    move(direction, maze) {
      let newPos = [...this.position];
      let newRotation = this.rotation;
      switch (direction) {
        case 'up':
          newPos[2] -= this.speed;
          newRotation = 0; //olhando para -z
          break;
        case 'down':
          newPos[2] += this.speed;
          newRotation = Math.PI; //olhando para +z
          break;
        case 'left':
          newPos[0] -= this.speed;
          newRotation = Math.PI / 2; //olhando para -x
          break;
        case 'right':
          newPos[0] += this.speed;
          newRotation = -Math.PI / 2; //olhando para +x
          break;
      }
      // Verifica se a nova posição colide com uma parede do labirinto
      if (!maze.isColliding(newPos[0], newPos[2], 0.3)) {
        this.position = newPos;
        this.rotation = newRotation;
      }
    }
    
    // Método para desenhar o jogador (a esfera)
    // Aqui você deverá configurar os buffers e enviar as matrizes para os shaders.
    // Este exemplo mostra apenas a preparação da matriz de modelo.
    draw(gl, shaderProgram, viewMatrix, projMatrix) {
      // Cria a matriz de modelo para posicionar a esfera no mundo
      let modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, this.position);
      
      // Envia as matrizes para os shaders
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelMatrix"), false, modelMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uViewMatrix"), false, viewMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjMatrix"), false, projMatrix);
      
      // Criação e configuração dos buffers usando os dados da esfera
      // Buffer de posições
      const spherePosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, spherePosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.positions, gl.STATIC_DRAW);
      const posLocation = gl.getAttribLocation(shaderProgram, "aPosition");
      gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLocation);
      
      // Buffer de normais
      const sphereNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.normals, gl.STATIC_DRAW);
      const normLocation = gl.getAttribLocation(shaderProgram, "aNormal");
      gl.vertexAttribPointer(normLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(normLocation);
      
      // Buffer de coordenadas de textura
      const sphereTexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.texCoords, gl.STATIC_DRAW);
      const texLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");
      gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texLocation);
      
      // Buffer de índices
      const sphereIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indices, gl.STATIC_DRAW);
      
      // Efetua o desenho da esfera
      gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }
  
  window.Player = Player;
  