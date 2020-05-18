import React from 'react';
import PropTypes from 'prop-types';

export default class LongCountElement extends React.Component {
  render() {
    const cr = this.props.lc.buildCalendarRound();
    return (
      <tr className="data-row">
        <td className="calendar_round">
          {cr.tzolkin.toString()}
        </td>
        <td className="calendar_round">
          {cr.haab.toString()}
        </td>
        <td className="calendar_round_position">
          {/*${new CalendarRound(this.total_k_in()).total_days}*/}
        </td>
        <td className="long_count">{this.props.lc.toString()}</td>
        <td className="lord_of_night">{this.props.lc.lordOfNight.toString()}</td>
        <td className="gregorian">{this.props.lc.gregorian.toString()}</td>
        <td className="julian">{this.props.lc.julian.toString()}</td>
        <td className="comment">
          {/*{this.props.lc.comment}*/}
        </td>
      </tr>
    );
  }
}

LongCountElement.propTypes = {
  lc: PropTypes.object
};
