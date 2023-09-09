import React, { useState, useContext } from 'react';
import { LoginContext, UserSettingsContext } from '../App';
import { useNavigate } from 'react-router-dom';
import SaveModal from './SaveModal';

export default function LoginForm() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext); //Context
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    const navigate = useNavigate(); //Assign to navigate a function that takes as parameter a route to navigate to

    //------------------------------------------------STATE----------------------------------------------------------------
    //Login form state
    const [loginData, setLoginData] = useState({
        Username: "",
        Password: ""
    });

    //Modal state
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState({ //passed by props to the modal, defines the type of message and the message text itself
        type: null, //"error" or "warning" or null
        text: ""
    })
    //---------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------FUNCTIONS---------------------------------------------------------------
    function handleChange(e) {
        const { name, value } = e.target;
        setLoginData(prevLoginData => ({
            ...prevLoginData,
            [name]: value
        }));
    }

    //on submit a POST request to login is made, the result is a message with a result (Success or Error) and if success the user settings to load to the userSettings(context)
    function handleSubmit(e) {
        e.preventDefault();
        fetch('user/login', {
            method: 'POST',
            body: JSON.stringify({
                Username: loginData.Username,
                Password: loginData.Password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then(response => { return response.json(); })
            .then(data => {
                if (data.value.result == "Success") {
                    localStorage.setItem("jwtToken", JSON.stringify(data.value.jwtToken));
                    setLoggedIn(true);
                    setUserSettings(data.value.userSettings)
                    navigate("/")
                }
                else if (data.value.result == "Error") {
                    setModalMessage({
                        type: "error",
                        text: data.value.message
                    })
                    setShowSaveModal(true)
                }
            });
    }

    function resetModalMessage() {
        setModalMessage({
            type: null,
            text: ""
        })
    }
    //----------------------------------------------------------------------------------------------------------------------------------

    return (
        <>
            {showSaveModal && <SaveModal type="meal" setShowModal={setShowSaveModal} message={modalMessage} resetMessage={resetModalMessage} />}
            <form className='md:text-xl font-corbel text-lg mt-8 h-96 flex flex-col align-center justify-center sm:shadow-2xl rounded-xl sm:w-[600px] w-full' onSubmit={handleSubmit}>
                <div className='mx-4'>
                    <label className='font-bold' htmlFor="login-username">Username</label>
                    <input
                        className='mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        id="login-username"
                        name="Username"
                        placeholder="Username"
                        autoComplete="off"
                        value={loginData.Username}
                        onChange={handleChange}
                    />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="login-password">Password</label>
                    <input
                        className='mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="password"
                        id="login-password"
                        name="Password"
                        placeholder="Password"
                        value={loginData.Password}
                        onChange={handleChange}
                    />
                </div>
                <button className='font-corbel text-2xl mt-6 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500' type="submit">Login</button>
            </form>
        </>
    )
}