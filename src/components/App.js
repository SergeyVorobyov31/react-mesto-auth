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
import SuccessPopup from "./SuccessPopup.js";
import ErrorPopup from "./ErrorPopup.js";
import Login from "./Login.js";
import Registration from "./Registration.js";
import ProtectedRouteElement from "./ProtectedRouteElement.js";
import * as auth from "../utils/auth.js";


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
    const navigate = useNavigate();

    
    useEffect(() => {
        fetchUserData();
        getDefaultCard();
        handleTokenCheck();
    }, [])
    
    function fetchUserData() {
        api.getUserData()
        .then(data => {
            setCurentUser(data);
        })
        .catch(err => console.log(err));
    }

    function popupSuccessOpen() {
        document.addEventListener("keydown", handleEscClose);
        setIsSuccessPopup(true);
    }

    function popupSuccessClose() {
        setIsSuccessPopup(false);
        document.removeEventListener("keydown", handleEscClose);
        navigate("/sign-in", {replace:true})
    }

    function popupErrorOpen() {
        document.addEventListener("keydown", handleEscClose);
        setIsErrorPopup(true);
    }

    function popupProfileOpen() {
        document.addEventListener("keydown", handleEscClose);
        setIsOpenProfilePopup(true);
    }

    function popupAvatarOpen() {
        setIsOpenAvatarPopup(true);
        document.addEventListener("keydown", handleEscClose);
    }

    function popupCardOpen() {
        setIsOpenCardPopup(true);
        document.addEventListener("keydown", handleEscClose);
    }

    function closePopups() {
        setIsOpenProfilePopup(false);
        setIsOpenAvatarPopup(false);
        setIsOpenCardPopup(false);
        setIsOpenPopupImage(false);
        setIsErrorPopup(false);
        document.removeEventListener("keydown", handleEscClose);
    }

    function signOut(){
        localStorage.removeItem('jwt', "email");
        setLoggedIn(false);
        navigate("/sign-in", {replace:true});
    }

    function handleEscClose(evt) {
        if (evt) {
            if(evt.key === "Escape") {
                closePopups();
            }
        }
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
        document.addEventListener("keydown", handleEscClose);
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
        api.sendUserData(name, about)
        .then((data) => {;
            setCurentUser(data);
            closePopups();
        })
        .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUrl) {
        api.sendNewAvatar(avatarUrl)
        .then((data) => {
            setCurentUser(data);
            closePopups();
        })
        .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api.sendNewCard(newCard)
        .then((data) => {
            setInitialCards([data, ...cards]);
            closePopups();
        })
        .catch((err) => console.log(err));
    }

    function handleTokenCheck() {
        if (localStorage.getItem('jwt')){
            const jwt = localStorage.getItem('jwt');
            auth.checkToken(jwt).then((res) => {
                if (res){
                    setLoggedIn(true);
                    navigate("/", {replace: true})
                }
            });
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
                        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closePopups} currentUser={currentUser} onUpdateUser={handleUpdateUser} />
                        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closePopups} onUpdateAvatar={handleUpdateAvatar} />
                        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closePopups} onUpdateCards={handleAddPlaceSubmit}/>
                        <PopupWithForm 
                            name = "delete"
                            title = "Вы уверены?"
                            children = ""
                            buttonText = "Да"
                        />
                    </CurrentUserContext.Provider>   
                </div>}/>
            </Route>
            
            <Route path="/sign-in" element={<Login handleLogin={handleLogin} onErrorPopup={popupErrorOpen} list={<ErrorPopup isOpenErrorPopup={isErrorPopup} onCloseErrorPopup={closePopups} />}/>} />
            <Route path="/sign-up" element={<Registration onSuccessPopup={popupSuccessOpen} onErrorPopup={popupErrorOpen} list={[<SuccessPopup isOpenSuccessPopup={isSuccessPopup} onCloseSuccessPopup={popupSuccessClose}/>, <ErrorPopup isOpenErrorPopup={isErrorPopup} onCloseErrorPopup={closePopups} />]}/>} />
        </Routes>
    );
}

export default App;
