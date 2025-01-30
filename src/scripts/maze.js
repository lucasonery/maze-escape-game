// src/scripts/maze.js

export class Maze {
  constructor(scene) {
    this.scene = scene;
    this.wallSize = 1;

    // Exemplo de layout (matriz 2D) [0: caminho, 1: parede]
    this.layout = [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
    ];

    this.createMaze();
  }

  createMaze() {
    const wallGeometry = new THREE.BoxGeometry(
      this.wallSize,
      this.wallSize,
      this.wallSize
    );
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });

    // Percorre a matriz e cria paredes
    for (let z = 0; z < this.layout.length; z++) {
      for (let x = 0; x < this.layout[z].length; x++) {
        if (this.layout[z][x] === 1) {
          const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
          wallMesh.position.set(
            x * this.wallSize,
            this.wallSize / 2,
            z * this.wallSize
          );
          this.scene.add(wallMesh);
        }
      }
    }
  }
}
