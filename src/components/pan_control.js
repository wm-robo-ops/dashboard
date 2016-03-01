import React from 'react';

export default class PanControl extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>

      <div className='ctrl-btn'>
        <i className='fa fa-arrow-up fa-2x'></i>
      </div>

      <div className='ctrl-btn'>
        <i className='fa fa-arrow-down fa-2x'></i>
      </div>

      <div className='ctrl-btn'>
        <i className='fa fa-arrow-left fa-2x'></i>
      </div>

      <div className='ctrl-btn'>
        <i className='fa fa-arrow-right fa-2x'></i>
      </div>

    </div>;
  }
}

