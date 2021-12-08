import React from 'react';
import AddComment from "../components/AddComment.js";
import LikeButtons from "../components/LikeButtons.js";
import Comment from "../components/Comment.js";
import EditButton from "../components/EditButton.js";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Highlight from 'react-highlight';
import 'highlight.js/styles/monokai-sublime.css';
import convertDate from "../functions/convertDate.js";
import setPicture from "../functions/setPicture.js";

/*
*	This component is responsible for making the actual post that
*	will be shown to user. This has "likeCounter" - type of component 
*	inside that could be made to be it's own hoc-component.
*	
*	This takes in props:
*	likes: object that holds all the users how liked the post.
*	id: This components id to find all the comments linked to this.
*	user: Id of a user that made the post, used to find the user picture.
*	post: The actual code that would be shown to the viewer
*	count: Fot like counter
*/ 

function Post(post) {
	const [comments,setComments] = useState([]);
	const [likeCount, setCount] = useState(0);
	const [likes, setLikes] = useState(null);
	const [imageId, setImageId] = useState("");
	const [text, setText] = useState("");
	const [token, setToken] = useState(null)
	const [codeType, setCodeType] = useState("");


	useEffect(() => {
		// Setting up some innitial values before the render
		setToken(localStorage.getItem("auth_token"))
		setCount(post.count);
		setText(post.post);
		setCodeType(post.codeType);
		setLikes(JSON.stringify(post.likes));
		// Finding the comments linking to this post with id.
		fetch("http://localhost:3001/comments/" + post.id, {method: "get"})
		.then(res => res.json())
		.then(data => setComments(data))
		// Finding up the users picture to shown int the post
		// It would be better probably to send only the id, this could cause
		// some problems if the names would be too similar. 
		.then(() => {
			fetch("http://localhost:3001/users/picture/" + post.user, {method: "get"})
			.then(res => res.json())
			.then(data => {
				let image = data.profileImg;
				if (image === undefined) image = "";
				setImageId(image);
			})
		})
	},[post.likes,post.id, post.count, post.user, post.post, post.codeType]);

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
		fetch("http://localhost:3001/posts/like",{
			method: "PATCH",
			headers: {
				'Authorization': "Bearer " + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				like: buttonValue,
				count: newCount,
				postId: post.id,
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
			if(data.status === "ok") {
				let objectLikes = JSON.parse(likes);
				/*  
				*	Server sends info if the like was removed or added to database
				*	This intends to update it instantly to user so user dosen't need
				*	update the whole website to see correct information.
				*/  
				if(data.value) {
					delete objectLikes[userId];
				} else {
					objectLikes[userId] = buttonValue;
				}

				setLikes(JSON.stringify(objectLikes));
			}
		})
		.catch(err => {
			console.log(err.name)
			// If the token is expired it should logout the user. 
			if(err.message === 'Not logged in') {
				localStorage.removeItem("auth_token");
				localStorage.removeItem("userId");
				localStorage.removeItem("user");
				window.location.reload();
			}
		})
	}

	const createComment = (comment) => {
		return(
			<Comment
				key={comment._id}
				commentId={comment._id}
				username={comment.username}
				time={comment.time}
				comment={comment.comment}
				likes={comment.likes}
				count={comment.count}
				postId={comment.postId}
				edited={comment.edited}
				editTime={comment.editTime}
			/>
		);
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


	let linkString = "/Profile/" + post.user;
	// The post render portion.
	return(
		<div className="post">
			<div className="user">
				<div className="userInfo">
					{setPicture(imageId, "small")}
					<Link to={linkString}> {post.user} </Link>
					<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
					<p>{convertDate(post.time)}</p>
				</div>
				<div className="likeElement">
					<p>Likes: {likeCount}</p>
					<LikeButtons 
						userId={localStorage.getItem('userId')}
						likes={likes}
						token={token}
						addCount={addCount}
					/>
				</div>
			</div>
			<div className="content">
				<Highlight className={codeType}> 
					{text}
				</Highlight>
				{addEditText(post.edited, post.editTime)}
				<EditButton 
					id={post.id} 
					prevText={text}
					setNewText={setText} 
					author={post.user}
					token={token}
					type="post"
				/>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
			</div>
			<div className="comments">
				{comments.map((comment) => createComment(comment))}
				<AddComment parentId={post.id} token={token} />
			</div>
		</div>
	);

}

export default Post;