import React from 'react';

export default class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  onChange() {
    if (this.props.muted)
      this.props.unmute();
    else
      this.props.mute();
  }

  render() {
    return <div>
      <div className='ui segments'>
        <div className='ui padded segment'>
          <h2>Sound</h2>
        </div>
        <div className='ui padded segment'>
        <div className='ui checkbox'>
          <input type='checkbox' name='cb' onChange={this.onChange.bind(this)} checked={this.props.muted} />
          <label>Mute Battery Alert</label>
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
              <label>Camera 1</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
            <div className='field'>
              <label>Camera 2</label>
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
              <label>Camera 1</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
            <div className='field'>
              <label>Camera 2</label>
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
              <label>Camera 1</label>
              <div className='field'>
                <input type='text' placeholder='IP Address' />
              </div>
            </div>
            <div className='field'>
              <label>Camera 2</label>
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
  muted: React.PropTypes.bool.isRequired
}

export default SettingsView;
