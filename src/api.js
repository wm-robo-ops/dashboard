const URL = 'http://localhost:3000';

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
