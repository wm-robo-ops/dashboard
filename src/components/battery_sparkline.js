import React from 'react';
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots
} from 'react-sparklines';

export default class BatterySparkline extends React.Component {
  render() {
    let { level } = this.props;
    return (
      <Sparklines data={level} width={310} height={170} margin={6}>
        <SparklinesLine color='#56b45d' style={{strokeWidth: 3}} />
        <SparklinesSpots size={4}/>
      </Sparklines>
    );
  }
}
