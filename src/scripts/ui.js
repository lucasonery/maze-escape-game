let hud;

export function setupUI() {
  hud = document.createElement("div");
  hud.id = "hud";
  hud.innerHTML = `
    <span id="timer">Tempo: 0s</span>
    <span id="items">Itens: 0</span>
    <span id="status">Status: Livre</span>
  `;
  document.getElementById("gameContainer").appendChild(hud);
}

export function updateUI(game) {
  const elapsed = Math.floor(game.clock.getElapsedTime());
  document.getElementById("timer").textContent = `Tempo: ${elapsed}s`;

  // Se quiser exibir itens, crie uma variável ou método em Player
  // document.getElementById('items').textContent = `Itens: ${game.player.itemsColetados}`;

  // Exemplo de status de perseguição:
  const beingChased = game.enemies.some((enemy) => enemy.state === "chase");
  document.getElementById("status").textContent = `Status: ${
    beingChased ? "Perseguido!" : "Livre"
  }`;
}
