var scene, camera, renderer;
var stats;

function init() {
  // stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  document.body.appendChild( stats.domElement );

  // Three.js basics
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // lights
  var light = new THREE.PointLight(0xffffff, 1, 20);
  light.position.set(0, 5, 5);
  var light2 = new THREE.AmbientLight(0x111111);
  scene.add(light, light2);

  // objects
  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 4;

  // render
  var render = function () {
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;
    renderer.render(scene, camera);

    stats.update();

    // loop
    requestAnimationFrame(render);
  };
  render();
}

// start on load.
window.onload = init;
