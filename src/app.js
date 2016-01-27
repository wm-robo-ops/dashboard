'use babel';
import React from 'react';
import createStore from 'redux';
import {
  updateBattery,
  updateLocation
} from './actions';
import {
  getBatteryLevel,
  getLocation
} from './vehicle_client';
import dashboardApp from './reducers';

var store = createStore(dashboardApp);

const BIG_DADDY = 'bigDaddy';
const SCOUT = 'scout';
const FLYER = 'flyer';
const vehicles = [ BIG_DADDY, SCOUT, FLYER ];

// poll for battery and location information
function updateStatus() {
  for (var i = 0; i < vehicles.length; i++) {
    let v = vehicles[0];
    console.log(v);
  }
}
//window.setTimeout(updateStatus);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = store.getStaet().toJS();
    this.state.view = BIG_DADDY;
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState().toJS());
    });
  }

  changeView(view) {
    this.setState({ view });
  }

  updateBattery(percent) {
    var { batteryBar } = this.refs;
    batteryBar.percent = percent + '%';
  }

  render() {
    return <div>

      {/* rover toggle */}
      <div className='ui container my4'>
        <div className='ui three item stackable tabs menu'>
          <div
            onClick={this.changeView.bind(this, BIG_DADDY)}
            className={`item ${this.state.view === BIG_DADDY && 'active'}`}>Big Daddy</div>
          <div
            onClick={this.changeView.bind(this, SCOUT)}
            className={`item ${this.state.view === SCOUT && 'active'}`}>Scout</div>
          <div
            onClick={this.changeView.bind(this, FLYER)}
            className={`item ${this.state.view === FLYER && 'active'}`}>Flyer</div>
        </div>
      </div>

      <div className='ui grid container'>

        {/* cameras */}
        <div className='twelve wide column'>
          <div className='ui teal padded segment'>
            <h1 className='ui dividing header'>cameras</h1>

            {/* fake cameras */}
            Main
            <div className='mb2' style={{ height: '300px', width: '650px', backgroundColor: 'gray' }}></div>

            <div className='ui grid container'>
              <div className='eight wide column'>
                Camera 2
                <div style={{ height: '200px', width: '300px', backgroundColor: 'gray' }}></div>
              </div>
              <div className='eight wide column'>
                Camera 3
                <div style={{ height: '200px', width: '300px', backgroundColor: 'gray' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* metrics */}
        <div className='four wide column'>
          <div className='ui pink padded segment'>
            <h1 className='ui dividing header'>metrics</h1>

            {/* battery level */}
            <div
              className='ui indicating progress active'
              ref='batteryBar'>
              <div className='bar'></div>
              <div className='label'>battery</div>
            </div>

            {/* location */}
            <div></div>

          </div>
        </div>
      </div>

    </div>;
  }

}
