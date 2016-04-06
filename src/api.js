export default class API {
  constructor(ip) {
    this.ip = ip;
    this.URL = `http://${ip}:5555`;
    this.setIP = this.setIP.bind(this);
  }

  setIP(ip) {
    this.ip = ip;
    this.URL = `http://${ip}:5555`;
  }

  getStats() {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/stats`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(e => reject(e));
    });
  }

  getRocks() {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/rocks`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(e => reject(e));
    });
  }

  postRock(data) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/rocks/add`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject('DELETE failed');
        })
        .catch(e => reject(e));
    });
  }

  deleteRock(id) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/rocks/remove/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject(text);
        })
        .catch(e => reject(e));
    });
  }

  toggleVideo(camera, start) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/video/${camera}/${start ? 'on' : 'off'}`, {
        method: 'POST'
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject(text);
        })
        .catch(e => reject(e));
    });
  }

  toggleGPS(vehicle, start) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/gps/${vehicle}/${start ? 'on' : 'off'}`, {
        method: 'POST'
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject(text);
        })
        .catch(e => reject(e));
    });
  }

  toggleDOFDevice(vehicle, start) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/dofdevice/${vehicle}/${start ? 'on' : 'off'}`, {
        method: 'POST'
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject(text);
        })
        .catch(e => reject(e));
    });
  }

  capturePhoto(name) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/photo/${name}`, {
        method: 'POST'
      })
        .then(res => res.text())
        .then(text => {
          if (text !== 'ok') reject(text);
        })
        .catch(e => reject(e));
    });
  }

  getPhotos() {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/photo`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(e => reject(e));
    });
  }

  checkPassword(password) {
    return new Promise((resolve, reject) => {
      fetch(`http://${this.ip}:10000/`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ password })
      })
        .then(res => res.text())
        .then(text => {
          if (text === 'ok') resolve(true);
          else reject(false);
        })
        .catch(() => reject('ERROR: Network error in password request'));
    });
  }

  changeFrameRate(camera, frameRate) {
    return new Promise((resolve, reject) => {
      fetch(`${this.URL}/video/framerate/${camera}/${frameRate}`, {
        method: 'POST'
      })
        .then(res => res.text())
        .catch(() => reject('ERROR: Could not change frame rate'));
    });
  }
}
