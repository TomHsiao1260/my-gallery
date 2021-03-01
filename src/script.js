import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

import img from './image/landview.jpg'

console.log(img)

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(-1, 1, 1)
scene.add(directionalLight)

// gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')

let geometry, material, mesh, meshes = null

// Geometry
const textureLoader = new THREE.TextureLoader()
textureLoader.load(img, (texture) => createImage(texture))

const geometry_ = new THREE.PlaneGeometry(1.5, 1.5, 32, 32)

function createImage(texture) {
    const ratio = texture.image.width / texture.image.height

    geometry = new THREE.PlaneGeometry(1.0*ratio, 1.0, 32, 32)

    material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        uniforms:
        {
            uTime    : { value: 0 },
            uTexture : { value: texture },
            uPoint   : { value: new THREE.Vector2() },
        }
    })

    mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    meshes = [ mesh ]
}

// Material
const material_ = new THREE.MeshStandardMaterial()

// Mesh
const mesh_ = new THREE.Mesh(geometry_, material_)
mesh_.position.z = -0.2
scene.add(mesh_)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const mouse = new THREE.Vector2()
// 建立 Raycaster 接受的滑鼠座標系統，讓右上為 (1,1) 左下為 (-1,-1)
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (material && meshes) { 
        material.uniforms.uTime.value = elapsedTime

        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects( meshes )
        // meshes.forEach( obj => obj.material.color.set('red'))
        intersects.forEach( e => material.uniforms.uPoint.value = e.uv )
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()