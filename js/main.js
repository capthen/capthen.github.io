var sceneIsready = false;
var allGalleryTexturesAreLoaded = false;

var whiteScreen;

var floor;
var floorLeft;
var floorRight;
var moulure;
var rightMoulure;
var leftMoulure;
var board;
var floorAO;
var sign;
var signResolution = 1080;
var collectButton;
var creationScaleFactor = 0.92;
var loader;
var erin;
var henLogo;
var capthen;

var limits = new THREE.Group();

var gradientLimitRight;
var gradientLimitLeft;

var moveTime = 0;
var camGap = 28;

var floorWidth = 100;

var currentCreation;

function createLoader() {

	var whiteScreenTextureManager = new THREE.LoadingManager();

	whiteScreenTextureManager.onLoad = function() {

		erin.material.map = erinTexture;
		erin.material.needsUpdate = true;
		capthen.material.map = capthenTexture;
		capthen.material.needsUpdate = true;

	}

	// WHITE SCREEN

	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 1 } );
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	whiteScreen = new THREE.Mesh( geometry, material );
	whiteScreen.position.set( 0, 0, 12 );
	scene.add( whiteScreen );

	// ERIN

	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var geometry = new THREE.PlaneGeometry( 126, 36.2 );
	erin = new THREE.Mesh( geometry, material );
	erin.scale.set( 0.052, 0.052, 1 );
	erin.position.set( 0, 8.2, 14.8 );
	scene.add( erin );

	var erinTexture = new THREE.TextureLoader( whiteScreenTextureManager ).load( "/assets/erin.jpg" );

	// CAPTHEN

	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var geometry = new THREE.PlaneGeometry( 51.2, 12.8 );
	capthen = new THREE.Mesh( geometry, material );
	capthen.scale.set( 0.04, 0.04, 1 );
	capthen.position.set( 0, 2.8, 14.8 );
	scene.add( capthen );

	var capthenTexture = new THREE.TextureLoader( whiteScreenTextureManager ).load( "/assets/capthen.jpg" );

	// LOADER

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.width = 512;
	canvas.height = canvas.width;	

	var amap = new THREE.CanvasTexture( canvas );
	var mat = new THREE.SpriteMaterial({

		map: amap,
		transparent: true,
		opacity: 1,

	});

	loader = new THREE.Sprite( mat );

	context.fillStyle = '#000000';
	context.textAlign = 'center';
	context.font = '44px Lato';

	context.fillText( "Looking for Erin's objkts...", canvas.width/2, canvas.height/2 );

	loader.scale.set( 3.6, 3.6, 1 );

	loader.position.set( 0, 5.8, 14 );

	scene.add( loader );

	getAllCreations( "tz1gNKnwjUNRKa9RK9dTs6VjhCsnfFw2Gm65", 0 );

}

function createScene() {

	var signFont = new FontFace( 'Lato', 'url( /assets/lato.ttf )' );

	signFont.load().then(( font ) => {
		
		document.fonts.add( font );

		createGallery();

	});

}

function createGallery() {

	var galleryTextureManager = new THREE.LoadingManager();

	galleryTextureManager.onLoad = function() {

		allGalleryTexturesAreLoaded = true;

	}

	// FLOOR

	var floorDepth = 40;
	var ratio = 485/310 * 0.72;
	var floorTextureScale = 18;

	var floorTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/floor.jpg" );
	
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( floorTextureScale * floorWidth / 100, floorTextureScale * floorDepth * ratio / 100 );

	var geometry = new THREE.PlaneGeometry( floorWidth, floorDepth );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: floorTexture } );
	floor = new THREE.Mesh( geometry, material );
	floor.rotateX( -Math.PI/2 );
	floor.position.z = floorDepth/2;
	floorRight = floor.clone();
	floorRight.position.x = -floorWidth; 
	floorLeft = floor.clone();
	floorLeft.position.x = floorWidth; 
	scene.add( floor, floorRight, floorLeft );

	// AMBIANT OCCLUSION

	var aoHeight = 0.34;
	var aoTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/ao.jpg" );
	var geometry = new THREE.PlaneGeometry( 100, aoHeight );
	var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.12, alphaMap: aoTexture } );
	floorAO = new THREE.Mesh( geometry, material );
	floorAO.position.set( 0, aoHeight/8, aoHeight/2 );
	floorAO.rotateX( -Math.PI/2.4 );
	scene.add( floorAO );

	// MOULURE

	var moulureTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/moulure.jpg" );
	var geometry = new THREE.PlaneGeometry( 10 * creationScaleFactor, 10 * creationScaleFactor );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: moulureTexture } );
	moulure = new THREE.Mesh( geometry, material );
	moulure.position.y = 8;
	moulure.position.x = -6.8;
	rightMoulure = moulure.clone();
	rightMoulure.position.x = -camGap;
	leftMoulure = moulure.clone();
	leftMoulure.position.x = camGap;
	scene.add( moulure, rightMoulure, leftMoulure );

	// BASEBOARD

	var boardHeight = 0.68;

	var boardTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/board.jpg" );
	var geometry = new THREE.PlaneGeometry( 100, boardHeight );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: boardTexture } );
	board = new THREE.Mesh( geometry, material );
	board.position.y = boardHeight/2;
	scene.add( board );

	// SIGN

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.width = signResolution;
	canvas.height = canvas.width;	

	var amap = new THREE.CanvasTexture( canvas );
	var mat = new THREE.SpriteMaterial({

		map: amap,
		transparent: true,
		opacity: 1,

	});

	sign = new THREE.Sprite( mat );

	sign.scale.set( 16, 16, 1 );

	sign.position.set( 6, 8, 0 );

	scene.add( sign );

	// COLLECT BUTTON

	var collectTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/collect.jpg" );
	var geometry = new THREE.PlaneGeometry( 9.86, 2.12 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: collectTexture } );
	collectButton = new THREE.Mesh( geometry, material );
	collectButton.userData.baseScale = 0.42;
	collectButton.userData.posX = 2;
	collectButton.position.y = 5.4;
	collectButton.position.x = collectButton.userData.posX;
	collectButton.scale.set( collectButton.userData.baseScale, collectButton.userData.baseScale, 1 );
	scene.add( collectButton );

	// GRADIENT LIMITS

	var gradientTexture = new THREE.TextureLoader( galleryTextureManager ).load( "/assets/gradient.jpg" );

	var geometry = new THREE.PlaneGeometry( 8, 40 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, alphaMap: gradientTexture } );
	var gradientLimitRight = new THREE.Mesh( geometry, material );
	var gradientLimitLeft = new THREE.Mesh( geometry, material );
	gradientLimitRight.rotateZ( Math.PI );

	var viewGap = 18;
	var limitWidth = 200;

	gradientLimitRight.position.set( -viewGap, 0, 10 );
	gradientLimitLeft.position.set( viewGap, 0, 10 );

	var geometry = new THREE.PlaneGeometry( limitWidth, 40 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var limitRight = new THREE.Mesh( geometry, material );
	var limitLeft = new THREE.Mesh( geometry, material );
	limitRight.rotateZ( Math.PI );

	limitRight.position.set( -viewGap - limitWidth/2 - 2, 0, 10 );
	limitLeft.position.set( viewGap + limitWidth/2 + 2, 0, 10 );

	limits.add( gradientLimitRight, gradientLimitLeft, limitRight, limitLeft );

	scene.add( limits );

	//

	currentCreation = creations[0];
	renderer.compile( scene, camera );
	sceneIsready = true;

}

function fakeLight( mesh, intensity ) {

	var geometry = mesh.geometry;

	var count = geometry.attributes.position.count;

	var positions = geometry.attributes.position;

	geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );

	var color = new THREE.Color();

	var colors = geometry.attributes.color;

	var normals = geometry.attributes.normal;

	var greyValue = new THREE.Color( 0xe9e9e9 );

	// vertex colors

	for ( var i = 0; i < count; i ++ ) {

		var greyFactor = normals.getX( i ) + normals.getZ( i ) / 4 + normals.getY( i ) * 1.2;

		var posX = positions.getX( i );
		var posY = positions.getY( i );
		var posZ = positions.getZ( i );

		colors.setXYZ( i, greyValue.r + greyFactor / 20 * intensity, greyValue.g + greyFactor / 20 * intensity, greyValue.b + greyFactor / 20 * intensity );

	}

	mesh.material.vertexColors = THREE.VertexColors;

}

function getNewCamPosX( side ) {

	var closestPos = Math.round( camera.position.x / camGap ) * camGap;

	var nextRightPos = closestPos + camGap;
	var nextLeftPos = closestPos - camGap;

	if ( side === "right" ) {

		return nextRightPos;

	} else {

		return nextLeftPos;

	}

}

function updateCamera() {

	camera.userData.target.x = camera.position.x;
	camera.userData.target.y = 6;
	camera.userData.target.z = 0;

	//camera.userData.target.x += mouse.x/10;
	camera.userData.target.y += mouse.y/10;

	camera.lookAt( camera.userData.target );

	var gap = Math.abs( Math.abs( camera.position.x ) - Math.abs( newCamPosX ) );

	if ( camera.position.x > newCamPosX + 0.001 ) {

		camera.position.x -= gap / 10;

	} else if ( camera.position.x < newCamPosX - 0.001 ) {

		camera.position.x += gap / 10;

	} else {

		camera.position.x = newCamPosX;

	}

	//camera.position.y = 6 + mouse.y;
	camera.position.x += mouse.x/32;

}

function updateFloor() {

	board.position.x = camera.position.x;
	floorAO.position.x = camera.position.x;

	if ( camera.position.x > floor.position.x + floorWidth || camera.position.x < floor.position.x - floorWidth ) {

		floor.position.x = camera.position.x - ( camera.position.x % floorWidth );
		floorRight.position.x = floor.position.x - floorWidth;
		floorLeft.position.x = floor.position.x + floorWidth;

	}

}

function updateMoulure() {

	var closestPos = Math.round( camera.position.x / camGap ) * camGap;

	moulure.position.x = closestPos - 6.8;
	rightMoulure.position.x = closestPos - camGap - 6.8;
	leftMoulure.position.x = closestPos + camGap - 6.8;

}

function updateCreations() {

	var closestPos = Math.round( camera.position.x / camGap ) * camGap;

	var closestCreationIndex = getCreationIndexBasedOnCamPos( closestPos );

	// RIGHT

	var nextRightCreationIndex;

	if ( closestCreationIndex === 0 ) {

		nextRightCreationIndex = creations.length - 1;

	} else {

		nextRightCreationIndex = closestCreationIndex - 1;

	}

	// LEFT

	var nextLeftCreationIndex;

	if ( closestCreationIndex === creations.length - 1 ) {

		nextLeftCreationIndex = 0;

	} else {

		nextLeftCreationIndex = closestCreationIndex + 1;

	}

	// MAKE ALL INVISIBLE AND CREATE CLOSEST CREATIONS MESHES IF NEEDED

	for ( var i = 0; i < creations.length; i++ ) {

		if ( typeof creations[i].mesh !== "undefined" ) {

			creations[i].mesh.visible = false;
			creations[i].mesh.material.needsUpdate = true;

			// OPACITY IF TEXTURE IS LOADED

			if ( creations[i].mesh.material.map !== null ) {

				if ( creations[i].mesh.material.opacity < 1 ) {

					creations[i].mesh.material.opacity += 0.02;

				} else {

					creations[i].mesh.material.opacity = 1;

				}

			}

		}

		if ( i === closestCreationIndex || i === nextRightCreationIndex || i === nextLeftCreationIndex ) {

			if ( typeof creations[i].mesh === "undefined" ) {

				createCreationMesh( creations[i] );

			}

		}

	}

	creations[closestCreationIndex].mesh.visible = true;
	creations[closestCreationIndex].mesh.position.x = moulure.position.x;
	creations[nextRightCreationIndex].mesh.visible = true;
	creations[nextRightCreationIndex].mesh.position.x = rightMoulure.position.x;
	creations[nextLeftCreationIndex].mesh.visible = true;
	creations[nextLeftCreationIndex].mesh.position.x = leftMoulure.position.x;

}

function getCreationIndexBasedOnCamPos( camPosX ) {

	var posCreation0 = camPosX - ( camPosX % ( creations.length * camGap ) );

	var index = ( camPosX - posCreation0 ) / camGap;

	if ( index < 0 ) {

		index = creations.length + index; 

	}

	return index;

}

function createCreationMesh( creation ) {

	var texturePath = "https://cloudflare-ipfs.com/ipfs/" + creation.artifact_uri.slice( 7 );

	var creationScale = 0.832 * creationScaleFactor;

	var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0 } );
	creation.mesh = new THREE.Mesh( geometry, material );
	creation.mesh.scale.set( creationScale, creationScale, 1 );
	creation.mesh.visible = false;
	creation.mesh.position.y = 8;
	creation.mesh.position.z = 0.1;
	scene.add( creation.mesh );

	var textureManager = new THREE.LoadingManager();

	textureManager.onLoad = function() {

		creation.mesh.material.map = texture;
		creation.mesh.material.needsUpdate = true;
		renderer.compile( scene, camera );

	}

	var texture = new THREE.TextureLoader( textureManager ).load( texturePath );
	
}

function updateSign() {

	var closestPos = Math.round( camera.position.x / camGap ) * camGap;

	sign.position.x = closestPos + 8;
	collectButton.position.x = closestPos + collectButton.userData.posX;

	var closestCreation = creations[getCreationIndexBasedOnCamPos( closestPos )];

	currentCreation = closestCreation;

	updateSignText( closestCreation );

	if ( camera.position.x > closestPos ) {

		sign.material.opacity = THREE.MathUtils.mapLinear( camera.position.x, closestPos, closestPos + camGap/2, 1, 0 );

	} else {

		sign.material.opacity = THREE.MathUtils.mapLinear( camera.position.x, closestPos, closestPos - camGap/2, 1, 0 );

	}

	collectButton.material.opacity = sign.material.opacity;

}

function updateSignText( creation ) {

	var context = sign.material.map.image.getContext("2d");

	var canvasWidth = canvasHeight = signResolution;

	var lineSpace = canvasWidth/20;
	var namePos = canvasWidth/2.8;

	context.clearRect( 0, 0, canvasWidth, canvasHeight );
	
	context.fillStyle = '#000000';
	//context.fillRect( 0, 0, canvasWidth, canvasHeight );
	//context.fillStyle = '#ffffff';
	context.textAlign = 'left';
	context.font = '68px Lato';

	if ( creation.token_id === 2827 ) {

		var splitName = creation.name.split( "," );

		context.fillText( splitName[0] + ",", 0, namePos );
		context.fillText( splitName[1].slice(1), 0, namePos + lineSpace * 1.2 );

		if ( typeof description !== "undefined" ) {

			context.font = '28px Arial';
			//context.fillText( creation.description, 0, canvasWidth/2 );

		}

		context.font = '28px Arial';
		context.fillText( "OBJKT #" + creation.token_id, 0, namePos + lineSpace * 2 * 1.2 );
		//context.fillText( creation.supply + " editions" , 0, namePos + lineSpace * 1.8 );

	} else {

		context.fillText( creation.name, 0, namePos );

		if ( typeof description !== "undefined" ) {

			context.font = '28px Arial';
			//context.fillText( creation.description, 0, canvasWidth/2 );

		}

		context.font = '28px Arial';
		context.fillText( "OBJKT #" + creation.token_id, 0, namePos + lineSpace );
		//context.fillText( creation.supply + " editions" , 0, namePos + lineSpace * 1.8 );

	}

	sign.material.needsUpdate = true;
	sign.material.map.needsUpdate = true;

}

function raycastCollectButton() {

	if ( sceneIsready === true ) {

		raycaster.setFromCamera( mouse, camera );

		var intersect = raycaster.intersectObject( collectButton );

		if ( intersect.length > 0 ) {

			if ( collectButton.scale.x < collectButton.userData.baseScale + collectButton.userData.baseScale/20 ) {

				collectButton.scale.x += 0.01;
				collectButton.scale.y += 0.01;

			}

			if ( isCurrentlyClicking === true ) {

				if ( typeof currentCreation.token_id !== "undefined" ) {

					var objktURL = "https://objkt.com/asset/hicetnunc/" + currentCreation.token_id;

					window.open( objktURL, '_blank' ).focus();

				}

			}

		} else {

			if ( collectButton.scale.x > collectButton.userData.baseScale ) {

				collectButton.scale.x -= 0.01;
				collectButton.scale.y -= 0.01;

			}

		}

	}

	isCurrentlyClicking = false;

}

function updateLoader( totalFetched ) {

	var context = loader.material.map.image.getContext("2d");

	var canvasWidth = canvasHeight = 512;

	var lineSpace = canvasWidth/20;
	var firstPos = canvasWidth/2;

	context.clearRect( 0, 0, canvasWidth, canvasHeight );

	//context.fillStyle = '#000000';
	//context.fillRect( 0, 0, canvasWidth, canvasHeight );
	
	context.fillStyle = '#000000';
	context.textAlign = 'center';
	context.font = '44px Lato';

	context.fillText( totalFetched + " objkts found...", canvasWidth/2, firstPos );


	loader.material.needsUpdate = true;
	loader.material.map.needsUpdate = true;

}

function updateScene() {

	if ( sceneIsready === true && allGalleryTexturesAreLoaded === true && growingNumber > 120 ) {

		loader.visible = false;
		erin.visible = false;
		capthen.visible = false;

		if ( whiteScreen.material.opacity > 0 ) {

			whiteScreen.material.opacity -= 0.01;

		} else {

			whiteScreen.material.opacity = 0;
			whiteScreen.visible = false;

		}


		updateCamera();
		updateFloor();
		updateMoulure();
		updateCreations();
		updateSign();
		raycastCollectButton();

		limits.position.x = camera.position.x;

	}

	growingRandom += Math.random();
	growingNumber += 1;

}