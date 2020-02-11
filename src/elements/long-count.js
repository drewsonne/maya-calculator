import React, { Component } from 'react';

export default class LongCountElement extends Component {
  render() {
    return (
      <tr className="data-row">
        <td className="calendar_round">
          {this.props.lc.buildCalendarRound().toString()}
        </td>
        <td className="calendar_round_position">
          {/*${new CalendarRound(this.total_k_in()).total_days}*/}
        </td>
        <td className="long_count">{this.props.lc.toString()}</td>
        <td className="gregorian">{this.props.lc.gregorian.toString()}</td>
        <td className="julian">{this.props.lc.julian.toString()}</td>
        {/*<td className="lord_of_night">{this.props.lc.lordOfNight.toString()}</td>*/}
        <td className="comment">
          {/*{this.props.lc.comment}*/}
        </td>
      </tr>
    );
  }
}