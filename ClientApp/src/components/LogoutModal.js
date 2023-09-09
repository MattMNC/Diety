import React, { useContext, useState } from 'react';
import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function LogoutModal({ setShowModal, logout }) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  const handleSubmit = (e) => {
    e.preventDefault()
    logout()
    setShowModal(false)
  }

  return (
    <div className="h-screen w-full bg-gray-700/50 fixed left-0 top-0 flex justify-center items-center z-40">
      <form onSubmit={handleSubmit} className={`flex flex-col justify-between rounded-lg shadow-2xl w-[320px] md:w-[270px] h-44 z-50 p-0 ${userSettings.isDark ? 'text-zinc-200 bg-zinc-800' : 'bg-white text-black'}`}>
        <div>
          <header className="bg-green-700 rounded-t-lg flex justify-end items-center h-8">
            <ChromeCloseIcon className="text-white mr-2 cursor-pointer" onClick={() => setShowModal(false)} />
          </header>
          <p className='font-corbel text-2xl md:text-xl ml-3 mt-2'>Do you want to logout?</p>
        </div>
        <footer className="flex justify-end items-center border-t p-3">
          <button
            className='flex items-center justify-center font-corbel text-xl  bg-green-700 text-white  rounded w-28 h-10'
          >
            Logout
          </button>
        </footer>
      </form>
    </div>
  )
}