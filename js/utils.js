// Função para compilar um shader a partir do código fonte e do tipo (VERTEX/FRAGMENT)
function compileShader(gl, shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Erro ao compilar o shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  
  // Função para criar um programa de shaders unindo vertex e fragment shaders
  function createShaderProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Erro ao linkar o programa:', gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }
  
  // Função para gerar os dados de uma esfera (vértices, normais, coordenadas de textura e índices)
  function createSphere(radius, latBands, longBands) {
    const positions = [];
    const normals = [];
    const texCoords = [];
    const indices = [];
  
    for (let latNumber = 0; latNumber <= latBands; latNumber++) {
      const theta = latNumber * Math.PI / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
  
      for (let longNumber = 0; longNumber <= longBands; longNumber++) {
        const phi = longNumber * 2 * Math.PI / longBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
  
        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const u = 1 - (longNumber / longBands);
        const v = 1 - (latNumber / latBands);
  
        normals.push(x, y, z);
        texCoords.push(u, v);
        positions.push(radius * x, radius * y, radius * z);
      }
    }
  
    for (let latNumber = 0; latNumber < latBands; latNumber++) {
      for (let longNumber = 0; longNumber < longBands; longNumber++) {
        const first = (latNumber * (longBands + 1)) + longNumber;
        const second = first + longBands + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }
  
    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      texCoords: new Float32Array(texCoords),
      indices: new Uint16Array(indices)
    };
  }
  
  // Função para gerar os dados de um cubo com normais e coordenadas de textura
  // js/utils.js

function createCube(size) {
  const half = size / 2;
  
  const positions = [
    // Front face (olhando para +Z)
    -half, -half,  half,
     half, -half,  half,
     half,  half,  half,
    -half,  half,  half,
    
    // Back face (olhando para -Z)
    -half, -half, -half,
    -half,  half, -half,
     half,  half, -half,
     half, -half, -half,
    
    // Top face (olhando para +Y)
    -half,  half, -half,
    -half,  half,  half,
     half,  half,  half,
     half,  half, -half,
    
    // Bottom face (olhando para -Y)
    -half, -half, -half,
     half, -half, -half,
     half, -half,  half,
    -half, -half,  half,

    // Right face (olhando para +X)
     half, -half, -half,
     half,  half, -half,
     half,  half,  half,
     half, -half,  half,
    
    // Left face (olhando para -X)
    -half, -half, -half,
    -half, -half,  half,
    -half,  half,  half,
    -half,  half, -half,
  ];

  const normals = [
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ];

  // UVs ajustados para cada face:
  const texCoords = [
    // Front face: mapeamento padrão
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    // Back face: inverte horizontalmente para que a textura não fique "espelhada"
    1, 0,
    0, 0,
    0, 1,
    1, 1,

    // Top face: pode ser rotacionado se desejar
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    // Bottom face: similar à top (ou invertido se preferir)
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    // Right face: mapeamento padrão
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    // Left face: inverte horizontalmente
    1, 0,
    0, 0,
    0, 1,
    1, 1,
  ];

  const indices = [
    0, 1, 2,   0, 2, 3,        // Front
    4, 5, 6,   4, 6, 7,        // Back
    8, 9, 10,  8, 10, 11,      // Top
    12, 13, 14, 12, 14, 15,     // Bottom
    16, 17, 18, 16, 18, 19,     // Right
    20, 21, 22, 20, 22, 23      // Left
  ];
  
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

  // Função para gerar os dados de um plano
  function createPlane(width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    // O plano está no eixo XZ, com Y fixo em 0
    const positions = [
      -halfWidth, 0, -halfHeight,
       halfWidth, 0, -halfHeight,
       halfWidth, 0,  halfHeight,
      -halfWidth, 0,  halfHeight,
    ];

    // Normais apontando para cima (eixo Y)
    const normals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ];
    
    // Coordenadas de textura (mapear toda a textura no plano)
    const texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ];

    // Índices para os dois triângulos do plano
    const indices = [
      0, 1, 2,
      0, 2, 3
    ];

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      texCoords: new Float32Array(texCoords),
      indices: new Uint16Array(indices)
    };
  }



  // Função para carregar uma textura a partir de uma URL e configurá-la para uso no WebGL
  function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Define uma textura 1x1 branca inicialmente
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    // Carrega a imagem da textura
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
      // Se a imagem tiver dimensões potência de 2, gera mipmaps
      if ((image.width & (image.width - 1)) === 0 &&
          (image.height & (image.height - 1)) === 0) {
        gl.textParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.textParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // Caso contrário, define parâmetros para evitar repetição
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
    return texture;
  }
