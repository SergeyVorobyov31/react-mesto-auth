import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as auth from "../utils/auth.js";
import Header from './Header.js';

function Registration({element: Component, ...props}) {
    const [formValue, setFormValue] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        auth.register(formValue.email, formValue.password)
        .then((res) => {
            if(res.data) {
                props.onSuccessPopup();
            }
        })
        .catch((err) => {
            console.log(err);
            props.onErrorPopup();
        })
    }

    const navToLogin = () => {
        navigate("/sign-in", {replace:true})
    }

    return(
        <div className="page">
            <Header buttonText={"Войти"} onClick={navToLogin} />
            <div className="sign__container">
                <form className="sign__form" onSubmit={handleSubmit}>
                    <h2 className="sign__header">Регистрация</h2>
                    <input className="sign__input sign__input_type_email" type="email" placeholder="Email" name="email" id="email-input" minLength="2" maxLength="50" onChange={handleChange} value={formValue.email} required />
                    <input className="sign__input sign__input_type_password" type="password" placeholder="Пароль" name="password" id="password-input" minLength="2" maxLength="50" onChange={handleChange} value={formValue.password} required />
                    <button className="sign__button" type="submit">Зарегистрироваться</button>
                    <Link className="sign__subtitle" to="/sign-in">Уже зарегистрированы? Войти</Link>
                </form>
            </div>
            <div>
                {props.successComponent}
                {props.errorComponent}
            </div>
        </div>
    );
}

export default Registration;