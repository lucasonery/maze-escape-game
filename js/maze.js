class Maze {
    constructor() {
      // Layout simples: 1 = parede, 0 = caminho
      this.grid = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      // Tamanho de cada célula do labirinto
      this.cellSize = 1;
    }
    
    // Retorna um array com as posições (x, y, z) das paredes
    getWallPositions() {
      const positions = [];
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          if (this.grid[row][col] === 1) {
            // Calcula a posição central da célula
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
    
    // Verifica se a posição (x, z) colide com uma parede
    isColliding(x, z) {
      const col = Math.floor(x / this.cellSize);
      const row = Math.floor(z / this.cellSize);
      
      // Se estiver fora dos limites, considera colisão
      if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
        return true;
      }
      
      return this.grid[row][col] === 1;
    }
  }
  
  window.Maze = Maze;
  