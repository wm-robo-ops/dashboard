import React from 'react';

export default class FrameRateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.changeFrameRate = this.changeFrameRate.bind(this);
  }
  onMouseDown() {
    console.log('mousedown');
    this.mouseDown = false;
  }
  onMouseUp() {
    this.mouseDown = true;
  }
  changeFrameRate(e) {
    if (this.mouseDown) return;
    this.props.changeFrameRate(e.target.value);
  }
  render() {
    return <div className='mt3'>
      <div>frame rate: <span className='bold'>{this.props.frameRate}</span></div>
      <input style={{width: '100%'}} type='range' min='1' max='60' onChange={this.changeFrameRate} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}/>
    </div>;
  }
}

FrameRateSlider.propTypes = {
  changeFrameRate: React.PropTypes.func.isRequired
};
