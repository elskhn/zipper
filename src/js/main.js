let renderer, scene, camera, zipper

let ww = window.innerWidth,
  wh = window.innerHeight

function init() {

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') })
  renderer.setSize(ww, wh)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 10000)
  camera.position.set(0, 50, 500)
  camera.lookAt(0, -50, 0)
  scene.add(camera)

  //Add a light in the scene
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, -40, 350)
  directionalLight.lookAt(new THREE.Vector3(0, -40, 0))
  scene.add(directionalLight)

  //Load the obj file
  loadOBJ()
}

let loadOBJ = function () {

  //Manager from ThreeJs to track a loader and its status
  let manager = new THREE.LoadingManager()
  //Loader for Obj from Three.js
  let loader = new THREE.OBJLoader(manager)

  //Launch loading of the obj file, addZipperInScene is the callback when it's ready 
  loader.load('../assets/object/zipper.obj', addZipperInScene)

}

let addZipperInScene = function (object) {
  zipper = object
  //Move the zipper in the scene
  zipper.rotation.x = Math.PI / 2
  zipper.position.y = -100
  zipper.position.z = 400
  //Go through all children of the loaded object and search for a Mesh
  object.traverse(function (child) {
    //This allow us to check if the children is an instance of the Mesh constructor
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhongMaterial({
        color: 0x8e8e8e,
        specular: 0x050505,
        emmisive: 0x2b2b2b,
        shininess: 100,
        // map: texture,
        side: THREE.DoubleSide
      });
      //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
      child.geometry.computeVertexNormals()

      child.geometry.center()
    }
  })
  //Add the 3D object in the scene
  scene.add(zipper)
  render()
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

}

let time = 0,
  delta = 0,
  clock = new THREE.Clock();

let render = function () {
  requestAnimationFrame(render)

  delta = clock.getDelta();
  time += delta;

  zipper.position.y = (Math.abs(Math.sin(time)) * 3) + 20;
  //Turn the zipper
  // zipper.rotation.z += .01

  renderer.render(scene, camera)
}

init()
