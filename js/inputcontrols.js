// controls

var mouse = new THREE.Vector2();

var mouseIsMoving = false;

var isTouching = false;

var isMouseDown = false;

var raycaster = new THREE.Raycaster();

var isCurrentlyClicking = false;

var newCamPosX = 0;

var onKeyDown = function ( event ) {

	switch ( event.keyCode ) {

		case 37: // left

			event.preventDefault();
			newCamPosX = getNewCamPosX( "left" );
			break;

		case 39: // right

			event.preventDefault();
			newCamPosX = getNewCamPosX( "right" );
			break;

		case 38: // up

			event.preventDefault();
			break;

		case 40: // down

			event.preventDefault();
			break;

	}

};

var onKeyUp = function ( event ) {

	switch( event.keyCode ) {

		case 37: // left

			break;

		case 39: // right

			break;

	}

};

function setMousePosition( eventClientX, eventClientY ) {

	var canvasPosition = rendererElement.getBoundingClientRect();

	// height

	var windowHeight = rendererElement.clientHeight;

	var topLimit = canvasPosition.top;
	var bottomLimit = canvasPosition.bottom;

	if ( eventClientY > bottomLimit ) {

		mouse.y = -1;

	} else if ( eventClientY < topLimit ) {

		mouse.y = 1;

	} else {

		mouse.y = THREE.MathUtils.mapLinear( eventClientY, topLimit, bottomLimit, 1, -1 );

	}

	// width

	var windowWidth = rendererElement.clientWidth;

	var leftLimit = canvasPosition.left;
	var rightLimit = canvasPosition.right;

	if ( eventClientX < leftLimit ) {

		mouse.x = -1;

	} else if ( eventClientX > rightLimit ) {

		mouse.x = 1;

	} else {

		mouse.x = THREE.MathUtils.mapLinear( eventClientX, rightLimit, leftLimit, 1, -1 );

	}

}

function onMouseMove( event ) {

	setMousePosition( event.clientX, event.clientY );

	mouseIsMoving = true;

}

var handleStart = function ( event ) {

	setMousePosition( event.touches[0].clientX, event.touches[0].clientY );

	isMouseDown = true;

	if ( isTouching === false ) {

		isClicking();

	}

};

var handleEnd = function ( event ) {

	isTouching = false;
	isMouseDown = false;

};

var handleMove = function ( event ) {

	event.preventDefault();
	//setMouseDelta( event.touches[0].clientX, event.touches[0].clientY );
	//setMousePosition( event.touches[0].clientX, event.touches[0].clientY );
	setMousePosition( event.touches[0].clientX, event.touches[0].clientY );
	mouseIsMoving = true;
	event.stopPropagation();

};

var onClick = function ( event ) {

	event.preventDefault();
	setMousePosition( event.clientX, event.clientY );
	event.stopPropagation();

	isClicking();

};

function onSwipeLeft( event ) {

	newCamPosX = getNewCamPosX( "right" );

}

function onSwipeRight( event ) {

	newCamPosX = getNewCamPosX( "left" );

}

function isClicking() {

	isCurrentlyClicking = true;

	raycastCollectButton();

}

function mouseDown() {

	isMouseDown = true;

}

function mouseUp() {

	isMouseDown = false;

}

function onTouchMove() {

	event.preventDefault();
	setMousePosition( event.touches[0].clientX, event.touches[0].clientY );
	mouseIsMoving = true;
	event.stopPropagation();

}

document.addEventListener( "click", onClick, false );
window.addEventListener( "mousemove", onMouseMove, false );

document.addEventListener( 'mousedown', mouseDown, false );
document.addEventListener( 'mouseup', mouseUp, false );

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

document.addEventListener( 'touchstart', handleStart, false );
document.addEventListener( 'touchend', handleEnd, false );
document.addEventListener( 'touchmove', onTouchMove, false );

document.addEventListener( "swipeleft", onSwipeLeft, false );
document.addEventListener( "swiperight", onSwipeRight, false );