import React from 'react';
import SmallPost from "../components/SmallPost.js";
import {useState} from "react";
import Button from '@mui/material/Button';

/*
*	This component handles the amount of posts that will be shown
*	to viewer and creates buttons to navigate the pages 
*	
*	Takes in:
*		length - the amount of "content" (=posts)
*		posts - All the posts in a array
*
* 	Could be made to do the same to comments.
*	This probably should be to be hoc-compponent.
*/

function Pager(prop) {
	const [currentPage, setPage] = useState(0);
	const length = prop.length;
	const posts = prop.posts;

	// Only shows 10 posts per page -> Could be made to be prop
	let lastPage = Math.ceil(length/10)

	// Adds one to current page number if it isn't the last page already
	const plusCount = () => {
		let newPage = currentPage + 1;
		newPage >= lastPage ? setPage(currentPage) : setPage(newPage)
	}	

	// Subtracts one from the current page number if it isn't the first page 
	const minusCount = () => {
		let newPage = currentPage - 1;
		newPage < 0 ? setPage(currentPage) : setPage(newPage);
	}	

	const createTitlePost = (post) => {
		return (<SmallPost
			user={post.username}
			key={post._id}
			id={post._id}
			title={post.title}
			time={post.time}
			count={post.count}
		/>);
	}

	// Only show the pager elements if there is more than 10 posts.
	if(length <= 10) {
		return (
			<div className="posts">
				{posts.map((post) => createTitlePost(post))}	
			</div>
		);
	} else {
		// This cuts to the right part of the array to be shown to the viewer.
		let portionOfPosts = posts.slice(currentPage*10, (currentPage+1)*10);

		return(
			<div className="posts">
				<div className="wrapper-pager">
					<div className="pager">
						<Button onClick={minusCount}> Prev </Button>
						<p>{currentPage +1} / {lastPage}</p>
						<Button onClick={plusCount}> Next </Button>
					</div>
				</div>
				<div>
				{portionOfPosts.map((post) => createTitlePost(post))}	
				</div>
				<div className="wrapper-pager">
					<div className="pager">
						<Button onClick={minusCount}> Prev </Button>
						<p>{currentPage+1} / {lastPage}</p>
						<Button onClick={plusCount}> Next </Button>
					</div>
				</div>
			</div>
		)
	}
}

export default Pager;