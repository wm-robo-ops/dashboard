const URL = 'http://localhost:5555';

export function getStats() {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/stats`)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}

export function getRocks() {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/rocks`)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}

export function postRock(data) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/rocks/add`, {
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

export function deleteRock(id) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/rocks/remove/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(text => {
        if (text !== 'ok') reject('DELETE failed');
      })
      .catch(e => reject(e));
  });
}

export function toggleCameraAPI(camera) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/video/${camera}/on`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(text => {
        if (text !== 'ok') reject('Could not toggle stream');
      })
      .catch(e => reject(e));
  });
}

export function toggleGPSAPI(vehicle) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/gps/${vehicle}/on`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(text => {
        if (text !== 'ok') reject('Could not toggle gps for', vehicle);
      })
      .catch(e => reject(e));
  });
}

export function toggleDOFDeviceAPI(vehicle) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/dofdevice/${vehicle}/on`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(text => {
        if (text !== 'ok') reject('Could not toggle gps for', vehicle);
      })
      .catch(e => reject(e));
  });
}

export function capturePhoto(camera) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/photo/${camera}`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(text => {
        if (text !== 'ok') reject('Could not capture photo', camera);
      })
      .catch(e => reject(e));
  });
}
