import React from 'react';
import {Link} from "react-router-dom";
import convertDate from "../functions/convertDate.js";


/*
	This component is making small post header for Home-page.
	If clickked, redericts to that post
	Only includes small portion of the posts info

	Takes in: time - posts creation time
	title - posts title
	user - posts author
	count - current like amount
*/

function SmallPost(prop){
	return(
		<Link to={`/Post/${prop.id}`}> 
			<div className="smallPost" >
				<p>{convertDate(prop.time)}     {prop.title}   {prop.user}   likes:{prop.count} </p> 
			</div>
		</Link>
	);
}


export default SmallPost; 