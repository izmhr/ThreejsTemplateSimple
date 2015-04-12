// based on the article
// http://www.atmarkit.co.jp/ait/articles/1211/26/news012.html

// SHADER_LOADER
// http://ics-web.jp/lab/archives/3228

var scene, camera, renderer;
var stats;

var vs, fs;

function preload(){
  // シェーダーファイルのプリロード
  SHADER_LOADER.load( function(data) {
    // 'myShader'は'index.html,scriptタグのdata-name'で指定したもの
    vs = data.myShader.vertex;
    fs = data.myShader.fragment;

    // three.jsの初期化処理を行う
    init();
  });
}

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

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  checkVersion();
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

  // material for particles
  var texture  = THREE.ImageUtils.loadTexture('image/particle.png');
  var material2 = new THREE.ShaderMaterial({
    // preloaded shader scripts
    vertexShader: vs,
    fragmentShader: fs,
    uniforms: {
      time: { type: 'f', value: 0 },
      size: { type: 'f', value: 0.13 },
      color: { type: 'c', value: new THREE.Color(0xffcc88) },
      texture: { type: 't', value: texture }
    },
    attributes: {
      lifetime: { type:'f',  value: [] },
      shift: { type:'f',  value: [] }
    },

    // 通常マテリアルのパラメータ
    // http://threejs.org/docs/#Reference/Materials/Material
    blending: THREE.AdditiveBlending, transparent: true, depthTest: false
  });

  // (3) 形状データを作成（同時に追加の頂点情報を初期化）
  var geometry   = new THREE.Geometry();
  var attributes = material2.attributes;
  var numParticles = 100000;
  for(var i = 0 ; i < numParticles ; i++) {
    var a = Math.PI * 2 * Math.random();
    var d = 8 + Math.random() * 8;
    geometry.vertices.push(new THREE.Vector3( Math.sin(a)*d, 3 + Math.random() * 2, Math.cos(a)*d ));

    // 追加の頂点情報を初期化
    attributes.lifetime.value.push(3 + Math.random());
    attributes.shift.value.push(Math.random());
  }

  // 物体を作成
  // var mesh = new THREE.ParticleSystem(geometry, material);
  var mesh = new THREE.PointCloud(geometry, material2);
  mesh.position = new THREE.Vector3(0, 0, 0);
  mesh.sortParticles = false;
  scene.add(mesh);

  // camera.position = new THREE.Vector3(0, 0, 5.0);
  camera.position.set(0, 3, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // render
  var baseTime = (new Date()).getTime();
  var render = function () {
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;
    material2.uniforms.time.value = ((new Date()).getTime() - baseTime) / 1000;

    renderer.render(scene, camera);

    stats.update();

    // loop
    requestAnimationFrame(render);
  };
  render();
}

function checkVersion() {
  var _gl = renderer.context;
  console.log( _gl.getParameter(_gl.VERSION) );
  console.log( _gl.getParameter(_gl.SHADING_LANGUAGE_VERSION) );
}

// start on load.
window.onload = preload;
