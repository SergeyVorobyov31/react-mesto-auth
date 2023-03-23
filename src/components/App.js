import {useState, useEffect} from "react";
import {Routes, Route, useNavigate} from 'react-router-dom'
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/Api.js";
import Cards from "./Cards.js";
import CurrentUserContext from "../context/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import Login from "./Login.js";
import Registration from "./Registration.js";
import ProtectedRouteElement from "./ProtectedRouteElement.js";
import * as auth from "../utils/auth.js";

import InfoToolTip from "./InfoToolTip.js";
import errorLogin from '../images/errorLogin.png';
import success from '../images/success.png';


function App() {

    const [isSuccessPopup, setIsSuccessPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [isEditProfilePopupOpen, setIsOpenProfilePopup] = useState(false);
    const [isEditAvatarPopupOpen, setIsOpenAvatarPopup] = useState(false);
    const [isAddPlacePopupOpen, setIsOpenCardPopup] = useState(false);
    const [cards, setInitialCards] = useState([]);
    const [isOpenPopupImage, setIsOpenPopupImage] = useState(false);
    const [selectedCard, setSelectedcard] = useState({});
    const [currentUser, setCurentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link || isErrorPopup || isSuccessPopup;
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchUserData();
        getDefaultCard();
        handleTokenCheck();
    }, [])

    useEffect(() => {
        function closeByEscape(evt) {
            if(evt.key === 'Escape') {
              closePopups();
            }
          }
          if(isOpen) {
            document.addEventListener('keydown', closeByEscape);
            return () => {
              document.removeEventListener('keydown', closeByEscape);
            }
          }
    }, [isOpen])
    
    
    function fetchUserData() {
        api.getUserData()
        .then(data => {
            setCurentUser(data);
        })
        .catch(err => console.log(err));
    }

    function popupSuccessOpen() {
        setIsSuccessPopup(true);
    }

    function popupSuccessClose() {
        setIsSuccessPopup(false);
        navigate("/sign-in", {replace:true})
    }

    function popupErrorOpen() {
        setIsErrorPopup(true);
    }

    function popupProfileOpen() {
        setIsLoading(false);
        setIsOpenProfilePopup(true);
    }

    function popupAvatarOpen() {
        setIsLoading(false);
        setIsOpenAvatarPopup(true);
    }

    function popupCardOpen() {
        setIsLoading(false);
        setIsOpenCardPopup(true);
    }

    function closePopups() {
        setIsOpenProfilePopup(false);
        setIsOpenAvatarPopup(false);
        setIsOpenCardPopup(false);
        setIsOpenPopupImage(false);
        setIsErrorPopup(false);
        setIsLoading(false);
    }

    function signOut(){
        localStorage.removeItem('jwt', "email");
        setLoggedIn(false);
        navigate("/sign-in", {replace:true});
    }

    function getDefaultCard() {
        api.getInitialCards()
        .then(data => {
            return setInitialCards(data);
        })
        .catch(err => console.log(err));
    }

    function handleCardClick(card) {
        setIsOpenPopupImage(true);
        setSelectedcard(card);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCard(card._id, !isLiked)
        .then((newCard) => {
            setInitialCards((state) => state.map((item) => 
            item._id === card._id ? newCard : item
            ));
        })
        .catch(err => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
            setInitialCards((cards) => cards.filter(item => item._id != card._id) )
            closePopups();
        })
        .catch(err => console.log(err));
    }

    function handleUpdateUser(name, about) {
        setIsLoading(false);
        api.sendUserData(name, about)
        .then((data) => {;
            setCurentUser(data);
            closePopups();
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setIsLoading(true);
        })
    }

    function handleUpdateAvatar(avatarUrl) {
        setIsLoading(false);
        api.sendNewAvatar(avatarUrl)
        .then((data) => {
            setCurentUser(data);
            closePopups();
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setIsLoading(true);
        })
    }

    function handleAddPlaceSubmit(newCard) {
        setIsLoading(false);
        api.sendNewCard(newCard)
        .then((data) => {
            setInitialCards([data, ...cards]);
            closePopups();
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setIsLoading(true);
        })
    }

    function handleTokenCheck() {
        if (localStorage.getItem('jwt')){
            const jwt = localStorage.getItem('jwt');
            auth.checkToken(jwt)
            .then((res) => {
                if (res){
                    setLoggedIn(true);
                    navigate("/", {replace: true})
                }
            })
            .catch(err => console.log(err));
        }
    }

    const handleLogin = () => {
        setLoggedIn(true);
    }

    return (
        <Routes>
            <Route element={<ProtectedRouteElement loggedIn={loggedIn}/>}>
                <Route path="/" element={
                <div className="page">
                    <CurrentUserContext.Provider value={currentUser}>
                        <Header onClick={signOut} email={localStorage.email} buttonText={"Выйти"}/>
                        <Main 
                            onEditAvatar={popupAvatarOpen} 
                            onEditProfile={popupProfileOpen} 
                            onAddPlace={popupCardOpen}                     
                            list={<Cards 
                                    array={cards}
                                    onCardClick={handleCardClick}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                />} 
                        />
                        <ImagePopup card={selectedCard} isOpen={isOpenPopupImage} onClose={closePopups}/>
                        <Footer />
                        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closePopups} currentUser={currentUser} onUpdateUser={handleUpdateUser} buttonText={isLoading? 'Сохранение...' : 'Сохранить'}/>
                        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closePopups} onUpdateAvatar={handleUpdateAvatar} buttonText={isLoading? 'Сохранение...' : 'Сохранить'}/>
                        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closePopups} onUpdateCards={handleAddPlaceSubmit} buttonText={isLoading? 'Сохранение...' : 'Создать'}/>
                        <PopupWithForm 
                            name = "delete"
                            title = "Вы уверены?"
                            children = ""
                            buttonText = "Да"
                        />
                    </CurrentUserContext.Provider>   
                </div>}/>
            </Route>
            
            <Route path="/sign-in" element={<Login handleLogin={handleLogin} onErrorPopup={popupErrorOpen} list={<InfoToolTip isOpen={isErrorPopup} onClose={closePopups} image={errorLogin} popupText={"Что-то пошло не так! Попробуйте ещё раз."} />}/>} />
            <Route path="/sign-up" element={<Registration onSuccessPopup={popupSuccessOpen} onErrorPopup={popupErrorOpen} successComponent={<InfoToolTip isOpen={isSuccessPopup} onClose={popupSuccessClose} image={success} popupText={"Вы успешно зарегистрировались!"} />} errorComponent={<InfoToolTip isOpen={isErrorPopup} onClose={closePopups} image={errorLogin} popupText={"Что-то пошло не так! Попробуйте ещё раз."} />}/>} />
        </Routes>
    );
}

export default App;
