import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { useEffect, useContext } from 'react';
import { LoginContext, UserSettingsContext } from '../App';
import HealthyFood1 from '../assets/HealthyFood1.png';
import TimeTable from '../assets/TimeTable.png';
import Meals from '../assets/Meals.png';
import FoodsAndMealsButton from '../assets/Nutrition.png';
import Calendar from '../assets/Calendar.png';
import FoodsButton from '../assets/FoodsButton.png';
import MealsButton from '../assets/MealsButton.png';

export function Home() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext); //Context
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //On component load: search in the localStorage (browser cache) for a JwtToken, if a jwt token is found make a fetch to user
  //to check if the token is valid, if it is then set loggedIn (context) as true and load the userSettings returned by the controller (context)
  //else set LoggedIn as false and delete the unvalid token from localStorage
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("jwtToken")) || undefined;
    if (token == "") {
      setLoggedIn(false)
    }
    else if (token != "") {
      fetch('user', {
        method: 'GET',
        headers: {
          'Authorization': 'bearer ' + token,
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then(response => { return response.json(); })
        .then(data => {
          if (data.value.result == "Success" && (loggedIn == false || loggedIn == undefined)) {
            setUserSettings(data.value.userSettings)
            setLoggedIn(true);
          }
        })
        .catch(() => {
          setLoggedIn(false);
          localStorage.removeItem("jwtToken");
        })
    }
  }, [])

  return (
    <div>
      {
        loggedIn == undefined ?
          <></>
          : loggedIn ?
            <>
              <div className={`flex flex-col  ${userSettings.advancedView ? 'lg:flex-row' : 'md:flex-row'}`}>
                {
                  userSettings.advancedView ?
                    <>
                      <NavLink tag={Link} to="/foods-view">
                        <div className={`flex flex-col items-center justify-center w-[300px] h-[300px] rounded-3xl bg-green-700 m-5 mt-12 shadow-md hover:bg-green-600 duration-500 ${userSettings.isDark && 'bg-green-900 hover:bg-green-700'}`}>
                          <img src={FoodsButton} className='w-[75%] mt-1' />
                          <p className='font-corbel text-white text-2xl mt-3'>Foods</p>
                        </div>
                      </NavLink>
                      <NavLink tag={Link} to="/meals-view">
                        <div className={`flex flex-col items-center justify-center w-[300px] h-[300px] rounded-3xl bg-green-700 m-5 mt-12 shadow-md hover:bg-green-600 duration-500 ${userSettings.isDark && 'bg-green-900 hover:bg-green-700'}`}>
                          <img src={MealsButton} className='w-[75%] mt-1' />
                          <p className='font-corbel text-white text-2xl mt-3'>Meals</p>
                        </div>
                      </NavLink>
                    </>
                    :
                    <NavLink tag={Link} to="/foods-and-meals">
                      <div className={`flex flex-col items-center justify-center w-[300px] h-[300px] rounded-3xl bg-green-700 m-5 mt-12 shadow-md hover:bg-green-600 duration-500 ${userSettings.isDark && 'bg-green-900 hover:bg-green-700 '}`}>
                        <img src={FoodsAndMealsButton} className='w-[75%] mt-1' />
                        <p className={`font-corbel text-white text-2xl mt-3`}>Foods & Meals</p>
                      </div>
                    </NavLink>
                }
                <NavLink tag={Link} to="/meal-routines">
                  <div className={`flex flex-col items-center justify-center w-[300px] h-[300px] rounded-3xl bg-green-700 m-5 mt-12 shadow-md hover:bg-green-600 duration-500 ${userSettings.isDark && 'bg-green-900 hover:bg-green-700 '}`}>
                    <img src={Calendar} className='w-[75%] mt-1' />
                    <p className='font-corbel text-white text-2xl mt-3'>Routines</p>
                  </div>
                </NavLink>
              </div>
            </>
            :
            <>
              <div className='relative flex md:flex-row flex-col items-center m-auto mt-10 w-full'>
                <div className='flex flex-col items-center md:w-1/2  w-100'>
                  <h2 className='text-7xl tracking-tight text-green-700  px-2 font-corbel'><font className='font-bold'>EAT </font><font className='text-gray-800'>smart</font><br /><font className='text-gray-800'>live</font> <font className='font-bold'>HEALTHY</font></h2>
                  <p className='mt-3 text-3xl text-center  px-2'>The way for a better living is made of small steps, here's the first one.</p>
                  <Link className='text-center ' tag={Link} to="/register">
                    <button className='text-3xl mt-5 bg-green-700 text-white font-corbel font-bold py-3 px-8 rounded hover:bg-green-600 duration-500'>SIGN IN</button>
                  </Link>
                </div>
                <div className='w-1/2 md:m-0 mt-8'>
                  <img className='md:w-[340px] m-auto rounded-md' src={HealthyFood1} />
                </div>
              </div>
              <div className='relative  flex md:flex-row flex-col-reverse items-center m-auto mt-20 w-full'>
                <div className='w-1/2 md:m-0 mt-8'>
                  <img className='md:w-[340px] m-auto rounded-md' src={TimeTable} />
                </div>
                <div className='flex flex-col items-center md:w-1/2 w-100'>
                  <h2 className='text-7xl tracking-tight text-green-700 text-center font-corbel md:p-0 px-2'><font className='text-gray-800'>Track your</font> <font className='font-bold'>DIET</font></h2>
                  <p className='mt-3 text-3xl text-center md:p-0 px-1'>Store your foods and create your weekly routines, track nutritional values precisly with total customization.</p>
                </div>
              </div>
              <div className='relative  flex md:flex-row flex-col items-center m-auto mt-20 w-full'>
                <div className='flex flex-col items-center md:w-1/2 w-100'>
                  <h2 className='text-7xl tracking-tight text-green-700 text-center font-corbel  px-2'><font className='text-gray-800'>Meals make it</font> <font className='font-bold'>EASIER</font></h2>
                  <p className='mt-3 text-3xl text-center px-1'>Grouping foods in meals makes it easier to organize routines and count macros.</p>
                </div>
                <div className='w-1/2 md:m-0 mt-8'>
                  <img className='md:w-[370px] m-auto rounded-md' src={Meals} />
                </div>
              </div>
            </>
      }
    </div>


  );
}
