import React from 'react';
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import EditButton from "../components/EditButton.js";
import LikeButtons from "../components/LikeButtons.js";
import convertDate from "../functions/convertDate.js";
import setPicture from "../functions/setPicture.js";

/*	
*	This component is responsible for making the commments on posts
*	It has "likeCounter" - type of component 
*	that could be made to be it's own hoc-component.
*	
*	This need props: "likes","commentid", "count", "username" and "comment"
*	likes: object that holds all the users how liked the comment.
*	commentId: This components id to find all the comments linked to this.
*	username: Name of a user that made the comment, used to find the user picture.
*	comment: The actual comment that would be shown to the viewer
*	count: For like counter
*   
*   This Compponent has much overlap with the Post.js and it would help
*	to make "skeleton" component that could be buildding block to both components
*/ 

function Comment(prop) {
	const [likeCount, setCount] = useState(0);
	const [imageId, setImageId] = useState("");
	const [likes, setLikes] = useState(null);
	const [token, setToken] = useState(null)
	const [text, setText] = useState("");

	useEffect(() => {
		// Setting up some innitial values before the render
		setToken(localStorage.getItem("auth_token"));
		setText(prop.comment);
		setCount(prop.count);
		setLikes(JSON.stringify(prop.likes));
		// Setting up the profile image of the comment user
		let fetchUrl = "http://localhost:3001/users/picture/" + prop.username;
		fetch(fetchUrl, {method: "get"})
		.then(res => res.json())
		.then(data => {
			let image = data.profileImg;
			if (image === undefined) image = "";
			setImageId(image);
		})
	},[prop.count, prop.username, prop.likes, prop.comment]) 
	
	/* 
	*	Tracks like number chance from pushing the buttons and
	*	updates it to the database. 
	*
	*	This code block is intended to
	*   be sended to "LikeButtons" - component that uses it. 
	*/

	const addCount = (number, buttonValue) => {
		let newCount = number + likeCount;
		setCount(newCount);

		let userId = localStorage.getItem("userId");
	
		// Update the like to database.
		fetch("http://localhost:3001/comments/like",{
			method: "PATCH",
			headers: {
				'Authorization': "Bearer " + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				like: buttonValue,
				count: newCount,
				commentId: prop.commentId,
				userId: userId
			})
		})
		.then(res => {		
			if (res.ok) {
				res.json()
			} else {
				throw new Error('Not logged in')
			}
		})
		.then(data => {
			/*  
			*	Server sends info if the like was removed or added to database
			*	This intends to update it instantly to user so user dosen't need
			*	update the whole website to see correct information.
			*/  
			if(data.status === "ok") {
				let objectLikes = JSON.parse(likes);

				
				if(data.value) {
					delete objectLikes[userId];
				} else {
					objectLikes[userId] = buttonValue;
				}

				setLikes(JSON.stringify(objectLikes));
			}
		})
		.catch(err => {
			if(err.message === 'Not logged in') {
				// If the token is expired it should logout the user. 
				localStorage.removeItem("auth_token");
				localStorage.removeItem("userId");
				localStorage.removeItem("user");
				window.location.reload();
			}
		})
	}

	// This makes a timestamp, if the post was edited 
	const addEditText = (haveEdited, editTime) => {
		if(haveEdited) {
			return (
				<p className="editTime"> 
					Last Edit: {convertDate(editTime)}
				</p>
			);
		}
	}

	let linkString = "Profile/" + prop.username;

	return(
		<div className="comment">
			<div className="user">
				<div className="userInfo">
					{setPicture(imageId,"small")}
					<Link to={linkString}> {prop.username} </Link>
					<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
					<p>{convertDate(prop.time)}</p>
					<p>Likes: {likeCount}</p>
					<LikeButtons 
						userId={localStorage.getItem('userId')}
						addCount={addCount}
						token={token}
						likes={likes}
					/>
				</div>
			</div>
			<div className="comment">
				{text}
				{addEditText(prop.edited, prop.editTime)}
				<EditButton 
					id={prop.commentId} 
					prevText={text}
					setNewText={setText}
					author={prop.username}
					token={token}
					type="comment"
				/>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

			</div>
		</div>
	);
}

export default Comment;
