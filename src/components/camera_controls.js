import React from 'react';

export default class CameraControls extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div className='ui cards' style={{margin: '0px'}}>

      {/* pan-tilt */}
      <div className='black card'>
        <div className='content'>
          <div className='header'>
            pan-tilt
          </div>
          <div className='ctrl-btn'>
            <i className='fa fa-arrow-left fa-2x'></i>
          </div>
          <div className='ctrl-btn'>
            <i className='fa fa-arrow-up fa-2x'></i>
          </div>
          <div className='ctrl-btn'>
            <i className='fa fa-arrow-right fa-2x'></i>
          </div>
          <div className='ctrl-btn'>
            <i className='fa fa-arrow-down fa-2x'></i>
          </div>
        </div>
      </div>

      {/* zoom */}
      <div className='black card'>
        <div className='content'>

          <div className='header'>zoom</div>

          <div className='ctrl-btn'>
            <i className='fa fa-plus fa-2x'></i>
          </div>
          <div className='ctrl-btn'>
            <i className='fa fa-minus fa-2x'></i>
          </div>

        </div>
      </div>
    </div>;
  }
}
