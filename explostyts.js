'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

(function (THREE) {

  'use strict';

  var height = window.innerHeight;
  var width = window.innerWidth;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  var r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  var dom = r.domElement;
  document.body.appendChild(dom);

  window.addEventListener('resize', function () {
    var height = window.innerHeight;
    var width = window.innerWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    r.setSize(width, height);
  }, false);

  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  }, false);

  r.setSize(width, height);
  r.setClearColor(0, 0);
  dom.style.position = 'absolute';
  dom.style.top = 0;
  dom.style.left = 0;

  scene.fog = new THREE.Fog(393226, 10, 15);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 15790208,
    shininess: 1,
    specular: 0,
    shading: THREE.FlatShading
  });

  var cubes = [1].reduce(function (ac, e) {
    while (ac.length < 350) {
      ac.push(e);
    }
    return ac;
  }, [])
  //.fill(true)
  .map(function () {
    return [Math.random() * 10 - 5, Math.random() * 10 - 5];
  }).map(function (_ref, i) {
    var _ref2 = _slicedToArray(_ref, 2);

    var x = _ref2[0];
    var y = _ref2[1];

    var cube = new THREE.Mesh(geometry, material);
    var rotation = cube.rotation;
    var position = cube.position;

    position.set(x, y, -14);
    rotation.y = rotation.x = Math.PI * 2 / 3 * i;

    // Move this to userdata
    cube._rotSpeed = (1 + Math.random()) * 0.05;
    cube._vel = new THREE.Vector3();
    cube._maxVel = 0.3 + Math.random() * 0.5;
    cube._fric = 0.992 + Math.random() * 0.005;
    return cube;
  }).map(function (c) {
    scene.add(c);
    return c;
  });

  camera.position.z = 2.9;

  var forePoint = new THREE.PointLight(16770543, 1.4, 12);
  forePoint.position.set(0, 0, 2.9);
  forePoint.lookAt(new THREE.Vector3(0, 0, 1));
  scene.add(forePoint);

  var mainColor = new THREE.DirectionalLight(16762255, 0.4);
  mainColor.position.set(0, 1, 1);
  scene.add(mainColor);

  scene.add(new THREE.AmbientLight(2368544));

  var last = undefined;
  var start = undefined;
  var dt = undefined;

  function cubanimate(time) {
    if (!last) {
      last = start = time;
    }
    dt = time - last;
    last = time;

    time *= 0.0001;
    requestAnimationFrame(cubanimate);

    // Mouse handling
    var mouseVec = new THREE.Vector3(mx / width * 2 - 1, -(my / height) * 2 + 1, 0.5);
    mouseVec.unproject(camera);
    var mouseDir = mouseVec.sub(camera.position).normalize();
    var distance = -camera.position.z / mouseDir.z + 12;
    var pos = camera.position.clone().add(mouseDir.multiplyScalar(distance));

    // Move the cputes
    cubes.forEach(function (c) {
      // Rotation
      c.rotation.x += c._rotSpeed * Math.sin(Date.now() / 5000);
      c.rotation.y += c._rotSpeed * Math.cos(Date.now() / 5000);

      // Velocity
      var dir = pos.clone().sub(c.position).normalize().multiplyScalar(0.01);
      c._vel.add(dir).clampScalar(-c._maxVel, c._maxVel);
      c.position.add(c._vel);

      // Friction
      c._vel.multiplyScalar(c._fric);
    });

    r.render(scene, camera);
  }
  requestAnimationFrame(cubanimate);
})(window.THREE);

//# sourceMappingURL=explostyts.js.map