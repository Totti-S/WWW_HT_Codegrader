import React  from 'react';
import Post from "../components/Post.js";
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";


// This is the page to show clickked post. Url has to contain
// the posts id to find the post.

function ShowPost() {
	let { id } = useParams();
	const [info, setInfo] = useState(null); 

	useEffect(() => {
		fetch("http://localhost:3001/posts/" + id, {method: "get"})
		.then(res => res.json())
		.then(data => {
			setInfo(JSON.stringify(data[0]))
		})
	},[id])

	if(!info) {
		return (<div>"Not a post"</div>)
	} else {
		let post = JSON.parse(info);
		console.log(post.username)

		return(
			<Post 
				user={post.username}
				time={post.time}
				post={post.post}
				id={post._id}
				likes={post.likes}
				count={post.count}
				editTime={post.editTime}
				edited={post.edited}
				codeType={post.codeType}
			/>
		);
	}

}

export default ShowPost;