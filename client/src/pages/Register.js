import React, {useState} from 'react';

// Register page.
// Very similar to "Login.js"
// Succesful registeration redirects to "login" page

function Register() {
	const [errors, setErrors] = useState(""); 

	const onSubmit = (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);

		fetch("http://localhost:3001/users/register", {
			method: "post",
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			if(data && data.status === "ok") {
				window.location.href="/login";
			} else {
				if(data && data.errors) {
					let err = data.errors;
					let errorText = "";
	    			let p = 0; let e = 0; // Only one of each error is trackked.
	    			// Very bad way to check and track all the errors only once
	    			for (var i = 0; i < err.length; i++) {
	    				if(err[i].param === 'password' && p === 0) {
			    			p = 1;
			    			errorText += "Password is not strong enough, ";
		    			} else if(err[i].param === 'username' && e === 0) {
			    			e = 1;
			    			errorText += "Username already in use";
			    		}
	    			}
	    			!p && !e ? setErrors("Very Strange error") : setErrors(errorText);
	    			
				}
			}
		
		})
	}

	const registerErrors = () => {
		if(errors) {
			return(
				<div className="errors">{errors}</div>
			);
		}
	}


	return (
		<div className="Register">
			<form onSubmit={onSubmit}>
				<input type="text" name="username" placeholder="Username" required/>
				<input type="password" name="password" placeholder="Password" required/>
				<button type="submit">Register</ button>
				{registerErrors()}
			</form>
		</div>
	);
};

export default Register;