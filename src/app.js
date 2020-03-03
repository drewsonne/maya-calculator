import React, { Component } from 'react';
import Workspace from './workspace/workspace';
import logo from './ajaw.png';

class App extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="grid-container">
        <div className="Navbar">
          <img src={logo} width="40" height="40" alt="Maya Calculator"/>
          <span id="title">Maya Calendar Calculator</span>
        </div>
        <div className="Top-Margin"/>
        <div className="Left-Margin"/>
        <div className="Right-Margin"/>
        <div className="Bottom-Margin"/>
        <Workspace/>
      </div>
    );
  }
}

export default App;
