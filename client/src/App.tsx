import React from "react";
import {
  BrowserRouter as Router,
  Routes ,
  Route,
} from "react-router-dom";
import "./App.css";

//components 
import HomePage from "./general_components/HomePage.tsx";
import AudioConductorPage from "./general_components/AudioConductorPage.tsx";
import AudioPlayerPage from "./general_components/AudioPlayerPage.tsx";

import background from "../src/images/background.png";

function App() {
  var sectionStyle = {
    backgroundImage: `url(${background})`,
  };

  return (
    <Router>
      <div className="container-fluid min-vh-100 view" style={sectionStyle}>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/:id/conductor" element={<AudioConductorPage/>}/>
          <Route path="/:id/player" element={<AudioPlayerPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;