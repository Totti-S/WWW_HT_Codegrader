import React  from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Page to make new post. When created: sends it to server and
// redirects the user back to index page

function NewPost() {
	const [postText, setText] = useState("");
	const [codeType, setCodeType] = useState("");
	const [titleText, setTitle] = useState("");
	const languages = ["HTML","Bash","C++","C", "C#","CSS", "Markdown",
	"Ruby", "Go", "Java", "JavaScript","JSON", "Kotlin", "Less", "Lua", 
	"Makefile","Perl", "Objective-C", "PHP", "Python","R", "Rust", "SCSS", 
	"SQL", "Swift","TypeScript","Visual Basic .Net"];

	// Disables submit button if all fields are not filled
	const checkText = ((postText === "" || titleText === "" || codeType === "") ? true : false);

	const onSubmit = async (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);
		formData.set("time", new Date());
		
		let token = localStorage.getItem("auth_token");

		let response = await fetch("http://localhost:3001/posts/", {
			method: "POST",
			headers: {
				'Authorization': "Bearer " + token
			},
			body: formData
		})

		response = await response.json();
		// Sends you back to index page 
		if(response.status === "ok") window.location = "/"
		
		setText("");
		setCodeType("");
		setTitle("");
	}

	return (
		<div className="newPost">
			<form onSubmit={onSubmit}>
				<TextField
					name="title"
					value={titleText}
		        	id="outlined-textarea"
		        	label="Post Title"
		        	multiline
		        	onChange={(e) => setTitle(e.target.value)} 
	        	/>
				<TextField
					name="post"
					value={postText}
		        	id="outlined-textarea"
		        	label="Post Code"
		        	multiline
		        	onChange={(e) => setText(e.target.value)} 
	        	/>
	        	<Select
					  name="codeType"
			          value={codeType}
			          label="Code Type"
			          onChange={(e) => setCodeType(e.target.value)}
			        >
		         		{languages.map((value) => {return (
		         			<MenuItem value={value}>{value}</MenuItem>
						)})}
	        		</Select>
	        	<Button className="submitPost" type="submit" style={{border: "1px solid"}} disabled={checkText}>
					Submit
				</Button>
				<Link to="/">
					<Button className="cancelPost" style={{border: "1px solid"}}> 
						Cancel
					</Button>
				</Link>
			</form>
		</div>
	);
}

export default NewPost;