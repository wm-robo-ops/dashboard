import React from 'react';

export default class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  setServerIP() {
    this.props.setServerIP(this.refs.serverIPInput.value);
  }

  render() {
    return <div>

      {/* Server IP address */}
      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Server IP Address</h2>
        </div>
        <div className='ui padded segment'>
          <div className='ui fluid action input'>
            <input type='text' ref='serverIPInput' placeholder={this.props.serverIP} onChange={() => {}}/>
            <div className='ui button' onClick={this.setServerIP.bind(this)}>Set</div>
          </div>
        </div>
      </div>

    </div>;
  }

}

SettingsView.propTypes = {
  serverIP: React.PropTypes.string.isRequired,
  setServerIP: React.PropTypes.func.isRequired
};

