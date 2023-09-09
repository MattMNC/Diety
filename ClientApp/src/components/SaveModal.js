import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../App';

export default function SaveModal({ type, setShowModal, save, message, resetMessage }) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //The return in the useEffect defines what are the actions to perform on component unload, in this case i reset the modal message variable
  useEffect(() => {
    return () => { resetMessage() }
  }, [])

  //Save and close
  function handleSubmit(e) {
    e.preventDefault()
    save()
    setShowModal(false)
  }

  return (
    <div className="h-screen w-full bg-gray-700/50 fixed left-0 top-0 flex justify-center items-center z-40">
      <form onSubmit={handleSubmit} className={`flex flex-col font-corbel text-lg justify-between rounded-lg shadow-2xl min-h-44 h-auto w-[360px] z-50 p-0 ${userSettings.isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-white text-black'}`}>
        <header className="bg-green-700 rounded-t-lg flex justify-end items-center h-8">
          <ChromeCloseIcon className="text-white mr-2 cursor-pointer" onClick={() => setShowModal(false)} />
        </header>
        {message.type == "error" ?
          <>
            <p className='font-corbel text-xl ml-3 mt-2'>{message.text}</p>
            <footer className={`flex justify-end border-t p-3 mt-5 ${userSettings.isDark && 'border-zinc-600'}`}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center font-corbel text-xl  bg-green-700 text-white  rounded w-28 h-10 hover:bg-green-600 duration-500"
              >
                Close
              </button>
            </footer>
          </>
          :
          message.type == "warning" ?
            <>
              <p className='font-corbel text-xl ml-3 mt-2'>{message.text}</p>
              <p className='font-corbel text-xl ml-3 mt-1'>Do you want to save this {type}?</p>
              <footer className={`flex justify-end border-t p-3 mt-5 ${userSettings.isDark && 'border-zinc-600'}`}>
                <button
                  type="submit"
                  className="flex items-center justify-center font-corbel text-xl  bg-green-700 text-white  rounded w-28 h-10 hover:bg-green-600 duration-500"
                >
                  Save
                </button>
              </footer>
            </>
            :
            <>
              <p className='font-corbel text-xl ml-3 mt-2'>Do you want to save this {type}?</p>
              <footer className={`flex justify-end border-t p-3 mt-5 ${userSettings.isDark && 'border-zinc-600'}`}>
                <button
                  type="submit"
                  className="flex items-center justify-center font-corbel text-xl  bg-green-700 text-white  rounded w-28 h-10 hover:bg-green-600 duration-500"
                >
                  Save
                </button>
              </footer>
            </>
        }
      </form>
    </div>
  )
}