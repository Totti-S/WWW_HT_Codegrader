import React from 'react';

/*
*	General functio to make img element for profile pictures.
*/

const setPicture = function(picId, size) {
	let url;
	if(picId === "")  {
		url = "/default-profile-icon.jpg"
	} else {
		url = "http://localhost:3001/pictures/" + picId 
	}

	let classNameString = "profile-pic" + (size !== undefined ? ("-" +size) : "");

	return ( <img className={classNameString} alt="profile" src={url}/>);
}

export default setPicture;