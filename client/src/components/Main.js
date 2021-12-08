import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Home from '../pages/Home.js';
import Register from '../pages/Register.js';
import Login from '../pages/Login.js';
import Profile from '../pages/Profile.js';
import ShowPost from '../pages/ShowPost.js';
import NewPost from '../pages/NewPost.js';

/*
*  This is only here to be the "Router"- component. All the paths sould be added here if
*  it could be accessed by the viewer.  
*/
const Main = () => {

	return (
		<Routes> {/* The Routes decides which component to show based on the current URL.*/}
			<Route exact path='/' element={<Home/>} />
			<Route exact path='/Register' element={<Register/>} />
			<Route exact path='/Login' element={<Login/>} />
			<Route path={'/Profile/:user'} element={<Profile/>} />
			<Route path={'/Post/:id'} element={<ShowPost/>} />
			<Route path={'/NewPost'} element={<NewPost/>} />
	  	</Routes>
	);
}

export default Main; 