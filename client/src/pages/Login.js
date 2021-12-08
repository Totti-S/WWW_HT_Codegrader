import React, {useState} from 'react';
/* 
*	Login page. Will set token, userId and user to localStorage
*	Redirects to index page if successful login happened. 
*/

function Login() {
	const [errors, setErrors] = useState(""); 

	const onSubmit = (e) => {
		e.preventDefault();
		let formData = new FormData(e.target);

		fetch("http://localhost:3001/users/login", {
			method: "post",
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			if(data && data.token) {
				console.log(data)
				localStorage.setItem("auth_token", data.token);
				localStorage.setItem("userId", data.userId);
				localStorage.setItem("user", data.username);
				setErrors("");
			} else {
				if(data && data.errors) {
					setErrors("Invalid credentials");
				} else {
					setErrors("Very strange error!");
				}
			}
		}).then( () => {
			if(localStorage.getItem("auth_token")){
				window.location.href="/";
			}
		});
	}

	const loginErrors = () => {
		if(errors) {
			return(
				<div className="errors">{errors}</div>
			);
		}
	}

	return (
		<div className="Login">
			<form onSubmit={onSubmit}>
				<input type="text" name="username" placeholder="Username" required/>
				<input type="password" name="password" placeholder="Password" required/>
				<button type="submit">Login</ button>
				 {loginErrors()}		
			</form>
		</div>
	);

}

export default Login;