import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SaveModal from './SaveModal';
import { useNavigate } from 'react-router-dom';
import { UserSettingsContext } from '../App';

export default function Settings() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //-------------------------------STATE----------------------------------------------
    const [image, setImage] = useState(""); //Here the base64 string for the image is stored on image change (the same string is passed as src to the img tag)

    const [settingsForm, setSettingsForm] = useState({ //Settings form state, initialized using user settings context
        isDark: userSettings.isDark,
        advancedView: userSettings.advancedView
    })
    
    //If a profile picture is already loaded in the user settings context(that means that user already set a profile picture) set image to that picture
    useEffect(() => {
        if (userSettings.proPic != "")
            setImage(userSettings.proPic)
    }, [])

    //On input file change converts the image in the corresponding base64 string and stores it into image state variable
    function handleImageChange(e) {
        var file = e.target.files[0]
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImage(reader.result)
        };
    }

    function handleChange(e) {
        const {name, checked} = e.target;
        setSettingsForm(prevFormSettings => ({...prevFormSettings, [name]: checked}))
    }

    //On settings form submit
    function handleSubmit(e) {
        e.preventDefault()
        //If the image is not empty and is different from the current user profile picture PUT request to update the profile picture
        if (image != "" && image != userSettings.proPic) { 
            fetch('user/profilePicture', {
                method: 'PUT',
                body: JSON.stringify(
                    image
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if(data.value.result == "Success") {
                        setUserSettings(prevUserSettings => ({...prevUserSettings, proPic: image}))
                    }
                });
        }
        //If at least one of the option parameters is different from the current user options PUT request to update the user settings
        if(settingsForm.isDark != userSettings.isDark || settingsForm.advancedView != userSettings.advancedView) {
            fetch('settings', {
                method: 'PUT',
                body: JSON.stringify(
                    settingsForm
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if(data.value.result == "Success") {
                        setUserSettings(prevUserSettings => ({...prevUserSettings, isDark: settingsForm.isDark, advancedView: settingsForm.advancedView}))
                    }
                });
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col mt-8 items-center ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} >
            <h1 className='font-corbel font-bold text-5xl text-green-700 mb-3 '>SETTINGS</h1>
            <div className='flex flex-col my-8 pb-4 md:w-96 w-80 items-center border-b-4 '>
                <h2 className={`font-corbel text-4xl mb-3 `} >Profile Picture</h2>
                <div className='flex flex-col items-center md:flex-row md:items-end'>
                    {image ? <img className='w-60 h-60 object-contain border shadow-md' src={image}/> : userSettings.proPic ? <img className='w-60 h-60 object-contain mt-8 border' src={userSettings.proPic}/> : <img className='w-60 h-60 bg-black mt-8 border' />}
                    <label className='ml-4 mt-2 cursor-pointer font-corbel text-2xl  text-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500'>
                        <input className='hidden' onChange={handleImageChange} type="file" accept="image/png, image/jpeg"/>
                        {image ? <>Change</> : <>Upload</>}
                    </label>
                </div>
            </div>
            <div className='grid grid-rows-1 grid-cols-2 border-b-4 mb-4 md:w-96 w-80'>
                <span className='font-corbel text-3xl  '>Dark Theme</span>
                <label className={`ml-4 mb-4 bg-white-700 cursor-pointer relative w-14 h-7 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)] ${userSettings.isDark ? 'bg-white border border-white' : 'bg-stone-200'}`} htmlFor='darkTheme'>
                    <input className='sr-only peer' type='checkbox' id='darkTheme' name="isDark" checked={settingsForm.isDark} onChange={handleChange} />
                    <span className='w-2/5 h-4/5 bg-gray-300 absolute rounded-full left-[8%] top-[10%] peer-checked:bg-green-700 peer-checked:left-[52%] transition-all checked:duration-500'></span>
                </label>
            </div>
            <div className='grid grid-rows-1 grid-cols-2 border-b-4 mb-4 md:w-96 w-80'>
                <span className='font-corbel text-3xl'>Advanced view</span>
                <label className={`ml-4 mb-4 bg-white-700 cursor-pointer relative w-14 h-7 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)] ${userSettings.isDark ? 'bg-white border-2 border-white' : 'bg-stone-200'}`} htmlFor='advancedView'>
                    <input className='sr-only peer' type='checkbox' id='advancedView' name="advancedView" checked={settingsForm.advancedView} onChange={handleChange} />
                    <span className='w-2/5 h-4/5 bg-gray-300 absolute rounded-full left-[8%] top-[10%] peer-checked:bg-green-700 peer-checked:left-[52%] transition-all checked:duration-500'></span>
                </label>
            </div>
            <button className='font-corbel text-2xl mt-4 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500' type='submit'>Save</button>
        </form>
    )
}