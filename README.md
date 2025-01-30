# Maze Escape

**Maze Escape** é um jogo 3D em WebGL desenvolvido utilizando Three.js. O objetivo é explorar um labirinto, evitar inimigos e coletar itens, com controles de movimentação em primeira pessoa.

## Estrutura do Projeto

```bash
maze-escape
 ├── /src
 │    ├── /assets           # Modelos 3D, texturas, sons
 │    ├── /shaders          # Shaders personalizados
 │    ├── /scripts          # Scripts principais do jogo
 │    │    ├── game.js      # Controle principal do jogo
 │    │    ├── player.js    # Movimentação e interações do jogador
 │    │    ├── enemy.js     # IA dos inimigos
 │    │    ├── maze.js      # Geração e estrutura do labirinto
 │    │    ├── ui.js        # Interface do usuário (HUD)
 │    ├── /scenes           # Configurações de níveis do labirinto
 │    ├── /physics          # Sistema de colisão e detecção de objetos
 ├── index.html             # Página principal do jogo
 ├── styles.css             # Estilos para UI
 ├── main.js                # Entrada principal do jogo
 ├── package.json           # Dependências do projeto
```

## Tecnologias Utilizadas

- **Three.js**: Biblioteca para renderização 3D em WebGL.
- **JavaScript**: Linguagem de programação principal do projeto.
- **HTML/CSS**: Estrutura e estilização do jogo.
- **Live Server** (opcional): Para desenvolvimento local com recarregamento automático.

## Como Executar o Projeto

### 1. Instalar dependências

Certifique-se de ter o **Node.js** instalado. No terminal, rode o comando:

```bash
npm install
```

### 2. Iniciar o servidor local

```bash
npm run start
```

Isso abrirá automaticamente o jogo no navegador.

### 3. Alternativamente, abrir manualmente

Abra o arquivo `index.html` em um navegador compatível com WebGL (como Google Chrome).

## Controles do Jogo

- **W / S / A / D** ou **Setas**: Movimentar o jogador
- **Mouse**: Girar a câmera
- **Clique**: Ativar captura do mouse (Pointer Lock)

## Funcionalidades Principais

1. **Exploração em 3D:** O jogador pode navegar pelo labirinto em primeira pessoa.
2. **Movimentação com Colisão:** Implementação inicial de movimentação e detecção de paredes.
3. **IA de Inimigos:** Os inimigos patrulham o labirinto e perseguem o jogador quando detectado.
4. **HUD:** Mostra informações sobre o tempo de jogo e o status do jogador.

## Melhorias Futuras

- **Detecção de colisão aprimorada** para impedir atravessar paredes.
- **Geração procedural** de labirintos.
- **Itens coletáveis** e eventos de interação.
- **Shaders personalizados** para efeitos visuais.
- **Tela de menu** para iniciar e pausar o jogo.
