// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import { TWEEN } from "../lib/tween.module.min.js";
import { GUI } from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController;
let tablero, fichas = [];
const piezasAjedrez = [
    "peonNegro1",
    "peonNegro2",
    "peonNegro3",
    "peonNegro4",
    "peonNegro5",
    "peonNegro6",
    "peonNegro7",
    "peonNegro8",
    "peonBlanco1",
    "peonBlanco2",
    "peonBlanco3",
    "peonBlanco4",
    "peonBlanco5",
    "peonBlanco6",
    "peonBlanco7",
    "peonBlanco8",
    "torreNegra",
    "torreNegra2",
    "torreBlanca",
    "torreBlanca2",
    "caballoNegro",
    "caballoNegro2",
    "caballoBlanco",
    "caballoBlanco2",
    "alfilNegro",
    "alfilNegro2",
    "alfilBlanco",
    "alfilBlanco2",
    "reinaNegra",
    "reinaBlanca",
    "reyNegro",
    "reyBlanco"
];
const casillaSize = 1;


console.log(piezasAjedrez);


// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7FFF00);

    // Instanciar la camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(0, 5, 10);
    // Instanciar un control de orbitacion para poder verlo desde cualquier punto
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    // Situamos la camara al mismo punto, (el manejador y la posicion inicial de la camara)
    camera.lookAt(0, 0, 0);
}

// Carga de la escena
function loadScene() {
    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);
    // Material para el tablero
    const tableroMaterialBlanco = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const tableroMaterialNegro = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Geometria del tablero
    const tableroGeometry = new THREE.BoxGeometry(casillaSize, 0.1, casillaSize);

    // Creacion del tablero
    tablero = new THREE.Group();
    for (let fila = 0; fila < 8; fila++) {
        for (let columna = 0; columna < 8; columna++) {
            const material = (fila + columna) % 2 === 0 ? tableroMaterialBlanco : tableroMaterialNegro;
            const casilla = new THREE.Mesh(tableroGeometry, material);
            casilla.position.set(columna * casillaSize - 3.5, 0, fila * casillaSize - 3.5);
            tablero.add(casilla);
        }
    }
    scene.add(tablero);

    // Carga de las fichas
    const loader = new GLTFLoader();

    loader.load('models/trophy.glb', function (gltf) {
        const trofeo = gltf.scene;
        const scale = 0.6; // Ajustamos la escala para que quepa en una casilla
        trofeo.scale.set(scale, scale, scale);
        trofeo.position.set(-15, 0, 1);
        //trofeo.rotation.y = Math.PI / 2; // Ajusta la rotación según sea necesario
        scene.add(trofeo);


    });

    loader.load('models/peon.glb', function (gltf) {
        const peonNegro = gltf.scene;
        const scale = 0.02; // Ajustamos la escala para que quepa en una casilla
        peonNegro.scale.set(scale, scale, scale);
        peonNegro.position.set(0, 0, -2.5);
        //scene.add(peonNegro);
        fichas.push(peonNegro); // Clonamos la ficha para el resto de peones
        for (let i = 0; i < 8; i++) {
            const peonNegroX = peonNegro.clone();
            peonNegroX.position.z = -2.5;
            peonNegroX.name = "peonNegro" + i;
            peonNegroX.position.x = i - 3.5;
            peonNegroX.traverse(function (child) {
                if (child.isMesh) {
                    // Crear un nuevo material con color negro
                    // Configurar las propiedades del material para que genere y reciba sombras
                    child.castShadow = true;
                    child.receiveShadow = true;

                    // Crear un nuevo material Lambert con color negro
                    var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                    // Asignar el nuevo material a la malla
                    child.material = material;
                }
            });
            scene.add(peonNegroX);
            fichas.push(peonNegroX);
            console.log(peonNegroX);

        }
        const peonBlanco = peonNegro.clone()

        for (let i = 0; i < 8; i++) {
            const peonBlancoX = peonBlanco.clone();
            peonBlancoX.position.z = 2.5;
            peonBlancoX.position.x = i - 3.5;
            peonBlancoX.name = "peonBlanco" + i;
            scene.add(peonBlancoX);
            fichas.push(peonBlancoX);
            console.log(peonBlancoX)
        }
    });
    loader.load('models/torre.glb', function (gltf) {
        const torreNegra = gltf.scene;
        const scale = 0.2; // Ajustamos la escala para que quepa en una casilla
        torreNegra.scale.set(scale, scale, scale);
        torreNegra.position.set(-3.5, 0.5, -3.5);
        torreNegra.name = "torreNegra";
        torreNegra.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });

        scene.add(torreNegra);
        fichas.push(torreNegra);

        const torreNegra2 = torreNegra.clone();
        torreNegra2.position.set(3.5, 0.5, -3.5);
        torreNegra2.name = "torreNegra2";
        scene.add(torreNegra2);
        fichas.push(torreNegra2);

        const torreBlanca = torreNegra.clone();
        torreBlanca.position.set(-3.5, 0.5, 3.5);
        torreBlanca.name = "torreBlanca";
        torreBlanca.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0xffffff });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        scene.add(torreBlanca);
        fichas.push(torreBlanca);

        const torreBlanca2 = torreBlanca.clone();
        torreBlanca2.position.set(3.5, 0.5, 3.5);
        torreBlanca2.name = "torreBlanca2";

        scene.add(torreBlanca2);
        fichas.push(torreBlanca2);
    });

    // Cargar el caballo
    loader.load('models/caballo.glb', function (gltf) {
        const caballoNegro = gltf.scene;
        const scale = 0.2; // Ajustamos la escala para que quepa en una casilla
        caballoNegro.scale.set(scale, scale, scale);
        caballoNegro.position.set(-2.5, 0.5, -3.5);
        caballoNegro.name = "caballoNegro";
        caballoNegro.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });

        scene.add(caballoNegro);
        fichas.push(caballoNegro);

        const caballoNegro2 = caballoNegro.clone(true);
        caballoNegro2.position.set(2.5, 0.5, -3.5);
        caballoNegro2.name = "caballoNegro2";

        scene.add(caballoNegro2);
        fichas.push(caballoNegro2);

        const caballoBlanco = caballoNegro.clone(true);
        caballoBlanco.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0xffffff });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        caballoBlanco.scale.set(scale, scale, scale);
        caballoBlanco.position.set(2.5, 0.45, 3.5);
        caballoBlanco.name = "caballoBlanco";

        scene.add(caballoBlanco);
        fichas.push(caballoBlanco);

        const caballoBlanco2 = caballoBlanco.clone(true);
        caballoBlanco2.position.set(-2.5, 0.45, 3.5);
        caballoBlanco2.name = "caballoBlanco2";

        scene.add(caballoBlanco2);
        fichas.push(caballoBlanco2);
    });

    // Cargar el alfil
    loader.load('models/alfil.glb', function (gltf) {
        const alfilNegro = gltf.scene;
        const scale = 0.25; // Ajustamos la escala para que quepa en una casilla
        alfilNegro.scale.set(scale, scale, scale);
        alfilNegro.position.set(-1.5, 0.4, -3.5);
        alfilNegro.name = "alfilNegro";
        alfilNegro.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        scene.add(alfilNegro);
        fichas.push(alfilNegro);

        const alfilNegro2 = alfilNegro.clone(true);
        alfilNegro2.scale.set(scale, scale, scale);
        alfilNegro2.position.set(1.5, 0.4, -3.5);
        alfilNegro2.name = "alfilNegro2";

        scene.add(alfilNegro2);
        fichas.push(alfilNegro2);

        const alfilBlanco = alfilNegro.clone(true);
        alfilBlanco.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0xffffff });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        alfilBlanco.scale.set(scale, scale, scale);
        alfilBlanco.position.set(1.5, 0.45, 3.5);
        alfilBlanco.name = "alfilBlanco";

        scene.add(alfilBlanco);
        fichas.push(alfilBlanco);

        const alfilBlanco2 = alfilBlanco.clone(true);
        alfilBlanco2.scale.set(scale, scale, scale);
        alfilBlanco2.position.set(-1.5, 0.45, 3.5);
        alfilBlanco2.name = "alfilBlanco2";

        scene.add(alfilBlanco2);
        fichas.push(alfilBlanco2);
    });


    loader.load('models/DEF_reina.glb', function (gltf) {
        const reinaNegra = gltf.scene;
        const scale = 11; // Ajustamos la escala para que quepa en una casilla
        reinaNegra.scale.set(scale, scale, scale);
        reinaNegra.position.set(-0.5, -0.8, -3.5);
        reinaNegra.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });


        const reinaBlanca = reinaNegra.clone(true);
        reinaBlanca.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0xffffff });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        reinaBlanca.scale.set(scale, scale, scale);
        reinaBlanca.position.set(-0.5, -0.8, 3.5);
        reinaBlanca.name = "reinaBlanca";
        reinaNegra.name = "reinaNegra";
        scene.add(reinaNegra);
        fichas.push(reinaNegra);
        scene.add(reinaBlanca);
        fichas.push(reinaBlanca);
    });

    // Cargar el rey
    loader.load('models/rey.glb', function (gltf) {
        const reyNegro = gltf.scene;
        const scale = 0.5; // Ajustamos la escala para que quepa en una casilla
        reyNegro.scale.set(scale, scale, scale);
        reyNegro.position.set(0.5, 0.75, -3.5);
        reyNegro.name = "reyNegro";
        reyNegro.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0x2f1e1e });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        scene.add(reyNegro);
        fichas.push(reyNegro);

        const reyBlanco = reyNegro.clone();
        reyBlanco.traverse(function (child) {
            if (child.isMesh) {
                // Crear un nuevo material con color negro
                // Configurar las propiedades del material para que genere y reciba sombras
                child.castShadow = true;
                child.receiveShadow = true;

                // Crear un nuevo material Lambert con color negro
                var material = new THREE.MeshLambertMaterial({ color: 0xffffff });

                // Asignar el nuevo material a la malla
                child.material = material;
            }
        });
        reyBlanco.position.set(0.5, 0.75, 3.5);
        reyBlanco.name = "reyBlanco";

        scene.add(reyBlanco);
        fichas.push(reyBlanco);
    });

    /*const mesaTextureLoader = new THREE.TextureLoader();
    const mesaTexture = mesaTextureLoader.load('models/textura.jpg'); // Ruta de la textura de la mesa
*/
    loader.load('models/mesa.glb', function (gltf) {
        const mesa = gltf.scene;
        const scale = 0.06;
        mesa.scale.set(scale, scale, scale);
        mesa.position.set(0.5, -2.5, 1.65);
        //const mesaMaterial = new THREE.MeshStandardMaterial({ map: mesaTexture });
        
        scene.add(mesa);
        fichas.push(mesa);
    });
    //});
}
//////RAYOS
// Función para crear y visualizar rayos desde cada pieza
// Función para visualizar la geometría de las piezas
fichas.forEach(pieza => {
    const geometria = pieza.geometry.clone(); // Clona la geometría de la pieza
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 1 }); // Material semitransparente para visualización
    const areaClickeable = new THREE.Mesh(geometria, material); // Crea un nuevo objeto Mesh
    areaClickeable.position.copy(pieza.position); // Establece la posición del área clickeable igual a la posición de la pieza
    scene.add(areaClickeable); // Añade el área clickeable a la escena
});


//////////RAYOS


function setupGUI() {
    // Definicion de los controles
    effectController = {
        mensaje: 'Tablero de Ajedrez 3D'
    };

    // Creacion interfaz
    const gui = new GUI();

    // Construccion del menu
    gui.add(effectController, "mensaje").name("Aplicacion");
}

function update() {
    // No se necesitan actualizaciones en este ejemplo
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}


/////////////////////////////////////
// Variables para el movimiento de la ficha
let selectedObject = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Obtener la posición del clic del mouse en coordenadas normalizadas (entre -1 y 1)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Crear un rayo desde la cámara
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera); // 'camera' es tu cámara en la escena

    // Calcular intersecciones entre el rayo y los objetos en la escena
    const intersects = raycaster.intersectObjects(scene.children, true); // 'scene' es tu escena

    // Si hay intersecciones, se ha hecho clic sobre algún objeto
    if (intersects.length > 0) {
        // La primera intersección representa el objeto más cercano al clic del mouse
        const objetoIntersectado = intersects[0].object;

        // Verificar si el objeto intersectado es una de las fichas de ajedrez
        objetoIntersectado.traverseAncestors(function (parent) {
            if (piezasAjedrez.includes(parent.name)) {
                // Lógica de movimiento para el peón
                const currentPosition = objetoIntersectado.position.clone();
                console.log(currentPosition);
                const newPosition = currentPosition.clone();

                // Obtener el nombre del peón clickeado
                const piezaNombre = parent.name;

                // Determinar el movimiento permitido para el peón según su color y posición
                let movimientoY = 0;
                if (piezaNombre.startsWith("peonNegro")) {
                    movimientoY = -casillaSize*50; // Movimiento hacia adelante para peones negros
                } else if (piezaNombre.startsWith("peonBlanco")) {
                    movimientoY = casillaSize*50; // Movimiento hacia adelante para peones blancos
                }

                // Actualizar la posición del peón solo si el movimiento es válido y la casilla destino está vacía
                if (movimientoY !== 0) {
                    newPosition.y += movimientoY;

                    // Verificar si la casilla destino está vacía
                    const isCasillaVacia = fichas.every(ficha => {
                        const distancia = ficha.position.distanceTo(newPosition);
                        return distancia > 49; // Ajusta este valor según la precisión que necesites
                    });

                    if (isCasillaVacia) {
                        // Mover la ficha a la nueva posición
                        objetoIntersectado.position.set(newPosition);
                        render();
                    } else {
                        console.log("Movimiento no válido: casilla ocupada");
                    }
                } else {
                    console.log("Movimiento no válido para este tipo de ficha");
                }
            }
        });
    }
}

// Agregar un evento de clic al documento
document.addEventListener('click', onMouseClick, false);
