export const BASE_URL = 'https://auth.nomoreparties.co/';

export const register = (email, password) => {
    return fetch(`${BASE_URL}signup`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
    .then((res) =>{
        return res.json();
    })
    .then((res) => {
        return res
    })
    .catch(err => console.log(err));
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}signin`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
    .then((res) =>{
        return res.json();
    })
    .then((res) => {
        if(res.token) {
            localStorage.setItem('jwt', res.token)
            return res;
        }
    })
    .catch(err => console.log(err));
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        return data;
    })
}