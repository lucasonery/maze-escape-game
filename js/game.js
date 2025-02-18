// Dependências: js/maze.js, js/player.js
// Descrição: Este script define a classe Game, responsável por gerenciar o estado do jogo.
// O jogo é finalizado quando o jogador alcança a saída do labirinto.
// O método update é chamado a cada frame para verificar se o jogador chegou à saída.
// O método addScore pode ser utilizado para incrementar a pontuação do jogador.
// O estado do jogo é verificado no loop principal do script main.js.

class Game {
    constructor(maze, player) {
      this.maze = maze;
      this.player = player;
      this.lives = 3;
      this.gameOver = false;
      // Define a posição de saída do labirinto (ajuste conforme o layout desejado)
      this.exitPosition = [maze.grid[0].length - 2, 0.5, maze.grid.length - 2];
    }
    
    // Atualiza o estado do jogo em cada frame
    update() {
      // Calcula a distância entre o jogador e a saída
      const dx = this.player.position[0] - this.exitPosition[0];
      const dz = this.player.position[2] - this.exitPosition[2];
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Se o jogador estiver próximo o suficiente da saída, finaliza o jogo
      if (distance < 0.5) {
        this.gameOver = true;
        alert("Parabéns! Você escapou do labirinto.");
      }
    }
    
    // Método para incrementar a pontuação (ex: ao coletar itens)
    addScore(points) {
      this.score += points;
    }
  }
  
  window.Game = Game;
  