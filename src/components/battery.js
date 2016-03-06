import React from 'React';

class BatteryPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { batteryLevel } = this.props;
    return <div className='ui indicating progress active' data-percent={`${batteryLevel}`}>
      <div className='bar' style={{ width: batteryLevel + '%' }}></div>
      <div className='label'>battery: {batteryLevel}%</div>
    </div>;
  }
}

BatteryPanel.propTypes = {
  batteryLevel: React.PropTypes.number
};

export default BatteryPanel;
