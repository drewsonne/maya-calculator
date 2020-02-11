import React, { Component } from 'react';

import TypeChecker from '../parser/type-checker';
import LongCount from "../elements/long-count";
import CalendarRound from "../elements/calendar-round";

class Page extends Component {

  render() {
    return (
      <div className="Page">
        <textarea
          className="Input"
          onInput={this.props.onInput}
          id={'page_' + this.props.id}
        />
        <div className="Output">
          <table className="monospace">
            <thead>
            <tr>
              <th>C. Round</th>
              <th>Pos.</th>
              <th>Long Count</th>
              <th>Gregorian</th>
              <th>Julian</th>
              <th>Night</th>
              <th className="left_align">Annotation</th>
            </tr>
            </thead>
            <tbody>
            {this.props.elements.map(element => {
              if (TypeChecker.is_full_date(element)) {

              } else if (TypeChecker.is_long_count_token(element)) {
                return <LongCount lc={element.lc}/>;
              } else if (TypeChecker.is_long_count(element)) {
                return <LongCount lc={element}/>;
              } else if (TypeChecker.is_calendar_round(element)) {
                return <CalendarRound cr={element}/>;
              }
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  onInput(content) {
    debugger
  }
}

export default Page;