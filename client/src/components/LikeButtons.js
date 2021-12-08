import React from 'react';
import {Fragment} from 'react'
import Button from '@mui/material/Button';
import {useState, useEffect} from "react";

/*
*	This component makes two like buttons for like counting. 
*	These buttons should be able to be pressed only once and
*	will reset the option if pressed again.
*/

function LikeButtons(prop) {
	const [liked, setLiked] = useState(false);
	const [value, setValue] = useState(false);

	useEffect(() => {
		if(prop.token && prop.likes) {
			let objectLikes = JSON.parse(prop.likes);
			/* 
			*	This is little suspect: "isliked" is only looking for if "userId" string contains
			*	in array "prop.likes". This array is only length 1 that contains the object. 
			*	This might be problem if userId strings are diffrent length and one id string 
			* 	could contain another id. I.e. finding id "21" would find "false postive" if there 
			* 	were id "321" in array. 
			*/
			let isLiked = prop.likes.includes(prop.userId);
			let likeValue = (isLiked ? objectLikes[prop.userId] : false);
			console.log(isLiked, likeValue);
			setLiked(isLiked);
			setValue(likeValue);
		}

	},[prop.token, prop.likes, prop.userId]);

	const likeButtonStyle = {
		backgroundColor: ((liked && value) ? "Aqua" : "White"),
		border: "1px solid"
	};

	const dislikeButtonStyle = {
		backgroundColor: ((liked && !value) ?  "Tomato" : "White"),
		border: "1px solid"
	};

	/*
	*	"onLike" makes function to "Like" - buttons or "Dislike" - buttons.
	*   To determine which button it is, the function takes in boolean variable
	* 	from element value: "true" for Like and "false" for Dislike.
	*	This function also uses boolean conversion from 0-1 to (-1)-1.
	*/ 
	
	const onLike = (event) => {
		let increment;
		let button = (event.target.value === "true" ? true : false)
		if(!liked) {
			setLiked(true);
			setValue(button);
			increment = 2*button - 1;  // returns 1 or -1
		} else {
			if(value !== button) {
				setValue(button);
				increment = 2 - 4*!button;  // returns -2 or 2
			} else {
				setLiked(false);
				increment = 2*!button - 1 // returns -1 or 1
			}
		}
		prop.addCount(increment, button);
	}

	// Only render buttons, if there is verified user
	if(prop.token) {
		return(
			<Fragment>
				<Button value={true} style={likeButtonStyle} onClick={onLike}>Like</Button>
				<Button value={false} style={dislikeButtonStyle} onClick={onLike}>DisLike</Button>
			</Fragment>
		);
	} else {
		return null;
	}
}

export default LikeButtons;