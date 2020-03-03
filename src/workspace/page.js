import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TypeChecker from '../parser/type-checker';
import LongCount from '../elements/long-count';
import EmptyLine from '../elements/empty-line';
import CalendarRound from '../elements/calendar-round';

export default class Page extends Component {
  render() {
    return (
      <div className="Page">
        <textarea
          className="Input"
          onInput={this.props.onInput}
          id={`page_${this.props.id}`}
        />
        <div className="Output">
          <table className="monospace">
            <thead>
            <tr>
              <th colSpan={3} className="center_align">Calendar Round</th>
              <th rowSpan={2}>Long Count</th>
              <th rowSpan={2}>Night</th>
              <th rowSpan={2}>Gregorian</th>
              <th rowSpan={2}>Julian</th>
              <th rowSpan={2}>Annotation</th>
            </tr>
            <tr>
              <th>260-day</th>
              <th>Haab</th>
              <th>Position</th>
            </tr>
            </thead>
            <tbody>
            {this.props.elements.map((element) => {
              if (TypeChecker.isLine(element)) {
                return <EmptyLine/>;
              }
              if (TypeChecker.isFullDate(element)) {
                return <EmptyLine/>;
              }
              if (TypeChecker.isLongCountToken(element)) {
                return <LongCount lc={element.lc}/>;
              }
              if (TypeChecker.isLongCount(element)) {
                return <LongCount lc={element}/>;
              }
              if (TypeChecker.isCalendarRound(element)) {
                return <CalendarRound calendarRound={element}/>;
              }
              return <EmptyLine/>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  onInput: PropTypes.func.isRequired,
  id: PropTypes.number,
  elements: PropTypes.array,
};
