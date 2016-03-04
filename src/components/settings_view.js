import React from 'react';

export default class SettingsView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      Camera IP Addresses
      <div>
        <div className='ui input'>
          <label>Camera 1: </label>
          <input type='text'/>
        </div>
      </div>
      <div>
        <div className='ui input'>
          <label>Camera 2: </label>
          <input type='text'/>
        </div>
      </div>
      <div>
        <div className='ui input'>
          <label>Camera 3: </label>
          <input type='text'/>
        </div>
      </div>
      <div>
        <div className='ui input'>
          <label>Camera 4: </label>
          <input type='text'/>
        </div>
      </div>
    </div>;
  }

}
