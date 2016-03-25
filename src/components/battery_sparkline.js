import React from 'react';
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots
} from 'react-sparklines';

export default class BatterySparkline extends React.Component {
  render() {
    return (
      <Sparklines data={this.props.level} width={310} height={170} margin={6}>
        <SparklinesLine color='#56b45d' style={{strokeWidth: 3}} />
        <SparklinesSpots size={4}/>
      </Sparklines>
    );
  }
}

BatterySparkline.propTypes = {
  level: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired
};
