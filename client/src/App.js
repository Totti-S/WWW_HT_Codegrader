import React  from 'react';
import './App.css';
import NavBar from "./components/NavBar.js"
import Main from "./components/Main.js"

// Starts the app: Always render Navbar, Main houses the Router

function App() {
  return (
    <div className="App">
      <NavBar />
      <Main />
    </div>
  );
}

export default App;
