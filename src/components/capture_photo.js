import React from 'react';

export default class CapturePhoto extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <button className='fluid ui button basic blue' onClick={this.props.capture.bind(this, this.props.camera)}>Capture Photo</button>
    </div>;
  }

}

CapturePhoto.propTypes = {
  capture: React.PropTypes.func.isRequired,
  camera: React.PropTypes.string.isRequired
};
