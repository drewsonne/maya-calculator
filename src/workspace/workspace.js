import React, { Component } from 'react';
import Page from './page';
import ComplexCalculatorParser from '../parser/calculator-parser-complex';
import Calculator from '../calculator';

// const ComplexCalculatorParser = require('../parser/calculator-parser');

class Workspace extends Component {
  constructor() {
    super();
    this.state = {
      pages: [{ id: 0, inputContent: '', elements: [] }]
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
      <div className="Workspace">{this.state.pages.map((page) => <Page
        key={page.id}
        onInput={this.onInput}
        id={page.id}
        content={page.inputContent}
        elements={that.state.pages[page.id].elements}
      />)}</div>
    );
  }

  onInput(textBox) {
    // Resize textbox to fit text

    // eslint-disable-next-line no-param-reassign
    textBox.target.style.height = '5px';
    // eslint-disable-next-line no-param-reassign
    textBox.target.style.height = `${textBox.target.scrollHeight}px`;

    let pageId = textBox.target.id.split('_')[1];
    pageId = parseInt(pageId, 10);
    const content = textBox.target.value;
    // const after = null;
    const that = this;
    clearTimeout(that.inputTimers[pageId]);
    that.inputTimers[pageId] = setTimeout(() => {
      clearTimeout(that.inputTimers[pageId]);
      // Disable page appending
      // if (content.includes('---')) {
      //   [content, after] = content.split('---');
      //   that.updatePage(pageId, content);
      //   that.appendPage(after);
      // }

      const parts = new ComplexCalculatorParser(content).run();
      that.state.pages[pageId].elements = new Calculator(
        parts
      ).run();

      that.setState(that.state);
    }, 250);
  }

  updatePage(id, content) {
    const { state } = this;
    const { pages } = state;
    pages[id].inputContent = content;
    state.pages = pages;
    this.setState(state);
  }

  addPage(id, content) {
    const { state } = this;
    const { pages } = state;
    pages.push({
      id,
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
