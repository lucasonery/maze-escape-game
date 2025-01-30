export class Player {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Parâmetros de movimento
    this.speed = 5;
    this.velocity = { x: 0, z: 0 };
    this.direction = new THREE.Vector3();

    this.init();
  }

  init() {
    // Escuta eventos de teclado
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    window.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    window.addEventListener("keyup", (e) => this.onKeyUp(e), false);

    // Se quiser capturar movimento de mouse, pode usar PointerLockControls (Three.js)
    // ou implementar manualmente a rotação da câmera.
  }

  onKeyDown(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = true;
        break;
      default:
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = false;
        break;
      default:
        break;
    }
  }

  update(deltaTime) {
    // Movimentação simples
    const moveSpeed = this.speed * deltaTime;

    if (this.keys.forward) {
      this.camera.position.z -= moveSpeed;
    }
    if (this.keys.backward) {
      this.camera.position.z += moveSpeed;
    }
    if (this.keys.left) {
      this.camera.position.x -= moveSpeed;
    }
    if (this.keys.right) {
      this.camera.position.x += moveSpeed;
    }


    // Raycaster a partir do player (câmera) em direção ao movimento
    const raycaster = new THREE.Raycaster();
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.camera.quaternion).normalize();

    raycaster.set(this.camera.position, forward);
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const distance = intersects[0].distance;
      if (distance < 0.5) {
        // Muito perto de uma parede -> impede movimento à frente
        // Ex: redefinir camera.position para posição anterior
      }
    }
  }
}
