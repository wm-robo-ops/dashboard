import React from 'react';
import { LineChart } from 'react-d3';

export default class NetworkLineChart extends React.Component {
  render() {
    let { data } = this.props;
    let lineData = [{
      values: data.map(d => {
        return {
          x: d.time,
          y: d.speed
        };
      })
    }];
    return (
      <LineChart
        data={lineData}
        xAxisLabel='Time'
        yAxisLabel='Speed'
      />
    );
  }
}
