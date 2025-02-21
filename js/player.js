class Player {
    constructor() {
      // Posição inicial ajustada conforme o layout do labirinto
      this.position = [1, -0.15, 0];
      // Velocidade de movimento
      this.speed = 0.1;
      // Rotação do jogador (em radianos)
      this.rotation = Math.PI;
      // Angulo de rolagem do jogador
      this.rollAngle = 0;
      // Cria a geometria da esfera para representar o jogador
      // (Utilizando a função createSphere definida em utils.js)
      this.geometry = createSphere(0.15, 20, 20);
    }
    
    // Método para mover o jogador, verificando colisões com o labirinto
    move(direction, maze) {
      if (direction === "up") {
        // Calcula o vetor forward (para frente) na base da rotação atual
        let forward = vec3.fromValues(0, 0, -1);
        let rotationMatrix = mat4.create();
        mat4.fromYRotation(rotationMatrix, this.rotation);
        vec3.transformMat4(forward, forward, rotationMatrix);
        
        // Calcula a nova posição avançando no sentido forward
        let newPos = [
          this.position[0] + forward[0] * this.speed,
          this.position[1],
          this.position[2] + forward[2] * this.speed
        ];
        
        // Verifica colisão com paredes usando o raio da esfera (0.2)
        if (!maze.isColliding(newPos[0], newPos[2], 0.15)) {
          this.position = newPos;
          // atualiza o angulo de rolagem
          this.rollAngle -= this.speed / 0.5;
        }
        
      } else if (direction === "down") {
        // Calcula o vetor backward (para trás) baseado na rotação atual
        let backward = vec3.fromValues(0, 0, 1);
        let rotationMatrix = mat4.create();
        mat4.fromYRotation(rotationMatrix, this.rotation);
        vec3.transformMat4(backward, backward, rotationMatrix);
        
        let newPos = [
          this.position[0] + backward[0] * this.speed,
          this.position[1],
          this.position[2] + backward[2] * this.speed
        ];
        
        if (!maze.isColliding(newPos[0], newPos[2], 0.15)) {
          this.position = newPos;
          // Para movimento para trás, o angulo de rolagem é negativo
          this.rollAngle += this.speed / 0.5;
        }
        
      } else if (direction === "left") {
        // Girar para a esquerda: aumenta a rotação (em radianos)
        this.rotation += 0.1; // Ajuste o incremento conforme necessário
        
      } else if (direction === "right") {
        // Girar para a direita: diminui a rotação
        this.rotation -= 0.1;
      }
    }
    
    // Método para desenhar o jogador (a esfera)
    // Aqui você deverá configurar os buffers e enviar as matrizes para os shaders.
    // Este exemplo mostra apenas a preparação da matriz de modelo.
    draw(gl, shaderProgram, viewMatrix, projMatrix) {
      let modelMatrix = mat4.create();
      // Translada para a posição do jogador
      mat4.translate(modelMatrix, modelMatrix, this.position);
      // Aplica a rotação (orientação) do jogador
      mat4.rotateY(modelMatrix, modelMatrix, this.rotation);
      // Aplica o efeito de rolagem
      mat4.rotate(modelMatrix, modelMatrix, this.rollAngle, [1, 0, 0]);
      
      // Envia as matrizes para os shaders
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelMatrix"), false, modelMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uViewMatrix"), false, viewMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjMatrix"), false, projMatrix);
      
      // Cria e vincula os buffers para a esfera
      const spherePosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, spherePosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.positions, gl.STATIC_DRAW);
      const posLocation = gl.getAttribLocation(shaderProgram, "aPosition");
      gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLocation);
      
      const sphereNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.normals, gl.STATIC_DRAW);
      const normLocation = gl.getAttribLocation(shaderProgram, "aNormal");
      gl.vertexAttribPointer(normLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(normLocation);
      
      const sphereTexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.texCoords, gl.STATIC_DRAW);
      const texLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");
      gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texLocation);
      
      const sphereIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indices, gl.STATIC_DRAW);
      
      // Vincula a textura exclusiva do jogador
      let samplerLoc = gl.getUniformLocation(shaderProgram, "uSampler");
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(samplerLoc, 0);
      
      // Desenha a esfera
      gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }
  
  window.Player = Player;
  