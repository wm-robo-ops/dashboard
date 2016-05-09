import React from 'react';

export default class Time extends React.Component {
  render() {
    var { startTime } = this.props;
    var alrt = false;
    if (startTime) {
      var diff = 60 * 60 * 1000 - ((new Date()).getTime() - startTime);
      var d = new Date();
      d.setTime(diff);
      var h = d.getUTCHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      alrt = m < 15;
      if (h < 10) h = '0' + h;
      if (m < 10) m = '0' + m;
      if (s < 10) s = '0' + s;
      var timeElapsed = `${h}:${m}:${s}`;
    }
    return <div>
      <button className={`ui button basic ${startTime ? 'red' : 'green'}`} onClick={this.props.setStartTime.bind(this, (new Date()).getTime())}>
        {startTime ? 'reset' : 'start time'}
      </button>
      {startTime && <span>Remaining Time: <span className={`bold ${alrt ? 'red' : ''}`}>{timeElapsed}</span></span>}
    </div>;
  }
}
