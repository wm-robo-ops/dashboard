import React from 'react';

export default class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  onVideoToggle(camera) {
    this.props.toggleVideo(camera);
  }

  onGPSToggle(vehicle) {
    this.props.toggleGPS(vehicle);
  }

  onDOFDeviceToggle(vehicle) {
    this.props.toggleDOFDevice(vehicle);
  }

  setServerIP() {
    this.props.setServerIP(this.refs.serverIPInput.value);
  }

  render() {
    return <div>

      {/* video stream toggles */}
      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Toggle Sensors</h2>
        </div>
        <div className='ui padded segment'>

          {/* Cameras */}
          <h3>Cameras</h3>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.cameras.bigDaddyMain.on} onChange={this.onVideoToggle.bind(this, 'bigDaddyMain')}/>
              <label>Big Daddy Main</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.cameras.bigDaddyArm.on} onChange={this.onVideoToggle.bind(this, 'bigDaddyArm')}/>
              <label>Big Daddy Arm</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.cameras.scout.on} onChange={this.onVideoToggle.bind(this, 'scout')}/>
              <label>Scout</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.cameras.flyer.on} onChange={this.onVideoToggle.bind(this, 'flyer')}/>
              <label>Flyer</label>
            </div>
          </div>

          {/* GPS */}
          <h3>GPS</h3>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.gps.bigDaddy.on} onChange={this.onGPSToggle.bind(this, 'bigDaddy')}/>
              <label>Big Daddy</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.gps.scout.on} onChange={this.onGPSToggle.bind(this, 'scout')}/>
              <label>Scout</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.gps.flyer.on} onChange={this.onGPSToggle.bind(this, 'flyer')}/>
              <label>Flyer</label>
            </div>
          </div>

          {/* DOF Device */}
          <h3>DOF Device</h3>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.dofDevice.bigDaddy.on} onChange={this.onDOFDeviceToggle.bind(this, 'bigDaddy')}/>
              <label>Big Daddy</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.dofDevice.scout.on} onChange={this.onDOFDeviceToggle.bind(this, 'scout')}/>
              <label>Scout</label>
            </div>
          </div>
          <div>
            <div className='ui toggle checkbox'>
              <input type='checkbox' checked={this.props.dofDevice.flyer.on} onChange={this.onDOFDeviceToggle.bind(this, 'flyer')}/>
              <label>Flyer</label>
            </div>
          </div>

        </div>
      </div>


      {/* Server IP address */}
      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Server IP Address</h2>
        </div>
        <div className='ui padded segment'>
          <form className='ui form'>
            <div className='field'>
              <div className='field'>
                <input type='text' ref='serverIPInput' placeholder={this.props.serverIP} onChange={() => {}}/>
              </div>
            </div>
          </form>
          <button className='ui button' onClick={this.setServerIP.bind(this)}>Set</button>
        </div>
      </div>

      {/* Camera IP addresses */}
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
  gps: React.PropTypes.shape({
    bigDaddy: React.PropTypes.object.isRequired,
    scout: React.PropTypes.object.isRequired,
    flyer: React.PropTypes.object.isRequired
  }).isRequired,
  dofDevice: React.PropTypes.shape({
    bigDaddy: React.PropTypes.object.isRequired,
    scout: React.PropTypes.object.isRequired,
    flyer: React.PropTypes.object.isRequired
  }).isRequired,
  toggleVideo: React.PropTypes.func.isRequired,
  toggleDOFDevice: React.PropTypes.func.isRequired,
  toggleGPS: React.PropTypes.func.isRequired,
  serverIP: React.PropTypes.string.isRequired
};

