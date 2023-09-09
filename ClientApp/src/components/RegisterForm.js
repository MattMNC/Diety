import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext, UserSettingsContext } from '../App';
import SaveModal from './SaveModal';

export default function RegisterForm() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext); //Context
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    const navigate = useNavigate(); //Assign to navigate a function that takes as parameter a route to navigate to

    //------------------------------------------STATE-------------------------------------------------
    const [registrationData, setRegistrationData] = useState({ //Registration form state
        email: "",
        username: "",
        password: "",
    })

    //Modal state
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState({
        type: null, // "error" or "warning" or null
        text: ""
    })
    //------------------------------------------------------------------------------------------------

    function handleChange(e) {
        const { name, value } = e.target;
        setRegistrationData(prevRegistrationData => ({
            ...prevRegistrationData,
            [name]: value
        }))
    }

    //REGEX mail format check
    function checkMail(mail) 
    { 
        var mailFormat =  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if(mail.match(mailFormat)) { 
            return true;
        }
        else {
            return false;
        }
    } 

    //REGEX Password must be a string containing from 8 to 15 characters, at least one lowercase letter, one uppercase letter, one numeric digit and one special character
    function checkPassword(password) 
    { 
        var pswFormat =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(password.match(pswFormat)) { 
            return true;
        }
        else {
            return false;
        }
    } 

    //On form submit make a register request to the user controller, if the result is Success log in the user
    function handleSubmit(e) {
        e.preventDefault()
        if(!checkMail(registrationData.email)) {
            setModalMessage({
                type: "error",
                text: "Insert a valid mail"
            })
            setShowSaveModal(true)
        }
        else if(registrationData.username.length < 1)
        {
            setModalMessage({
                type: "error",
                text: "Insert a user name"
            })
            setShowSaveModal(true)
        }
        else if(!checkPassword(registrationData.password))
        {
            setModalMessage({
                type: "error",
                text: "Password must be a string containing from 8 to 15 characters, at least one lowercase letter, one uppercase letter, one numeric digit and one special character"
            })
            setShowSaveModal(true)
        }
        else {
            fetch('user/register', {
                method: 'POST',
                body: JSON.stringify({
                    Email: registrationData.email,
                    Username: registrationData.username,
                    Password: registrationData.password,
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
    }

    function resetModalMessage() {
        setModalMessage({
            type: null,
            text: ""
        })
    }

    return (
        <>
            {showSaveModal && <SaveModal type="meal" setShowModal={setShowSaveModal} message={modalMessage} resetMessage={resetModalMessage} />}
            <form className='md:text-xl font-corbel text-lg mt-8 h-96 flex flex-col align-center justify-center sm:shadow-2xl rounded-xl sm:w-[600px] w-full' onSubmit={handleSubmit}>
                <div className='mx-4'>
                    <label className='font-bold ' htmlFor="register-email">Email</label>
                    <input
                        className='mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        id="register-email"
                        name="email"
                        placeholder='Email'
                        autoComplete="off"
                        value={registrationData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold ' htmlFor="register-username">Username</label>
                    <input
                        className='mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        id="register-username"
                        name="username"
                        placeholder='Username'
                        autoComplete="off"
                        value={registrationData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold ' htmlFor="register-password">Password</label>
                    <input
                        className='mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="password"
                        id="register-password"
                        name="password"
                        placeholder='Password'
                        value={registrationData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className='font-corbel text-2xl mt-6 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500'>Register</button>
            </form>
        </>
    )
}