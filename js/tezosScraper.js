var creations = [];

var tmpOffset = 0;

var offset = 0;

async function getAllCreations( id, offset ) {

	try {

		var res = await axios.get( "https://api.better-call.dev/v1/tokens/mainnet/metadata?creator=" + id + "&size=10&offset=" + offset );

		for ( var i = 0; i < res.data.length; i++ ) {

			if ( creationFilter( res.data[i] ) === false ) {

				creations.push( res.data[i] );

			}

		}

		if ( res.data.length > 0 ) {

			offset += 10;

			//console.log( offset );

			updateLoader( creations.length );

			getAllCreations( id, offset );

		} else {

			//console.log( "Length: " + creations.length );

			shuffleArray( creations );

			createScene();

			return creations;

		}

	} catch( error ) {

		return null;

	}

}

function shuffleArray( array ) {

	for ( var i = array.length - 1; i > 0; i-- ) {

		var j = Math.floor( Math.random() * ( i + 1 ) );
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;

	}

}

var burned = [ 4974, 3461, 3465, 4668, 4238, 3598, 3324 ];

function creationFilter( creation ) {

	var isBurned = false;

	var isFound = burned.find( x=> x === creation.token_id );

	if ( typeof isFound !== "undefined" ) {

		isBurned = true;

	}

	return isBurned;

}
