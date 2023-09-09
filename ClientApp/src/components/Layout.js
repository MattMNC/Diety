import React, { useContext } from 'react';
import { NavMenu } from './NavMenu'
import { Footer } from './Footer';
import { UserSettingsContext } from '../App';


export function Layout(props) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  return (
    <div className={`flex flex-col justify-between h-full overflow-auto ${userSettings.isDark ? 'bg-zinc-800' : 'bg-white'}`}>
      <div>
        <NavMenu />
        <div className='flex items-center justify-center'>
          {props.children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
