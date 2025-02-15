class Player {
    constructor() {
      // Posição inicial ajustada conforme o layout do labirinto
      this.position = [1.5, 0.5, 1.5];
      // Velocidade de movimento
      this.speed = 0.1;
      // Cria a geometria da esfera para representar o jogador
      // (Utilizando a função createSphere definida em utils.js)
      this.geometry = createSphere(0.5, 20, 20);
    }
    
    // Método para mover o jogador, verificando colisões com o labirinto
    move(direction, maze) {
      let newPos = [...this.position];
      switch (direction) {
        case 'up':
          newPos[2] -= this.speed;
          break;
        case 'down':
          newPos[2] += this.speed;
          break;
        case 'left':
          newPos[0] -= this.speed;
          break;
        case 'right':
          newPos[0] += this.speed;
          break;
      }
      // Verifica se a nova posição colide com uma parede do labirinto
      if (!maze.isColliding(newPos[0], newPos[2])) {
        this.position = newPos;
      }
    }
    
    // Método para desenhar o jogador (a esfera)
    // Aqui você deverá configurar os buffers e enviar as matrizes para os shaders.
    // Este exemplo mostra apenas a preparação da matriz de modelo.
    draw(gl, shaderProgram, viewMatrix, projMatrix) {
      let modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, this.position);
      
      // Envio das matrizes para o shader (supondo que as locations já foram recuperadas)
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelMatrix"), false, modelMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uViewMatrix"), false, viewMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjMatrix"), false, projMatrix);
      
      // Aqui você deve configurar os atributos (posição, normais, texturas) usando this.geometry
      // e efetuar a chamada de desenho (por exemplo, gl.drawElements).
    }
  }
  
  window.Player = Player;
  