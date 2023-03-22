class Api {
    constructor(options) {
        this._options = options;
        this._url = options.baseUrl;
        this._id = options.headers.authorization;
    }

    _checkResponse(res) {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
                headers: this._options.headers
        })
        .then(res => this._checkResponse(res))
        .then((result) => {
            return result
        })
    }

    getUserData() {
        return fetch(`${this._url}/users/me`, {
            headers: this._options.headers
        })
        .then(res => this._checkResponse(res))
        .then((result) => {
            return result
        })
    }

    getUserId() {
        return fetch(`${this._url}/users/me`, {
            headers: this._options.headers
        })
        .then(res => this._checkResponse(res))
        .then((result) => {
            return result._id
        })
    }

    sendUserData(nameProfile, infoProfile) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._options.headers,
            body: JSON.stringify({
              name: `${nameProfile}`,
              about: `${infoProfile}`
            })
        })
        .then(res => this._checkResponse(res))
    }

    sendNewCard(newCard) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._options.headers,
            body: JSON.stringify({
              link: `${newCard.link}`,
              name: `${newCard.name}`
            })
        })
        .then(res => this._checkResponse(res))
    }

    sendNewAvatar(avatarUrl) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._options.headers,
            body: JSON.stringify({
              avatar: `${avatarUrl}`
            })
        })
        .then(res => this._checkResponse(res))
    }

    deleteCard(cardId) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._options.headers
        })
        .then(res => this._checkResponse(res))
    }

    changeLikeCard(cardId, isLike) {
        if(isLike) {
            return fetch(`${this._url}/cards/${cardId}/likes`, {
                method: "PUT",
                headers: this._options.headers
            })
            .then(res => this._checkResponse(res))
            .catch(err => console.log(err))
        } else {
            return fetch(`${this._url}/cards/${cardId}/likes`, {
                method: "DELETE",
                headers: this._options.headers
            })
            .then(res => this._checkResponse(res))
        }
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-58',
    headers: {
      authorization: '3ff37044-95e4-4bd3-b490-b086237c1a77',
      'Content-Type': 'application/json'
    }
  });

export default api