const URL = 'http://localhost:3000';

export function fetchStats() {
  return new Promise((resolve, reject) => {
    fetch(`${URL}/stats`)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}
