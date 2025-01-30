// src/scripts/enemy.js

export class Enemy {
  constructor(scene, startPosition) {
    this.scene = scene;
    this.position = new THREE.Vector3(
      startPosition.x,
      startPosition.y,
      startPosition.z
    );
    this.speed = 2;

    // Estados possíveis: 'patrol', 'chase', 'return'
    this.state = "patrol";
    this.targetPathIndex = 0; // se tiver waypoints

    // Mesh representando o inimigo
    this.mesh = this.createMesh();
    this.scene.add(this.mesh);

    // Waypoints de exemplo (movimento em loop)
    this.waypoints = [new THREE.Vector3(5, 0, 5), new THREE.Vector3(5, 0, -5)];
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(this.position);
    return mesh;
  }

  update(deltaTime, player) {
    switch (this.state) {
      case "patrol":
        this.patrol(deltaTime);
        this.checkPlayerDistance(player);
        break;
      case "chase":
        this.chase(deltaTime, player);
        break;
      case "return":
        // Se quiser que ele volte à posição inicial
        this.returnToStart(deltaTime);
        break;
    }
  }

  patrol(deltaTime) {
    const currentTarget = this.waypoints[this.targetPathIndex];
    const direction = currentTarget.clone().sub(this.mesh.position);
    if (direction.length() < 0.1) {
      // Passa para o próximo waypoint
      this.targetPathIndex = (this.targetPathIndex + 1) % this.waypoints.length;
    } else {
      direction.normalize();
      this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
    }
  }

  chase(deltaTime, player) {
    const direction = player.camera.position.clone().sub(this.mesh.position);
    if (direction.length() < 0.5) {
      // Jogador capturado
      alert("Você foi pego!");
      // Reiniciar ou encerrar jogo
    } else {
      direction.normalize();
      this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
    }
  }

  checkPlayerDistance(player) {
    const dist = player.camera.position.distanceTo(this.mesh.position);
    if (dist < 3) {
      // Começa a perseguir
      this.state = "chase";
    }
  }

  returnToStart(deltaTime) {
    // Lógica para voltar para posição inicial, se necessário
  }
}
