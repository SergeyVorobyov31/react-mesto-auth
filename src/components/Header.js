import logo from '../images/logo.svg';

function Header(props) {
    return (
        <header className="header">
                <img className="header__logo" src={logo} alt="Логотип" />
                <div className="header__container">
                    <p className="header__email">{props.email}</p>
                    <button className="header__button" type="button" onClick={props.onClick}>{props.buttonText}</button>
                </div>
        </header>
    );
}

export default Header;