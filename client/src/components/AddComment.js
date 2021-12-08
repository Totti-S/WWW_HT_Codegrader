import React  from 'react';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


/*
*	Creates button that allows user to make a new comment.
*	Very similar to "EditButton.js" -> Could probably be fused to one
*/

function AddComment(prop) {
	const [commentText, setText] = useState("");
	const [btnDisp, setButton] = useState(true);
	const [fieldDisp, setField] = useState(false);
	const [submitDisp, setSubmit] = useState(false);

	// These are the styles to hide or show the buttons and fields 
	const buttonStyle = {
		border: "1px solid",
		display: (btnDisp ? "inline" : "none")
	};

	const fieldStyle = {
		display: (fieldDisp ? "inline-flex" : "none")
	};

	const submitStyle = {
		border: "1px solid",
		display: (submitDisp ? "inline" : "none")
	};
	// Disables the submit button if nothing is written to field
	const checkText = (commentText === "" ? true : false);

	// These are button functions set the styles to hide or show button
	const onEdit = () => {
		setField(true);
		setButton(false);
		setSubmit(true);
	}

	const onCancel = () => {
		setField(false);
		setButton(true);
		setSubmit(false);
	}

	/*
	*	On submit will send the server a new comment. Takes comment text,
	*	auth_token, time and postId for parameters to the fetch request.
	*	If failed for the old token, this will logout the user and refresh the page 
	*/


	const onSubmit = (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);
		formData.set("time", new Date());
		formData.set("postId",prop.parentId)
		
		let token = localStorage.getItem("auth_token");

		fetch("http://localhost:3001/comments/", {
			method: "POST",
			headers: {
				'Authorization': "Bearer " + token,
			},
			body: formData
		})
		.then(res => { 
			if (res.ok) {
				res.json()
			} else {
				throw new Error('Not logged in')
			}
		})
		.then(data => {
			if(data && data.status === "ok") {
				window.location.reload()
			}
		})
		.catch(err => {
			// If the token is expired it should logout the user. 
			if(err.message === 'Not logged in') {
				localStorage.removeItem("auth_token");
				localStorage.removeItem("userId");
				localStorage.removeItem("user");
				window.location.reload();
			}
		})
	}
	
	// Render only, when user is logged in
	if(prop.token) {
		return(
			<div className="addCommentDiv">
				<form onSubmit={onSubmit}>
					<TextField
						name="comment"
						value={commentText}
			        	id="outlined-textarea"
			        	label="Make a Comment"
			        	multiline
			        	style={fieldStyle}
			        	onChange={(e) => setText(e.target.value)} 
			    	/>
					<Button className="addComment" onClick={onEdit} style={buttonStyle}>
						New Comment
					</Button>
					<Button type="submit" style={submitStyle} disabled={checkText}>
						Submit
					</Button>
					<Button className="cancelComment" onClick={onCancel} style={submitStyle}>
						Cancel
					</Button>
				</form>
			</div>
		);
	} else {
		return null;
	}
}

export default AddComment;
