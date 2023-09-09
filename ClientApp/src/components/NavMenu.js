import React, { useState, useContext } from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginContext, UserSettingsContext } from '../App';
import LogoutModal from './LogoutModal';
import { GlobalNavButtonIcon, ChromeCloseIcon } from '@fluentui/react-icons-mdl2';

export function NavMenu() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext); //Context
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //----------------------------------------STATE----------------------------------
  //In mobile mode the nav list becomes a drop down nav menu, this variable keeps track of whether the menu is open or closed
  const [open, setOpen] = useState(false);

  //Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  //-------------------------------------------------------------------------------

  function toggleNavbar() {
    setOpen(prevOpen => !prevOpen);
  }

  //On logout confirmation removes jwtToken from localstorage and clean userSettings
  function logout() {
    localStorage.removeItem("jwtToken");
    setUserSettings({
      proPic: "",
      isDark: false,
      advancedView: false
    });
    setLoggedIn(false);
  }

  return (
    <header>
      {showLogoutModal && <LogoutModal setShowModal={setShowLogoutModal} logout={logout} />}
      {loggedIn ?
        <div className={`z-10 shadow-md w-full ${userSettings.isDark && 'shadow-zinc-900'}`}>
          <div className={`md:flex items-center justify-between relative py-4 md:px-10 px-7 ${userSettings.isDark ? 'bg-zinc-800' : 'bg-white'}`}>
            <div className='font-bold text-2xl cursor-pointer flex items-center font-sans text-gray-800'>
              <NavLink className='text-3xl text-green-700 mr-1 ' tag={Link} to="/">
                DIETY
              </NavLink>
            </div>
            <div onClick={toggleNavbar} className={`text-3xl absolute right-8 top-3 cursor-pointer md:hidden ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
              {open ? <ChromeCloseIcon /> : <GlobalNavButtonIcon />}
            </div>
            <ul className={`md:flex md:items-center md:pb-0 md:static md:z-auto md:w-auto md:pl-0 md:shadow-none pb-12 absolute z-[-1] left-0 w-full pl-9 transition-all duration-170 ease-in ${open ? 'top-20 opacity-100 shadow-md z-[50]' : 'top-[-300px]'} ${userSettings.isDark ? 'bg-zinc-800' : 'bg-white'} `}>
              {
                userSettings.advancedView ?
                  <>
                    <li className='md:ml-8 text-xl md:my-0 my-7'><NavLink tag={Link} to="/foods-view" onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`}>Foods</NavLink></li>
                    <li className='md:ml-8 text-xl md:my-0 my-7'><NavLink tag={Link} to="/meals-view" onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`}>Meals</NavLink></li>
                  </>
                  :
                  <li className='md:ml-8 text-xl md:my-0 my-7'><NavLink tag={Link} to="/foods-and-meals" onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`}>Foods & Meals</NavLink></li>
              }
              <li className='md:ml-8 text-xl md:my-0 my-7'><NavLink tag={Link} to="/meal-routines" onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`}>Routines</NavLink></li>
              <li className='md:hidden md:ml-8 text-xl md:my-0 my-7'><NavLink tag={Link} to="/settings" onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`}>Settings</NavLink></li>
              <NavLink tag={Link} onClick={() => {
                  setShowLogoutModal(true)
                  setOpen(false)
                }} className='bg-green-700 text-white font-sans py-2 px-6 rounded md:ml-8 hover:bg-green-600 duration-500' to="/">
                LOG OUT
              </NavLink>
              <NavLink tag={Link} to="settings">
                <img src={userSettings.proPic} className='hidden md:block object-cover w-[50px] h-[50px] rounded-[50%] bg-green md:ml-8 md:my-0 mt-7'></img>
              </NavLink>
            </ul>
          </div>
        </div>
        :
        <div className='z-10 shadow-md w-full '>
          <div className='md:flex items-center relative justify-between bg-white py-4 md:px-10 px-7'>
            <div className='font-bold text-2xl cursor-pointer flex items-center font-sans text-gray-800'>
              <NavLink className='text-3xl text-green-700 mr-1 ' tag={Link} to="/">
                DIETY
              </NavLink>
            </div>
            <div onClick={toggleNavbar} className='text-3xl absolute right-8 top-3 cursor-pointer md:hidden'>
              {open ? <ChromeCloseIcon /> : <GlobalNavButtonIcon />}
            </div>
            <ul className={`md:flex md:items-center md:pb-0 md:static md:shadow-none md:z-auto md:w-auto md:pl-0 pb-12 absolute bg-white z-[-1] left-0 w-full pl-9 transition-all duration-170 ease-in ${open ? 'top-20 opacity-100 shadow-md z-[50]' : 'top-[-300px]'}`}>
              <li className='md:ml-8 text-xl md:my-0 my-7'><a onClick={() => setOpen(false)} className={`${userSettings.isDark ? 'text-zinc-100' : 'text-black'}`} href='https://github.com/MattMNC/Diety'>Github</a></li>
              <NavLink tag={Link} onClick={() => setOpen(false)} className='bg-green-700 text-white font-sans py-2 px-6 rounded md:ml-8 hover:bg-green-600 duration-500' to="/login">
                LOG IN
              </NavLink>
            </ul>
          </div>
        </div>
      }
    </header>
  );
}
