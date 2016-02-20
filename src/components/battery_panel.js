import React from 'React';

export default class BatteryPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { batteryLevel } = this.props;
    return <div className='ui pink padded segment'>
      <h1 className='ui dividing header'>battery</h1>
      <div
        className='ui indicating progress active'
        data-percent={`${batteryLevel}`}>
        <div className='bar' style={{ width: batteryLevel + '%' }}></div>
        <div className='label'>
          battery: {batteryLevel}%
        </div>
      </div>
    </div>;
  }
}
