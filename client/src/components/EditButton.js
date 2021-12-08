import React  from 'react';
import Button from '@mui/material/Button';
import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';

/*
*	Makes the "edit"- button and the edit field for user to edit
*	post or comments. Only user should be allowed to edit.
*	Alse make "Delete", "Submit", "Cancel" Buttons if "Edit" is pressed.
*
*	!! This can be only used in single field edits.
*	!! If multiple fields sould be shown at once, this component CANT do it
*	
*   Takes in:
*    	prevText - to be set already in the field if edit-button is pressed
*		type - to set right path to update data for server
*		id - to set right path to update data for server
*		
*/

function EditButton(prop) {
	const [editText, setText] = useState("");

	// These are tracking if the the edit button is pressed and will shown
	// "Cancel" and "Delete" button only if edit button is pressed. 
	const [btnDisp, setButton] = useState(true);
	const [fieldDisp, setField] = useState(false);
	const [submitDisp, setSubmit] = useState(false);

	useEffect(() => {
		setText(prop.prevText)
	},[prop.prevText])

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

	// Deletes the post/comment and refreshes the page
	const onDelete = () => {
		let token = localStorage.getItem("auth_token")

		fetch("http://localhost:3001/"+ prop.type + "s/" + prop.id, {
			method: "Delete",
			headers: {
				'Authorization': "Bearer " + token
			},
		}).then(() => {
			window.location.reload();
		});
	}

	/*
	*	On submit it will update the information to the server. It will update
	*	the data for page from the response. If not 
	*/
	const onSubmit = (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);
		formData.set("time", new Date());
		let token = localStorage.getItem("auth_token");

		fetch("http://localhost:3001/"+ prop.type + "s/" + prop.id, {
			method: "PATCH",
			headers: {
				'Authorization': "Bearer " + token
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
			if(data && data.newText) {
				prop.setNewText(data.newText);
			}
			// hide the editfield and submit button
			setField(false);
			setButton(true);
			setSubmit(false);
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

	if(prop.token) {
		let payload = JSON.parse(window.atob(prop.token.split('.')[1]));
		let username = payload.username;
		let admin = payload.admin;
		// Render edit block only if user is admin or is made post/comment
		if (prop.author === username || admin)  {
			return (
				<div className="editDiv">
					<form onSubmit={onSubmit}>
						<TextField
							name="content"
							value={editText}
				        	id="outlined-textarea"
				        	label="Edit"
				        	multiline
				        	style={fieldStyle}
				        	onChange={(e) => setText(e.target.value)} 
				    	/>
						<Button className="editContent" onClick={onEdit} style={buttonStyle}>
							Edit
						</Button>
						<Button type="submit" style={submitStyle}>
							Submit
						</Button>
						<Button className="cancelEdit" onClick={onCancel} style={submitStyle}>
							Cancel
						</Button>
						<Button className="deleteEdit" onClick={onDelete} style={submitStyle}>
							Delete
						</Button>
					</form>
				</div>
			);
		}
	} else {
		return null
	}

}
export default EditButton; 