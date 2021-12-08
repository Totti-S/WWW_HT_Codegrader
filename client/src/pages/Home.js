import Posts from "../components/Posts.js";
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import React from 'react';

//  Index page 

function Home() {

	// Render the button only if user is logged in 
	const showAddPost = () => {
		if (localStorage.getItem("auth_token")) {
			return (<Link to="/NewPost"><Button style={{border: "1px solid"}}> Make a Post </Button></Link>);
		} else {
			return null
		}
	}

	return (
	
		<div className="Home">
			{showAddPost()}
			<Posts user="ALL"/>
		</div>
	);
}

export default Home;