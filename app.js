// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Crear el renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añadir el renderizador al body del documento
document.body.appendChild(renderer.domElement);
// Crear el tablero de ajedrez
const boardGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const boardPiece = new THREE.Mesh(boardGeometry, boardMaterial);
        boardPiece.position.set(i - 3.5, 0, j - 3.5);
        scene.add(boardPiece);
    }
}
// Función para crear una pieza de ajedrez
function createPiece(color, position) {
    const pieceGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const pieceMaterial = new THREE.MeshStandardMaterial({ color: color });
    const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
    piece.position.set(position.x, 0.2, position.z);
    return piece;
}

// Crear piezas de ajedrez
const whitePiece = createPiece(0xffffff, { x: -2, z: -2 });
const blackPiece = createPiece(0x000000, { x: 2, z: 2 });

scene.add(whitePiece);
scene.add(blackPiece);
function animate() {
    requestAnimationFrame(animate);

    // Aquí puedes añadir animaciones o actualizaciones de la escena

    renderer.render(scene, camera);
}

animate();