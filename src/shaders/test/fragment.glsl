uniform sampler2D uTexture;

varying vec2 vUv;
varying float vStrength2;
varying float vStrength3;

void main()
{
	vec4 mask  = texture2D(uTexture, vUv);

    gl_FragColor = mask;
    gl_FragColor.rgb -= vec3(vStrength2);
    gl_FragColor.rgb -= vec3(vStrength3);
}