'use strict';

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

(function (THREE) {

  'use strict';

  var width = undefined;
  var height = undefined;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, 0.75, 0.1, 30);
  var r = new THREE.WebGLRenderer({ antialias: true });
  var dom = r.domElement;
  document.body.appendChild(dom);
  dom.style.position = 'absolute';
  dom.style.top = dom.style.left = 0;

  var resize = function resize() {
    height = window.innerHeight;
    width = window.innerWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    r.setSize(width, height);
  };
  window.addEventListener('resize', resize, false);
  resize();

  var mouse = { x: width * 0.5, y: height * 0.5 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, false);
  window.addEventListener('mouseout', function () {
    mouse.x = width * 0.5;
    mouse.y = height * 0.5;
  }, false);

  var geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
  var material = new THREE.MeshLambertMaterial({
    color: 15790246,
    shininess: 1,
    specular: 0,
    shading: THREE.FlatShading
  });

  var cubes = [true].reduce(function (ac, e) {
    while (ac.length < 650) {
      ac.push(e);
    }
    return ac;
  }, [])
  //.fill(true)
  .map(function (c, n) {
    var x = Math.cos(n) * 3.5;
    var y = Math.sin(n) * 2;
    return [x, y, -11];
  }).map(function (pos, i) {
    var cube = new THREE.Mesh(geometry, material);
    var rotation = cube.rotation;
    var position = cube.position;

    position.set.apply(position, _toConsumableArray(pos));
    rotation.y = rotation.x = Math.random() * (Math.PI * 2) * i;

    cube.userData = {
      rotSpeed: (1 + Math.random()) * 0.05,
      vel: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      maxVel: 0.1 + Math.random() * 0.4,
      fric: 0.992 + Math.random() * 0.005
    };

    return cube;
  }).map(function (c) {
    scene.add(c);
    return c;
  });

  camera.position.z = 2.9;

  var forePoint = new THREE.PointLight(16770543, 1.4, 12);
  forePoint.position.set(0, 0, 2.9);
  var mainColor = new THREE.DirectionalLight(16762287, 0.5);
  mainColor.position.set(0, 1, 1);

  scene.add(forePoint);
  scene.add(mainColor);
  scene.add(new THREE.AmbientLight(2368544));
  scene.fog = new THREE.Fog(393226, 10, 16);

  var mouseVec = new THREE.Vector3();
  var pos = new THREE.Vector3();

  (function tick() {

    // Mouse handling
    mouseVec.set(mouse.x / width * 2 - 1, -(mouse.y / height) * 2 + 1, 0.5);
    mouseVec.unproject(camera);
    var mouseDir = mouseVec.sub(camera.position).normalize();
    var distance = -camera.position.z / mouseDir.z + 12;
    pos.addVectors(camera.position, mouseDir.multiplyScalar(distance));

    // Move cubes
    cubes.forEach(function (cube) {
      var rotation = cube.rotation;
      var position = cube.position;
      var userData = cube.userData;
      var dir = userData.dir;
      var vel = userData.vel;
      var rotSpeed = userData.rotSpeed;
      var maxVel = userData.maxVel;
      var fric = userData.fric;

      var dt = Date.now() / 5000;

      // Rotation
      rotation.x += rotSpeed * Math.sin(dt);
      rotation.y += rotSpeed * Math.cos(dt);
      rotation.z += rotSpeed * Math.cos(dt);

      // Velocity
      dir.subVectors(pos, position).normalize().multiplyScalar(0.01);
      vel.add(dir).clampScalar(-maxVel, maxVel);
      position.add(vel);

      // Friction
      vel.multiplyScalar(fric);
    });

    r.render(scene, camera);
    requestAnimationFrame(tick);
  })();
})(window.THREE);

//# sourceMappingURL=build.js.map