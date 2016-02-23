import React from 'react';

export default class AllCamerasView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <video src="http://v2v.cc/~j/theora_testsuite/320x240.ogg" controls style={{width: '100%'}}>
        Your browser does not support the <code>video</code> element.
      </video>
    </div>;
  }

}
