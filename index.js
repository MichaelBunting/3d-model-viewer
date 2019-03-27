import * as Three from 'three';
window.THREE = Three;
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/MTLLoader');
require('three/examples/js/controls/OrbitControls');

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  1,
  1000,
);
const controls = new THREE.OrbitControls(camera);
camera.position.set(0, 0, 10);
controls.minDistance = 5;
controls.maxDistance = 15;
controls.update();

const renderer = new Three.WebGLRenderer();
renderer.setClearColor('#fff');
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new Three.DirectionalLight(0xffffff, .9);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('./models/coffee cup.mtl', (materials) => {
  materials.preload();

  const objectLoader = new THREE.OBJLoader();
  objectLoader.setMaterials(materials);
  objectLoader.load('./models/coffee cup.obj', (obj) => {
    const box = new Three.Box3().setFromObject(obj);
    const height = (box.max.y + box.min.y) * 100;
    const maxHeight = window.innerHeight * .5;
    const scaleVal = maxHeight / height;

    obj.scale.set(scaleVal, scaleVal, scaleVal);

    box.getCenter(obj.position);
    obj.position.multiplyScalar(-scaleVal);

    const pivot = new Three.Object3D();
    pivot.add(obj);

    scene.add(pivot);
  }, undefined, (err) => {
    console.error('Error loading object: ', err);
  });
}, undefined, (err) => {
  console.error('Error loading materials: ', err);
});

// const textureLoader = new Three.TextureLoader();
// const map = textureLoader.load('./models/wood.jpg');
// const material = new Three.MeshLambertMaterial({ map });

// const objectLoader = new THREE.OBJLoader();
// objectLoader.load('./models/coffee cup.obj', (obj) => {
//   const box = new Three.Box3().setFromObject(obj);
//   const height = (box.max.y + box.min.y) * 100;
//   const maxHeight = window.innerHeight * .5;
//   const scaleVal = maxHeight / height;

//   obj.scale.set(scaleVal, scaleVal, scaleVal);

//   box.getCenter(obj.position);
//   obj.position.multiplyScalar(-scaleVal);

//   obj.traverse((node) => {
//     if (node.material) node.material = material;
//   });

//   const pivot = new Three.Object3D();
//   pivot.add(obj);

//   scene.add(pivot);
// }, undefined, (err) => {
//   console.error('Error loading object: ', err);
// });

const render = () => {
  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(render);
}

render();