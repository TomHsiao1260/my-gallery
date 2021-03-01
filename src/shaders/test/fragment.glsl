uniform sampler2D uTexture;
uniform vec2 uPoint;
varying vec2 vUv;

void main()
{
    gl_FragColor = texture2D(uTexture, vUv);
    gl_FragColor.rgb -= vec3(distance(uPoint, vUv) * 0.3);

    // gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);
}