import React, {Component} from 'react';

class Page extends Component {

    render() {
        return (
            <div className="Page">
                <div className="Input" contentEditable={true} onInput={this.props.onInput}
                     id={'page_' + this.props.id}>{this.props.content}</div>
                <div className="Output"/>
            </div>
        );
    }

    onInput(content) {
        debugger
    }
}

export default Page;