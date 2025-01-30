// src/scripts/game.js

import { Player } from "./player.js";
import { Maze } from "./maze.js";
import { Enemy } from "./enemy.js";
import { setupUI, updateUI } from "./ui.js";

export class Game {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.player = null;
    this.enemies = [];

    this.clock = null; // Para controlar deltaTime
    this.maze = null;
  }

  init() {
    // Configuração inicial do Three.js
    this.scene = new THREE.Scene();
    // Pode adicionar uma luz de ambiente
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Cria e posiciona câmera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 5); // Ajuste conforme necessidade

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document
      .getElementById("gameContainer")
      .appendChild(this.renderer.domElement);

    // Controles de resize
    window.addEventListener("resize", () => {
      this.onWindowResize();
    });

    // Setup UI
    setupUI();

    // Clock
    this.clock = new THREE.Clock();

    // Cria o jogador
    this.player = new Player(this.scene, this.camera);

    // Cria o labirinto
    this.maze = new Maze(this.scene);

    // Adiciona inimigos de exemplo
    const enemy1 = new Enemy(this.scene, { x: 5, y: 0, z: 5 });
    this.enemies.push(enemy1);

    // Outras configurações: iluminação, skybox, etc.
    this.addLights();
  }

  addLights() {
    // Exemplo de luz direcional
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10).normalize();
    this.scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Mais forte
    this.scene.add(ambientLight);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    const deltaTime = this.clock.getDelta();

    // Atualiza jogador
    this.player.update(deltaTime);

    // Atualiza inimigos
    for (let enemy of this.enemies) {
      enemy.update(deltaTime, this.player);
    }

    // Atualiza UI
    updateUI(this);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
