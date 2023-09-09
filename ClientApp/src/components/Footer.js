import React, { useContext } from 'react';
import Instagram from '../assets/Instagram.png'
import Facebook from '../assets/Facebook.png'
import Twitter from '../assets/Twitter.png'
import { UserSettingsContext } from '../App';

export function Footer() {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  return (
    <footer >
      <div className={`flex flex-col items-center text-white shadow-[0px_0px_6px] rounded-sm  mt-8 z-50 w-full xl:h-42 h-48 bg-green-700 ${userSettings.isDark && 'bg-zinc-800 shadow-black text-zinc-200'}`}>
        <div className='flex xl:mt-9 mt-4'>
            <div className='flex items-center justify-center bg-white md:w-[70px] md:h-[70px] w-16 h-16 mx-4 md:mx-4 rounded-[50%]'>
                <img className='w-[67%]' src={Instagram} />
            </div>
            <div className='flex items-center justify-center bg-white md:w-[70px] md:h-[70px] w-16 h-16 mx-4 md:mx-4 rounded-[50%]'>
                <img className='w-[67%]' src={Facebook} />
            </div>
            <div className='flex items-center justify-center bg-white md:w-[70px] md:h-[70px] w-16 h-16 mx-4 md:mx-4 rounded-[50%]'>
                <img className='w-[67%]' src={Twitter} />
            </div>
        </div>
        <div className='xl:text-2xl text-lg xl:block flex flex-col xl:mt-7 mt-2 text-center xl:ml-5'>
            <span className='xl:mx-20'>Fiscal N°: 01332580674</span>
            <span className='xl:mx-20 mt-1'>Phone: +12 745643453</span>
            <span className='xl:mx-20 mt-1'>Mail: support@diety.com</span>
        </div>
      </div>
    </footer>
  );
}
