import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

import imgBlack from './image/black.jpg'

// Debug
const gui = new dat.GUI({ width: 300, closed: true })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(-1, 1, 1)
scene.add(directionalLight)

let geometry, material, mesh, meshes = null
let textures = []

const input = document.querySelector("#file_input input")

input.addEventListener('change', e => {
    const container = document.querySelector("#container")
    const btnLoad = container.querySelector("button")
    const text = container.querySelector("#text")

    const URL = window.webkitURL || window.URL
    const url = URL.createObjectURL(e.target.files[0])

    switch(textures.length) {
        case 0:
            textures.push( textureLoader.load(url, (texture) => createImage(texture)) )
            btnLoad.innerText = "1 Loaded"
            text.innerText = "👉 Finish 👈"

            text.style.background = "black"
            text.style.borderRadius = "20px"
            text.style.width = "180px"
            text.style.padding = "3px"
            text.style.fontSize = "15px"
            text.style.color = "white"
            break
        case 1:
            textures.push( textureLoader.load(url, (texture) => material.uniforms.uTexture1.value = texture) )
            btnLoad.innerText = "2 Loaded"
            break
        case 2:
            textures.push( textureLoader.load(url, (texture) => material.uniforms.uTexture2.value = texture) )
            btnLoad.innerText = "3 Loaded"
            break
        case 3:
            textures.push( textureLoader.load(url, (texture) => material.uniforms.uTexture3.value = texture) )
            btnLoad.innerText = "4 Loaded"
            break
        default: 
            console.log('none')
    }
})

const text = document.querySelector("#text")
text.addEventListener('click', e => {
    const container = document.querySelector("#container")
    container.style.display = 'none'
})

// Geometry
const textureLoader = new THREE.TextureLoader()
const textureBlack = textureLoader.load(imgBlack)

const geometry_ = new THREE.PlaneGeometry(1.5, 1.5, 32, 32)

function createImage(texture) {
    const ratio = texture.image.width / texture.image.height
    const amp = Math.sqrt(0.5 / ratio)

    geometry = new THREE.PlaneGeometry(amp*ratio, amp, 100, 100)

    material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        uniforms:
        {
            uTime     : { value: 0 },
            uThickness: { value: 0.1 },

            uNoiseAmp2 : { value: 0.3 },
            uNoiseFreq2: { value: 8.8 },            
            uSpeed2   : { value: 2.0 },
            uFreq2    : { value: 20 },
            uStrength2: { value: 0.25 },
            uAngle2   : { value: 0.4 },

            uNoiseAmp3 : { value: 0.1 },
            uNoiseFreq3: { value: 10 },
            uSpeed3   : { value: 3.5 },
            uFreq3    : { value: 50 },
            uStrength3: { value: 0.1 },
            uAngle3   : { value: 0.5 },

            uTexture  : { value: texture },
            uTexture1 : { value: textureBlack },
            uTexture2 : { value: textureBlack },
            uTexture3 : { value: textureBlack },
            uPoint    : { value: new THREE.Vector2() },
        }
    })

    mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    const geometry_ = new THREE.PlaneGeometry(amp*ratio, amp, 32, 32)
    const material_ = new THREE.MeshBasicMaterial({color: '#404040'})
    const backPlane = new THREE.Mesh(geometry_, material_)

    backPlane.rotation.y = Math.PI
    backPlane.position.z -= 0.0005
    scene.add(backPlane)

    meshes = [ mesh ]

    const river1 = gui.addFolder('river1')
    const river2 = gui.addFolder('river2')

    gui.add(material.uniforms.uThickness, 'value').min(0).max(0.5).step(0.01).name('thickness')
    
    river1.add(material.uniforms.uNoiseAmp2, 'value').min(0).max(1).step(0.01).name('noise ampitude')
    river1.add(material.uniforms.uNoiseFreq2, 'value').min(0).max(30).step(0.01).name('noise frequency')
    river1.add(material.uniforms.uSpeed2, 'value').min(0.5).max(8).step(0.01).name('speed')
    river1.add(material.uniforms.uFreq2, 'value').min(5).max(50).step(0.01).name('frequency')
    river1.add(material.uniforms.uStrength2, 'value').min(0).max(1).step(0.01).name('strength')
    river1.add(material.uniforms.uAngle2, 'value').min(-1).max(1).step(0.01).name('angle')

    river2.add(material.uniforms.uNoiseAmp3, 'value').min(0).max(1).step(0.01).name('noise ampitude')
    river2.add(material.uniforms.uNoiseFreq3, 'value').min(0).max(30).step(0.01).name('noise frequency')
    river2.add(material.uniforms.uSpeed3, 'value').min(0.5).max(8).step(0.01).name('speed')
    river2.add(material.uniforms.uFreq3, 'value').min(5).max(50).step(0.01).name('frequency')
    river2.add(material.uniforms.uStrength3, 'value').min(0).max(1).step(0.01).name('strength')
    river2.add(material.uniforms.uAngle3, 'value').min(-1).max(1).step(0.01).name('angle2')
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