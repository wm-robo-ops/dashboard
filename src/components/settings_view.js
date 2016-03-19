import React from 'react';

export default class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  onMuteCheckBoxChange() {
    if (this.props.muted)
      this.props.unmute();
    else
      this.props.mute();
  }

  onMinBatterySliderChange(e) {
    this.props.setMinBattery(+e.target.value);
  }

  render() {
    return <div>
      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Alerts</h2>
        </div>
        <div className='ui padded segment'>
          <div className='ui checkbox'>
            <input style={{width: '100%'}} type='checkbox' name='cb' onChange={this.onMuteCheckBoxChange.bind(this)} checked={this.props.muted} />
            <label>Mute Battery Alert</label>
          </div>
        </div>
        <div className='ui padded segment'>
          <div>
            <div>Minimum battery level for alerts</div>
            <input type='range' name='cb' min='0' max='100' value={this.props.minBattery} onChange={this.onMinBatterySliderChange.bind(this)} />
            <div>{`${this.props.minBattery}%`}</div>
          </div>
        </div>
      </div>

      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Camera IP Addresses</h2>
        </div>

        <div className='ui padded segment'>
          <form className='ui form'>
            <h4 className='ui dividing header'>Big Daddy</h4>
            <div className='field'>
              <label>Main</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
            <div className='field'>
              <label>Arm</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
          </form>
        </div>

        <div className='ui padded segment'>
          <form className='ui form'>
            <h4 className='ui dividing header'>Scout</h4>
            <div className='field'>
              <label>Main</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
          </form>
        </div>

        <div className='ui padded segment'>
          <form className='ui form'>
            <h4 className='ui dividing header'>Rover</h4>
            <div className='field'>
              <label>Main</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>;
  }

}

SettingsView.propTypes = {
  muted: React.PropTypes.bool.isRequired,
  mute: React.PropTypes.func.isRequired,
  unmute: React.PropTypes.func.isRequired,
  setMinBattery: React.PropTypes.func.isRequired,
  minBattery: React.PropTypes.number.isRequired
};

export default SettingsView;
