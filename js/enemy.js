// js/enemy.js

class Enemy {
    constructor(gl, route) {
      this.gl = gl;
      this.route = route; // Array de posições [x, y, z] que definem a rota
      this.currentTargetIndex = 0;
      this.speed = 0.01; // velocidade do inimigo
      // Inicia no primeiro ponto da rota:
      this.position = vec3.clone(this.route[0]);
      // Cria a geometria da esfera (usando a função createSphere do utils.js)
      this.geometry = createSphere(0.30, 16, 16);
      // Cria uma textura vermelha (1x1 vermelho)
      this.texture = this.createSolidColorTexture(gl, [255, 0, 0, 255]);
    }
    
    // Cria uma textura de cor sólida a partir de um array [r,g,b,a]
    createSolidColorTexture(gl, colorArray) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const pixel = new Uint8Array(colorArray);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      return texture;
    }
    
    update() {
      // Define o ponto de destino atual na rota
      let target = this.route[this.currentTargetIndex];
      let currentPos = this.position;
      
      // Calcula a direção e a distância até o alvo
      let direction = vec3.create();
      vec3.subtract(direction, target, currentPos);
      let distance = vec3.length(direction);
      
      if (distance < 0.1) {
        // Se atingiu o alvo, passa para o próximo (cíclico)
        this.currentTargetIndex = (this.currentTargetIndex + 1) % this.route.length;
      } else {
        // Move em direção ao alvo
        vec3.normalize(direction, direction);
        let displacement = vec3.create();
        vec3.scale(displacement, direction, this.speed);
        vec3.add(this.position, this.position, displacement);
      }
    }
    
    draw(gl, shaderProgram, viewMatrix, projMatrix) {
      // Cria a matriz de modelo para o inimigo
      let modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, this.position);
      
      // Envia as matrizes para o shader
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelMatrix"), false, modelMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uViewMatrix"), false, viewMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjMatrix"), false, projMatrix);
      
      // Cria e configura os buffers para a esfera do inimigo
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
      
      // Vincula a textura vermelha do inimigo
      let samplerLoc = gl.getUniformLocation(shaderProgram, "uSampler");
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(samplerLoc, 0);
      
      gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }
  
  window.Enemy = Enemy;
  