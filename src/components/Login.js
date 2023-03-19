import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import errorLogin from '../images/errorLogin.png';
import * as auth from "../utils/auth.js";
import Header from './Header.js';

function Login({handleLogin}) {
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
        if (!formValue.email || !formValue.password){
          return;
        }
        auth.authorize(formValue.email, formValue.password)
        .then((data) => {
            if (data.token){
                localStorage.setItem("email", formValue.email);
                setFormValue({username: '', password: ''});
                handleLogin();
                navigate('/', {replace: true});
            }
        })
        .catch(err => console.log(err));
    }
    
    const navToRegistration = () => {
        navigate("/sign-up", {replace:true})
    }

    return(
        <div className="page">
            <Header buttonText={"Регистрация"} onClick={navToRegistration}/>
            <div className="sign__container">
                <form className="sign__form" onSubmit={handleSubmit}>
                    <h2 className="sign__header">Вход</h2>
                    <input className="sign__input sign__input_type_email" type="email" placeholder="Email" name="email" id="email-input" minLength="2" maxLength="50" onChange={handleChange} required />
                    <input className="sign__input sign__input_type_password" type="password" placeholder="Пароль" name="password" id="password-input" minLength="2" maxLength="50" onChange={handleChange} required />
                    <button className="sign__button" type="submit">Войти</button>
                </form>
            </div>
            <div className="popup popup_type_sign">
            <div className="popup__overlay"></div>
            <div className="popup__container"> 
                <button className="popup__close-icon popup__close-delete" type="reset"></button>
                <form className="popup__form popup__form_sign" name="form-sign" noValidate>
                    <img className="popup__form_image" alt="Что-то пошло не так" src={errorLogin} />
                    <h2 className="popup__title_bottom">Что-то пошло не так! Попробуйте ещё раз.</h2>
                </form>   
            </div>    
            </div>
        </div>
    );
}

export default Login;
