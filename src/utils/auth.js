export const BASE_URL = 'https://auth.nomoreparties.co/';

const _checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Что-то пошло не так: ${res.status}`);
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}signup`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
    .then(res => _checkResponse(res))
    .then((res) => {
        return res
    })
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
    .then(res => _checkResponse(res))
    .then((res) => {
        if(res.token) {
            localStorage.setItem('jwt', res.token)
            return res;
        }
    })
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => _checkResponse(res))
    .then((data) => {
        return data;
    })
}