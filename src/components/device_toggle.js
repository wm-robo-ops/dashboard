import React from 'react';

export default class DeviceToggle extends React.Component {
  render() {
    return <div className='ui toggle checkbox mb2'>
      <input type='checkbox' checked={this.props.checked} onChange={this.props.onChange.bind(this, this.props.name)}/>
      <label>{this.props.checked ? 'on' : 'off'}</label>
    </div>;
  }
}

DeviceToggle.propTypes = {
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired
};
