import React from 'react';
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots
} from 'react-sparklines';

export default class NetworkSparkline extends React.Component {
  render() {
    let { speed } = this.props;
    return (
      <Sparklines data={speed} width={310} height={70} margin={6}>
        <SparklinesLine style={{fill: 'none', strokeWidth: 3}} />
        <SparklinesSpots size={4} style={{ stroke: '#000', strokeWidth: 2, fill: 'white'}} />
      </Sparklines>
    );
  }
}
