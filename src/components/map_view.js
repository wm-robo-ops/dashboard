import React from 'react';
import MainMap from './main_map';

export default class CamerasView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <div className='six wide column'>
        <div className='ui black padded segment'>
          <h1 className='ui dividing header'>location</h1>
          <MainMap zoom={18.5} height='700' removeRock={this.props.removeRock} serverIP={this.props.serverIP}/>
        </div>
      </div>
    </div>;
  }

}

