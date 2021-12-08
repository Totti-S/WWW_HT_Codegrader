import React from 'react';
import {useState, useEffect} from "react";
import Pager from "../components/Pager.js";

/*	
*	Downloads all the post to see from the database
*	Could be used to find posts from specific user i.e. 
*	in profile to see.
*	Takes in: user - username string for finding the posts. If empty
*   finnds every post.
*  
*	Uses "Pager"-component for limiting posts to see at once.
*/
function Posts(info) {
	let [posts,setPosts] = useState([]);

	useEffect(() => {
		let url = "http://localhost:3001/posts/" + (info.user === "ALL" ? "" : info.user);
		fetch(url, {method: "get"})
		.then(res => res.json())
		.then(data => setPosts(data))
	},[info.user]);


	if(posts.length === 0) {
		return (
			<div className="posts">
				<span>No Post available!</span>	
			</div>
		);
	} else {
		console.log(posts)
		return (
			<Pager
				posts={posts}
				length={posts.length}
			/>
		);
	}
}

export default Posts;
