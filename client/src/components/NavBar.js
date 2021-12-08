import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';


/*
	This makes the navigation bar that will be shown at all webpages. 
*/

function NavBar() {

	/* 
		This innerfunction "profile" is here to determine whether somebody has
		logged in. NavBar will differ somewhat if user has logged in i.e. "register"
		button is not in the navigation bar. The vefication is made by finding authorized
		token from the localStorage.
	*/
	const profile = () => {
		// Logout buttons function to remove localStorage
 		const onclick = () => {
 			localStorage.removeItem('user');
 			localStorage.removeItem('userId');
 			localStorage.removeItem('auth_token');
 			window.location.reload();
 		}

		let token = localStorage.getItem("auth_token");

		// Showing different things if logged in
		if(token){
			let username = localStorage.getItem("user");
			let linkString = "/Profile/"+username
			return (
				<Fragment>
					<li><Link to={window.location.pathname} onClick={onclick}>Logout</Link></li>
					<li><Link to={linkString}>{username}</Link></li>
				</Fragment>
			);
		} else {
			return(
				<Fragment>
					<li><Link to="/Login">Login</Link></li>
	   				<li><Link to="/Register">Register</Link></li>
	   			</Fragment>
   			)
		}
	}

	return (
		<nav>
			<div className="nav-wrapper">
				<Link to="/" className="left brand-logo">CodeRater</Link>
				<ul id="nav-mobile" className="right hide-on-med-and-down">
					<li><Link to="/">Home</Link></li>
					{profile()}
       			</ul>
			</div>
		</nav>
	);
};

export default NavBar;
// eof