import React from 'react';

export default class Time extends React.Component {
  render() {
    var { startTime } = this.props;
    var t = startTime.split(':');
    var hours = +t[0], minutes = +t[1];
    var alrt = hours === 0 && minutes < 20;
    return <div>
      Remaining Time: <span className={`bold ${alrt ? 'red' : ''}`}>{startTime}</span>
    </div>;
  }
}

Time.propTypes = {
  startTime: React.PropTypes.string.isRequired
};
