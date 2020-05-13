

let renderer, scene, camera, zipper
let ww = window.innerWidth,
  wh = window.innerHeight
let targetRotationX = 0
let targetRotationOnMouseDownX = 0

let mouseX = 0
let mouseXOnMouseDown = 0

let windowHalfX = ww / 2
let windowHalfY = wh / 2

function init() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene')
  })
  renderer.setSize(ww, wh)
  renderer.shadowMap.enabled = true
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe2e2e2)
  camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 10000)
  camera.position.set(0, 30, 520)
  camera.lookAt(0, -50, 0)
  scene.add(camera)

  // scene lighting
  // directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  // directionalLight.position.set(0, 20, 520)
  // directionalLight.lookAt(new THREE.Vector3(0, -20, 0))
  // scene.add(directionalLight)

  directionalLightTop = new THREE.DirectionalLight(0xffffff, 1)
  directionalLightTop.position.set(0, 240, 400)
  directionalLightTop.lookAt(new THREE.Vector3(0, 0, 0))
  // directionalLightTop.target.position.set(0, 0, 0);
  directionalLightTop.castShadow = true
  // directionalLightTop.shadow.mapSize.width = 2048
  // directionalLightTop.shadow.mapSize.height = 2048
  console.log(directionalLightTop.position)
  scene.add(directionalLightTop)

  ambientLight = new THREE.AmbientLight(0x353535)
  scene.add(ambientLight)

  let geometry = new THREE.PlaneGeometry(1000, 1000, 100)
  let material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  })
  let plane = new THREE.Mesh(geometry, material)
  plane.position.y = -35
  plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI)
  plane.receiveShadow = true
  scene.add(plane)

  loadOBJ()
}
// load the .obj file
let loadOBJ = function () {
  // manager from ThreeJs to track a loader and its status
  let manager = new THREE.LoadingManager()
  // loader for Obj from Three.js
  let loader = new THREE.OBJLoader(manager)
  //  launch loading of the obj file, addZipperInScene() callback when ready 
  loader.load('../assets/object/zipper.obj', addZipperInScene)
}
let addZipperInScene = function (object) {
  zipper = object
  // set zipper position
  zipper.rotation.x = Math.PI / 2
  zipper.position.y = -100
  zipper.position.z = 400
  // iterate through all children of loaded object and search for a Mesh
  object.traverse(function (child) {
    // check if the child is an instance of Mesh constructor
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhongMaterial({
        color: 0x898989,
        specular: 0x1e1e1e,
        // emmisive: 0x545454,
        shininess: 100,
        // map: texture,
        side: THREE.DoubleSide,
      })
      child.flatShading = false
      // compute vertex normals missing in the .obj file
      child.geometry.computeVertexNormals()
      child.geometry.center()
      child.castShadow = true
    }
  })

  scene.add(zipper)
  render()
}
window.addEventListener('resize', onWindowResize, false)
document.addEventListener('mousedown', onDocumentMouseDown, false)
document.addEventListener('touchstart', onDocumentTouchStart, false)
document.addEventListener('touchmove', onDocumentTouchMove, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

let time = 0,
  delta = 0,
  clock = new THREE.Clock()

let render = function () {
  requestAnimationFrame(render)

  // zipper bobbing up and down
  delta = clock.getDelta()
  time += delta
  zipper.position.y = (Math.abs(Math.sin(time)) * 3)

  // turn the zipper!
  zipper.rotation.z -= (targetRotationX + zipper.rotation.z) * 0.005

  // console.log(Math.floor(zipper.position.x), Math.floor(zipper.position.y), Math.floor(zipper.position.z))
  renderer.render(scene, camera)
}

function onDocumentMouseDown(event) {
  event.preventDefault()

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('mouseup', onDocumentMouseUp, false)
  document.addEventListener('mouseout', onDocumentMouseOut, false)

  mouseXOnMouseDown = event.clientX - windowHalfX
  targetRotationOnMouseDownX = targetRotationX

}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX
  targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false)
  document.removeEventListener('mouseup', onDocumentMouseUp, false)
  document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false)
  document.removeEventListener('mouseup', onDocumentMouseUp, false)
  document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX
    targetRotationOnMouseDownX = targetRotationX
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05
  }
}
init()
