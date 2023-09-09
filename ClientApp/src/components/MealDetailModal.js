import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../App';

export default function MealsModal({ setShowModal, mealDetail, setMeal, addMeal }) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //------------------------------------------------STATE----------------------------------------------------------------
  //Food array to store and render meal's foods
  const [foods, setFoods] = useState([])
  //---------------------------------------------------------------------------------------------------------------------

  //On component load: a fetch request to get the foods related to the meal
  useEffect(() => {
    fetch('food/meal/' + mealDetail.id,
      {
        headers: {
          'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
        }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setFoods(data)
      })
      .catch(error => { return undefined })
  }, [])

  return (
    <div className="h-screen w-full bg-gray-700/50 fixed left-0 top-0 flex justify-center items-center z-40">
      <div className={`flex flex-col font-corbel md:text-lg text-xl justify-between rounded-lg shadow-2xl min-h-44 h-auto md:w-[270px] w-[340px] z-50 p-0 ${userSettings.isDark ? 'text-zinc-200 bg-zinc-800' : 'bg-white text-black'}`}>
        <header className="bg-green-700 rounded-t-lg flex justify-end items-center h-8">
          <ChromeCloseIcon className="text-white mr-2 cursor-pointer" onClick={() => setShowModal(false)} />
        </header>
        <div className='ml-3 my-3'>
          <p>
            <b>Name:</b> {mealDetail.name}
          </p>
          <p>
            <b>Notes:</b> {mealDetail.notes}
          </p>
          <div>
            <h2><b>Foods</b></h2>
            <ul>
              {foods.map(food => <li className={`mx-3 border-b ${userSettings.isDark && 'border-zinc-500'}`} key={food.foodId}>{food.foodName}: <font className='font-sans md:text-base text-lg'>{food.quantity} g</font></li>)}
            </ul>
          </div>
        </div>
        <footer className={`flex justify-end items-center border-t p-3 ${userSettings.isDark && 'border-zinc-500'}`}>
          <button
            onClick={() => setShowModal(false)}
            className={`flex items-center justify-center font-corbel text-xl mr-1 text-green-700 border box-border border-green-700  rounded w-28 h-10 ${userSettings.isDark ? 'bg-green-900 text-zinc-200' : 'bg-white'}`}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}