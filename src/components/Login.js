import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as auth from "../utils/auth.js";
import Header from './Header.js';

function Login(props) {
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
                props.handleLogin();
                navigate('/', {replace: true});
            }
        })
        .catch((err) => {
            console.log(err);
            props.onErrorPopup();
        });
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
                    <input className="sign__input sign__input_type_email" type="email" placeholder="Email" name="email" id="email-input" minLength="2" maxLength="50" onChange={handleChange} value={formValue.email} required />
                    <input className="sign__input sign__input_type_password" type="password" placeholder="Пароль" name="password" id="password-input" minLength="2" maxLength="50" onChange={handleChange} value={formValue.password} required />
                    <button className="sign__button" type="submit">Войти</button>
                </form>
            </div>
            <div>
                {props.list}
            </div>
        </div>
    );
}

export default Login;
