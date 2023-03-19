import errorLogin from '../images/errorLogin.png';

function ErrorPopup(props) {
    return(
        <div className={`popup popup_type_sign ${props.isOpenErrorPopup ? "popup_opened" : ""}`}>
            <div className="popup__overlay" onClick={props.onCloseErrorPopup}></div>
            <div className="popup__container"> 
                <button className="popup__close-icon popup__close-delete" type="reset" onClick={props.onCloseErrorPopup}></button>
                <form className="popup__form popup__form_sign" name="form-sign" noValidate>
                    <img className="popup__form_image" alt="Что-то пошло не так" src={errorLogin} />
                    <h2 className="popup__title_bottom">Что-то пошло не так! Попробуйте ещё раз.</h2>
                </form>   
            </div>    
        </div>        
    );
}

export default ErrorPopup;