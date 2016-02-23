import React from 'react';

export default class AllCamerasView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div className='ui grid'>

      <div className='eight wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer />
        </div>
      </div>


      <div className='eight wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer />
        </div>
      </div>

      <div className='eight wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer />
        </div>
      </div>

      <div className='eight wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer />
        </div>
      </div>

      <div className='eight wide column'>
        <div className='ui teal padded segment'>
          <h1 className='ui dividing header'></h1>
          <VideoPlayer />
        </div>
      </div>

    </div>;
  }

}

class VideoPlayer extends React.Component {
  render() {
    return <video src="http://v2v.cc/~j/theora_testsuite/320x240.ogg" controls style={{width: '100%'}}>
      Your browser does not support the <code>video</code> element.
    </video>;
  }
}
