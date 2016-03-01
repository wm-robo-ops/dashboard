import React from 'react';

export default class ZoomControl extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <div className='ctrl-btn'>
        <i className='fa fa-plus fa-2x'></i>
      </div>
      <div className='ctrl-btn'>
        <i className='fa fa-minus fa-2x'></i>
      </div>
    </div>;
  }
}

