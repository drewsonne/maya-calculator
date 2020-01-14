import React, {Component} from 'react';
import Workspace from "./workspace/workspace";
import logo from './ajaw.png';

class App extends Component {
    render() {
        return (
            <div className="grid-container">
                <div className="Navbar">
                    <img src={logo} width="40" height="40" alt="Maya Calculator"/>
                    <span id="title">
                        Maya Calendar Calculator
                    </span>
                </div>
                <div className="Top-Margin"></div>
                <div className="Left-Margin"></div>
                <div className="Right-Margin"></div>
                <div className="Bottom-Margin"></div>
                <Workspace/>
            </div>
        );
    }
}

export default App;