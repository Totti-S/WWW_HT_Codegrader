import React from 'react';
import {Fragment, useState, useEffect} from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import {useParams} from "react-router-dom";
import setPicture from "../functions/setPicture.js";
import convertDate from "../functions/convertDate.js";

/*
	Profile page. Shows all the information about user that is
	viewed. 

	Takes in username from url
*/


function Profile() {
	let { user } = useParams();
	// This holds user profile information. This is an object
	const [profile, setProfile] = useState(null);
	
	// From the "profile"- object we make these variables to make quick
	// changes to website when edited
	const [created , setCreated] = useState(null);
	const [nameText, setName] = useState("");
	const [ageText, setAge] = useState(0);
	const [genderText, setGender] = useState("");
	const [emailText, setEmail] = useState("");
	const [aboutText, setAbout] = useState("");
	const [pictureID, setPictureID] = useState("");
	// These variables track image file
	const [selectedFile, setSelectedFile] = useState(null);
	const [selected, setSelected] = useState(false);
	// These sets up button styles for edit button.
	const [btnDisp, setButton] = useState(false);
	const [fieldDisp, setField] = useState(false);
	const [submitDisp, setSubmit] = useState(false);


	useEffect(() => {
		let token = localStorage.getItem("auth_token");
		if(token) {
			let username = localStorage.getItem("user");
			if(user === username) setButton(true)
		}
		// We fetch the users profile information
		fetch("http://localhost:3001/users/" + user, {method: 'GET'})
		.then(res => res.json())
		.then(data => {
			if(!data.errors) {
				setCreated(convertDate(data.profile.created));
				setProfile(JSON.stringify(data.profile));
			}
		})
	},[user]);

	// Edit button related styles
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

	// Edit buttons function
	const onEdit = () => {
		let info = JSON.parse(profile);

		setName(info.name);
		setGender(info.gender);
		setEmail(info.email);
		setAbout(info.about);
		setAge(info.age);
		setPictureID(info.profileImg);

		setField(true);
		setSubmit(true);
		setButton(false);
	}
	/*
		This submit will update the profile information.
	*/
	const onSubmit = (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);
		let token = localStorage.getItem("auth_token");
		let username = localStorage.getItem("user");

		// Checks if any picture was selected or "default"
		// picture button was pressed
		if(selected) {
			formData.set("image","Default")
		} else if (!selectedFile) {
			formData.set("image",pictureID)
		}

		setSelected(false)

		fetch("http://localhost:3001/users/profile/" + username, {
			method: "PATCH",
			headers: {
				'Authorization': "Bearer " + token
			},
			body: formData
		})
		.then(res => {		
			if (res.ok) {
				return res.json();
			} else {
				throw new Error('Not logged in')
			}
		})
		.then(data => setProfile(JSON.stringify(data.profile)))
		.catch(err => {
			console.log(err)
			// Will logout the user if token was expired
			if(err.message === 'Not logged in') {
				localStorage.removeItem("auth_token");
				localStorage.removeItem("userId");
				localStorage.removeItem("user");
				window.location.reload();
			}
		})

		setField(false);
		setSubmit(false);
		setButton(true);
	}

	const onCancel = () => {
		setField(false);
		setSubmit(false);
		setButton(true);
	}
	
	// If the profile field happend to be empty, we replece it with "No information given"
	const checkIfEmpty = (value) => {
		if(!value) {return "No information given" }

		if(typeof(value) === 'string') {
			return value === "" ? "No information given" : value;
		}
		else if(typeof(value) === 'number') {
			return value ? value : "No information given";
		}
	}

	const makeTextField = (value, setter, name) => {
		return(
			<TextField
				name={name}
				value={value}
	        	id="outlined-textarea"
	        	label="Edit"
	        	multiline
	        	style={fieldStyle}
	        	onChange={(e) => setter(e.target.value)} 
    		/>
		);
	}

	/*
		The bulk of the code.
		Will setup profile fields from "profile" variable and sets up 
		edit fields, if profile page's own user is present to use them 
	*/

	const profileInfo = () => {
		if(!profile) { 
			return(
				<h5>There is no profile page of "{user}"</h5>
			);
		} else {
			let info = JSON.parse(profile);

			let name = checkIfEmpty(info.name);
			let gender = checkIfEmpty(info.gender);
			let email = checkIfEmpty(info.email);
			let about = checkIfEmpty(info.about);
			let age = checkIfEmpty(info.age); 
			let pic = info.profileImg;
			
			return( 
				<Fragment>

					{setPicture(pic)}

					<input
						name="image"
						type="file" 
						accept="image/*" 
						style={fieldStyle} 
						onChange={(e) => setSelectedFile(e.target.files[0])}
					/>

					<ToggleButton 
						value="check"
						style={fieldStyle}
  						selected={selected}
  						onChange={() => {
    					setSelected(!selected);
  						}}
					> 
						Default Picture 
					</ToggleButton>

					<p> Created : {created}</p>
					<p> Name : {name}</p>
					{makeTextField(nameText, setName, "name")}
					<p> Age : {age} </p>

					<Select
					  name="age"
			          value={ageText}
			          label="Age"
			          style={fieldStyle}
			          onChange={(e) => setAge(e.target.value)}
			        >
		         		{Array.from(new Array(101), (x,value) => {return (
		         			<MenuItem value={value}>{value}</MenuItem>
						)})}
	        		</Select>

					<p> Gender : {gender} </p>

					<Select
					  name="gender"
			          value={genderText}
			          label="Gender"
			          style={fieldStyle}
			          onChange={(e) => setGender(e.target.value)}
			        >
		         		{['Male', 'Female', 'Other'].map((value) => {return (
		         			<MenuItem value={value}>{value}</MenuItem>
						)})}
	        		</Select>

					<p> Email : {email} </p>
					{makeTextField(emailText, setEmail, "email")}
					<p> About : {about} </p>	
					{makeTextField(aboutText, setAbout, "about")}	
				</Fragment>
			);
		}
	}


	return (
		<div className="Profile">
			<form onSubmit={onSubmit}>
				{profileInfo()}
				<Button type="submit" style={submitStyle}>
					Save
				</Button>
			</form>
			<Button className="editContent" onClick={onEdit} style={buttonStyle}>
				Edit
			</Button>
			<Button className="cancelEdit" onClick={onCancel} style={submitStyle}>
				Cancel
			</Button>
		</div>
	);
};

export default Profile;
