var camera, scene, renderer, controls;

var cameraRatio = {

	width: 16,
	height: 9,
	needRatio: false

}

var growingRandom = 0;
var growingNumber = 0;

var orbitControls = false;

if ( THREE.WEBGL.isWebGLAvailable() === false ) {

	document.body.appendChild( THREE.WEBGL.getWebGLErrorMessage() );
	
}

function initiate() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set( 0, 6, 28 );
	camera.userData.target = new THREE.Vector3( 0, 6, 0 );
	camera.lookAt( camera.userData.target );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
	renderer.domElement.id = "rendererElement";
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( "container" ).appendChild( renderer.domElement );
	rendererElement = document.getElementById("rendererElement");
	renderer.autoClear = false;

	if ( orbitControls === true ) {

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableKeys = false;
		controls.target.y = 6;

	}

	onWindowResize();

	createLoader();

}

initiate();

var animate = function () {

	if ( sceneIsready === true ) {

		updateScene();

	}

	requestAnimationFrame( animate );

	if ( orbitControls === true ) {

		controls.update();

	}

	renderer.render( scene, camera );

};

animate();

// RESIZER

var forcedHeight;
var forcedWidth;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

	if ( cameraRatio.needRatio === true ) {

		if ( window.innerWidth / window.innerHeight < cameraRatio.width / cameraRatio.height ) {

			// portrait

			forcedHeight = window.innerWidth * cameraRatio.height / cameraRatio.width;
			forcedWidth = window.innerWidth;

		} else {

			// landscape

			forcedHeight = window.innerHeight;
			forcedWidth = window.innerHeight * cameraRatio.width / cameraRatio.height;

		}

		camera.aspect = cameraRatio.width / cameraRatio.height;

		camera.updateProjectionMatrix();

		renderer.setSize( forcedWidth, forcedHeight );

	} else {

		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	renderer.render( scene, camera );

}