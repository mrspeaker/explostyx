(function (THREE) {

  'use strict';

  let height = window.innerHeight;
  let width = window.innerWidth;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const r = new THREE.WebGLRenderer({ alpha: true,  antialias: true });
  const dom = r.domElement;
  document.body.appendChild(dom);

  window.addEventListener('resize', () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    r.setSize(width, height);
  }, false);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, false);

  r.setSize(width, height);
  r.setClearColor(0x000000, 0);
  dom.style.position = 'absolute';
  dom.style.top = 0;
  dom.style.left = 0;

  scene.fog = new THREE.Fog(0x06000a, 10, 15);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial( {
    color: 0xf0f080,
    shininess: 1,
    specular: 0x000000,
    shading: THREE.FlatShading
  });

  const cubes = [1]
    .reduce((ac, e) => {
      while (ac.length < 350) {
        ac.push(e);
      }
      return ac;
    },[])
    //.fill(true)
    .map(() => [Math.random() * 10 - 5, Math.random() * 10 - 5])
    .map(function ([x, y], i) {
      var cube = new THREE.Mesh(geometry, material);
      const {rotation, position} = cube;
      position.set(x, y, -14);
      rotation.y = rotation.x = ((Math.PI * 2) / 3) * i;

      // Move this to userdata
      cube._rotSpeed = (1 + (Math.random())) * 0.05;
      cube._vel = new THREE.Vector3();
      cube._maxVel = 0.3 + (Math.random() * 0.5);
      cube._fric = 0.992 + (Math.random() * 0.005);
      return cube;
    })
    .map(function (c) {
      scene.add(c);
      return c;
    });

  camera.position.z = 2.9;

  const forePoint = new THREE.PointLight(0xffe5ef, 1.4, 12);
  forePoint.position.set(0, 0, 2.9);
  forePoint.lookAt(new THREE.Vector3(0, 0, 1));
  scene.add(forePoint);

  var mainColor = new THREE.DirectionalLight(0xffc58f, 0.4);
  mainColor.position.set(0, 1, 1);
  scene.add(mainColor);

  scene.add(new THREE.AmbientLight(0x242420));

  let last;
  let start;
  let dt;

  function cubanimate (time) {
    if (!last) { last = start = time; }
    dt = time - last;
    last = time;

    time *= 0.0001;
    requestAnimationFrame(cubanimate);

    // Mouse handling
    const mouseVec = new THREE.Vector3((mx / width) * 2 - 1, -(my / height) * 2 + 1, 0.5);
    mouseVec.unproject(camera);
    const mouseDir = mouseVec.sub(camera.position).normalize();
    const distance = -camera.position.z / mouseDir.z + 12;
    const pos = camera.position.clone().add(mouseDir.multiplyScalar(distance));

    // Move the cputes
    cubes.forEach(c => {
      // Rotation
      c.rotation.x += c._rotSpeed * (Math.sin(Date.now() / 5000));
      c.rotation.y += c._rotSpeed * (Math.cos(Date.now() / 5000));

      // Velocity
      const dir = pos.clone().sub(c.position).normalize().multiplyScalar(0.01);
      c._vel.add(dir).clampScalar(-c._maxVel, c._maxVel);
      c.position.add(c._vel);

      // Friction
      c._vel.multiplyScalar(c._fric);
    });

    r.render(scene, camera);
  }
  requestAnimationFrame(cubanimate);

}(
  window.THREE
));
