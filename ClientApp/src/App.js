import React, { useState, createContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

//LoginContext contains a single boolean variable 'loggedIn'
export const LoginContext = createContext();

//UserSettingsContext contains 
//-proPic: a base64 string or empty string(to display and update from Settings and to display in NavMenu)
//-isDark: a boolean which defines whether the dark theme is active or not
//-advancedView: a boolean which defines whether the advancedView mode is active or not
//In standard view there is a preview page FoodsAndMeals from which it is possible to access the detailed views MealsView and FoodsView.
//In advanced view there is direct access to detailed views FoodsView and MealsView
export const UserSettingsContext = createContext();

export default function App() {

  //State
  const [loggedIn, setLoggedIn] = useState(); //Context state
  const [userSettings, setUserSettings] = useState({ //Context state
    proPic: "",
    isDark: false,
    advancedView: false
  });
  //

  //render() {
    return (
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
        <UserSettingsContext.Provider value={[userSettings, setUserSettings]}>
          <Layout>
            <Routes>
              {AppRoutes.map((route, index) => {
                const { element, ...rest } = route;
                return <Route key={index} {...rest} element={element} />;
              })}
            </Routes>
          </Layout>
        </UserSettingsContext.Provider>
      </LoginContext.Provider>
    );
  //}
}
