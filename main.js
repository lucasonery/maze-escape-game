import { Game } from "./src/scripts/game.js";

let game;

window.onload = () => {
  // Cria e inicia o jogo
  game = new Game();
  game.init();

  // Inicia o loop de renderização
  animate();
};

function animate() {
  requestAnimationFrame(animate);
  game.update();
  game.render();
}
