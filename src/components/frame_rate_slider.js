import React from 'react';

export default class FrameRateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fr: 30
    };
    this.onMouseUp = this.onMouseUp.bind(this);
    this.changeFrameRate = this.changeFrameRate.bind(this);
  }
  onMouseUp() {
    this.props.changeFrameRate(this.state.fr);
  }
  changeFrameRate(e) {
    e.preventDefault();
    this.setState({ fr: e.target.value });
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
