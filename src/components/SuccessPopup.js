import success from '../images/success.png';

function SuccessPopup(props) {
    return(
        <div className={`popup popup_type_sign ${props.isOpenSuccessPopup ? "popup_opened" : ""}`}>
            <div className="popup__overlay" onClick={props.onCloseSuccessPopup}></div>
            <div className="popup__container"> 
                <button className="popup__close-icon popup__close-delete" type="reset" onClick={props.onCloseSuccessPopup}></button>
                <form className="popup__form popup__form_sign" name="form-sign" noValidate>
                    <img className="popup__form_image" alt="Что-то пошло не так" src={success} />
                    <h2 className="popup__title_bottom">Вы успешно зарегистрировались!</h2>
                </form>   
            </div>    
        </div>
    );
}

export default SuccessPopup