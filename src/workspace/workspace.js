import React, {Component} from 'react';
import Page from "./page";
import ComplexCalculatorParser from '../parser/calculator-parser';

// const ComplexCalculatorParser = require('../parser/calculator-parser');

class Workspace extends Component {
    constructor() {
        super();
        this.state = {
            'pages': [{id: 0, inputContent: '', output: ''}]
        };
        this.onInput = this.onInput.bind(this);
        this.inputTimers = {};
    }

    createPage() {
        this.state.pages.push(
            this.state.pages.length
        );
    }

    render() {
        return (
            <div className="Workspace">{this.state.pages.map(page => {
                return <Page key={page.id} onInput={this.onInput} id={page.id} content={page.inputContent}/>;
            })}</div>
        );
    }

    onInput(a, b, c, d) {
        let page_id = a.target.id.split('_')[1];
        let that = this;
        clearTimeout(that.inputTimers[page_id]);
        that.inputTimers[page_id] = setInterval(function () {
            let content = a.target.innerText;
            if (content.includes('---')) {
                let content_parts = content.split('---');
                let content = content_parts[0];
                let after = content_parts[1];
                that.updatePage(page_id, content);
                that.appendPage(after);
                clearTimeout(that.inputTimers[page_id]);
            }

            let pages = that.state.pages;
            let page = pages[page_id];
            page.output = new ComplexCalculatorParser();
        }, 500);
    }

    updatePage(id, content) {
        let state = this.state;
        let pages = state.pages;
        pages[id].inputContent = content;
        state.pages = pages;
        this.setState(state);
    }

    addPage(id, content) {
        let state = this.state;
        let pages = state.pages;
        pages.push({
            id: id,
            inputContent: content
        });
        state.pages = pages;
        this.setState(state);
    }

    appendPage(content) {
        this.addPage(this.state.pages.length, content);
    }
}

export default Workspace;