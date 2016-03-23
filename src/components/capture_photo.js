import React from 'react';

export default class CapturePhoto extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <button onClick={this.props.capture.bind(this, this.props.camera)}>{this.props.camera}</button>
    </div>;
  }

}
