import React from 'react';

export default class PasswordModal extends React.Component {

  constructor(props) {
    super(props);
    this.checkPassword = this.checkPassword.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter(key) {
    const ENTER = 13;
    if (key.keyCode === ENTER)
      this.checkPassword();
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onEnter);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onEnter);
  }

  checkPassword() {
    this.props.checkPassword(this.refs.passwordInput.value);
    this.refs.passwordInput.value = '';
  }

  render() {
    return <div className='ui modal active'>
      <div className='header'>
        Enter Password
      </div>
      <div className='pad2'>If dashboard is not functioning as desired, please call <span className='bold'>(757) 927-2413</span> to report.</div>
      <div className='ui form'>
        <input ref='passwordInput' type='password' placeholder='password'/>
      </div>
      <div className='actions'>
        <div className='ui button' onClick={this.checkPassword}>Submit</div>
      </div>
    </div>;
  }

}

