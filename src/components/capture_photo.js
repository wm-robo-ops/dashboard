import React from 'react';

export default class CapturePhoto extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      {this.props.cameras.map(c => <div key={c}>
        <button onClick={this.props.capture.bind(this, c)}>{c}</button>
      </div>)}
    </div>;
  }

}
