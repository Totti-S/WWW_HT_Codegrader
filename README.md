# Documentation for Codegrader
! **THIS IS WINDOWS MANUAL**, instructions may differ on different os.

Codegrader is application for sharing code in website where every visitor can see it. 
Application allows registered users to \
post new codes, comment and like different code posts other user have made.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Additional documentation: Source code has relation pictures. "MongoDB-Relations" is little outdated, but mostly correct.

## Table of Contents

1. Installation guide
2. User Manual
3. Technologies used
4. List of features

## Installation Guide

### Prerequisites

**Node.js** 
Nodejs needs to be installed. Version node 12 was used in this project. Installation guide for newest for windows [here](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm)

To install node 12 you need to follow only steps 1-5 in node installation manual. After that use `nvm install 12`

**MongoDB**
This project uses mongo as its database. This project used local database, and you can use 
this [installation](https://www.mongodb.com/try/download/community).

### Installation


Download the source code from github repository at https://github.com \
preferably to own folder

Once downloaded, open the source code folder with command prompt and \
install dependencies with `npm install`.

When completed, you can start the application using `npm run dev` in \
command prompt at the source code folder. This should run the app. If it dosen't open browser \
automatically open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## User Manual

At the home page, if any posts is made, you can click individual post to see the \
code and it's comments. If there is more than 10 post to be shown the home page will \
show a pager that shows 10 post per page.

#### Register

To make a new code post, application user should register, by pressing the navigation \
bar *'Register'* button. This will redirect user to register page.

New user should have name that is not already in use. 
New Password field has to have at least:
* 8 characters
* One lower and upper case letter
* One number
* One special character

Successful registration will redirect to login page

#### Login

If user is in the home page you get to the login page by pressing the navigation \
bar *'Login'* button.

Successful registration will redirect to home page

Navigation bar dislays *"Logout"* button, for logging out.  

**NOTE** : User can be only 30mins logged in. Then it will automatically log user out

#### Making a New code post

***Only registered users actions***

If user is is in the home page. They can make a new post pressing the "Make a Post". \
By pressing it, page will redirect to page where you can name and post your code.  \
**This button is not visiable if the user isn't logged in**

User can submit only if title and code fields are not empty.

User can later edit or delete his/her own posts. Title can't be changed.

#### Commenting and liking a post

***Only registered users actions***

User can comment and like the post. Making new comment user should press "New comment" \
button on the bottom of the individual posts page. 

User can later edit or delete his/her own comments.

User can like or dislike any post or comment only once. User may chance cancel or \
chance the liking at any time.

#### User Profile

Anybody can access any users profile page by pressing name on the post or comment.

***Only registered users actions***

To access the user profile from home page, press the username in top-right corner (in navigation bar)

User may put a picture to and additional to everybody to see \
in the profile page and in every comment/post that user has made. 

By default there is only registration time to seen in the profile. 

User may edit or delete his/her profile information at any time.

#### Administiration privalages

Administration privalged user can delete and edit every post or comment.

Admin privalge can be turned on only accessing the database and edinting  \
the datafield *"admin"* to true.

## Technologies
This project is written in JS, styles in CSS

This project uses:

* React -> Frontend
* Node.js -> Backend
* MongoDB (Mongoose) -> Database
* Express.js -> Routing
* Materialize -> Mobile users + Looks better
* JWT -> Verfication


## List of features

This project has (ref. project assigment doc.):
* "Users can edit their own comments/posts"

* "Utilization of a frontside framework: **React**"

* "Use some highlight library for the code snippets: **react-highlight**"

* "Use of a pager when there is more than 10 posts available"

* "Admin account with rights to edit all the post and comments and delete content"
   * **Note**: There is no ready admin account. More info check manual
* "Vote (up or down) posts or comments (only one vote per user)"
* "User can click username and see user profile page where
name, register date, (user picture) and user bio is listed"
* "Last edited timestamp is stored and shown with posts/comments"
* Code **IS**  written and commented in english

Aiming for the full 50p : this list should give me 52p if done correctly.

This documentation last edited: 8.12.2021

This documentation is orginally written by Totti Sillanpää
