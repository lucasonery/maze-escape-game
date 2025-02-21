// js/maze.js

class Maze {
  constructor() {
    // Definindo um labirinto 11x11
    // 1 representa parede e 0 caminho.
    // Neste exemplo:
    // - A entrada é definida na primeira linha (linha 0), coluna 1 (valor 0).
    // - A saída é definida na última linha (linha 10), coluna 9 (valor 0).
    this.grid = [
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
    ];
    
    // Cada célula possui um tamanho de 1 unidade.
    this.cellSize = 1;
  }
  
  // Retorna um array com as posições (x, y, z) das paredes
  getWallPositions() {
    const positions = [];
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 1) {
          // Calcula o centro da célula
          positions.push([
            col * this.cellSize,
            0,
            row * this.cellSize
          ]);
        }
      }
    }
    return positions;
  }
  
  // Verifica a colisão entre um círculo (projeção do jogador em XZ com centro (x,z) e raio) 
  // e as paredes (representadas por quadrados centrados em cada célula de valor 1).
  isColliding(x, z, radius) {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 1) {
          // Centro da célula
          let cellCenterX = col * this.cellSize;
          let cellCenterZ = row * this.cellSize;
          let halfSize = this.cellSize / 2;
          
          // Encontra o ponto mais próximo do círculo dentro do quadrado da parede
          let closestX = Math.max(cellCenterX - halfSize, Math.min(x, cellCenterX + halfSize));
          let closestZ = Math.max(cellCenterZ - halfSize, Math.min(z, cellCenterZ + halfSize));
          
          // Calcula a distância entre o centro do círculo e o ponto mais próximo
          let dx = x - closestX;
          let dz = z - closestZ;
          if ((dx * dx + dz * dz) < (radius * radius)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

window.Maze = Maze;
