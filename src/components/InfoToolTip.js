function InfoToolTip(props) {
    return(
        <div className={`popup popup_type_sign ${props.isOpen ? "popup_opened" : ""}`}>
            <div className="popup__overlay" onClick={props.onClose}></div>
            <div className="popup__container"> 
                <button className="popup__close-icon popup__close-delete" type="reset" onClick={props.onClose}></button>
                <form className="popup__form popup__form_sign" name="form-sign" noValidate>
                    <img className="popup__form_image" alt="Что-то пошло не так" src={props.image} />
                    <h2 className="popup__title_bottom">{props.popupText}</h2>
                </form>   
            </div>    
        </div>        
    );
}

export default InfoToolTip;