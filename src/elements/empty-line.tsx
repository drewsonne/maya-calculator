import React from 'react';

export default class EmptyLineElement extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <tr className="data-row">
        <td colSpan={8}>&nbsp;</td>
      </tr>
    );
  }
}
