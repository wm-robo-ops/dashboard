import React from 'react';

export default class Time extends React.Component {
  render() {
    var { time } = this.props;
    var t = time.split(':');
    var hours = +t[0], minutes = +t[1];
    var alrt = hours === 0 && minutes < 20;
    return <div>
      Remaining Time: <span className={`bold ${alrt ? 'red' : ''}`}>{time}</span>
    </div>;
  }
}

Time.propTypes = {
  time: React.PropTypes.string.isRequired
};
