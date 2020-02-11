import React, { Component } from 'react';
import Page from "./page";
import ComplexCalculatorParser from "../parser/calculator-parser-complex";
import Calculator from "../calculator";

// const ComplexCalculatorParser = require('../parser/calculator-parser');

class Workspace extends Component {
  constructor() {
    super();
    this.state = {
      'pages': [{id: 0, inputContent: '', elements: []}]
    };
    this.onInput = this.onInput.bind(this);
    this.inputTimers = {};
    this.parser = new ComplexCalculatorParser();
  }

  createPage() {
    this.state.pages.push(
      this.state.pages.length
    );
  }

  render() {
    const that = this;
    return (
      <div className="Workspace">{this.state.pages.map(page => {
        return <Page key={page.id} onInput={this.onInput} id={page.id}
                     content={page.inputContent} elements={that.state.pages[page.id].elements}/>;
      })}</div>
    );
  }

  onInput(a, b, c, d) {
    // Resize textbox to fit text
    a.target.style.height = "5px";
    a.target.style.height = (a.target.scrollHeight) + "px";
    let page_id = a.target.id.split('_')[1];
    page_id = parseInt(page_id, 10);
    let content = a.target.value;
    let that = this;
    clearTimeout(that.inputTimers[page_id]);
    that.inputTimers[page_id] = setTimeout(function () {
      clearTimeout(that.inputTimers[page_id]);
      if (content.includes('---')) {
        let content_parts = content.split('---');
        let content = content_parts[0];
        let after = content_parts[1];
        that.updatePage(page_id, content);
        that.appendPage(after);
      }

      that.state.pages[page_id].elements = new Calculator(
        that.parser.run(content)
      ).run();

      that.setState(that.state);
    }, 250);
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