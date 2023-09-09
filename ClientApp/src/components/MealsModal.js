import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import React, { useContext, useState } from 'react';
import { UserSettingsContext } from '../App';

export default function MealsModal({ setShowModal, meals, setMeal, addMeal, meal }) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //State
  const [selectedMealId, setSelectedMealId] = useState(0); //On radio button click set this value to the selected meal Id
  //

  //On submit 
  function handleSubmit(e) {
    e.preventDefault()
    //Set Meal id to selected meal Id
    setMeal(prevMeal => {
      const meal = prevMeal;
      meal.mealId = selectedMealId;
      return meal
    })
    addMeal() //Push the meal in Routine form data
    setShowModal(false)
  }

  return (
    <div className="h-screen w-full bg-gray-700/50 fixed left-0 top-0 flex justify-center items-center z-40">
      <form onSubmit={handleSubmit} className={`flex flex-col font-corbel text-lg justify-between rounded-lg shadow-2xl min-h-44 h-auto w-[270px] z-50 p-0 ${userSettings.isDark ? 'text-zinc-200 bg-zinc-800' : 'bg-white text-black'}`}>
        <header className="bg-green-700 rounded-t-lg flex justify-end items-center h-8">
          <ChromeCloseIcon className="text-white mr-2 cursor-pointer" onClick={() => setShowModal(false)} />
        </header>
        <p className='font-corbel font-bold text-xl mx-3 mt-2'>Add a meal for {
          meal.day == "1" ? <>Monday</> :
            meal.day == "2" ? <>Tuesday</> :
              meal.day == "3" ? <>Wednesday</> :
                meal.day == "4" ? <>Thursday</> :
                  meal.day == "5" ? <>Friday</> :
                    meal.day == "6" ? <>Saturday</> :
                      <>Sunday</>} {meal.type}
        </p>
        <ul >
          {meals.map((meal, i) => (
            <li className={`flex items-center justify-between border-b px-4 mt-2 ${userSettings.isDark && 'border-zinc-500'}`}>
              <label htmlFor={`meal${meal.id}`}>{meal.name}</label>
              <input
                type="radio"
                name="title"
                required
                className="text-green-700 text-xl cursor-pointer accent-green-700 w-5 h-5 hover:border-green-700 hover:ring-0 hover:outline-none focus:outline-none focus:ring-0 focus:border-green-700"
                id={`meal${meal.id}`}
                checked={selectedMealId == meal.id}
                onChange={() => setSelectedMealId(meal.id)}
              />
            </li>
          ))}
        </ul>
        <footer className={`flex justify-end border-t p-3 mt-5 ${userSettings.isDark && 'border-zinc-500'}`}>
          <button
            type="submit"
            className="flex items-center justify-center font-corbel text-xl bg-green-700 text-white rounded w-28 h-10 hover:bg-green-600 duration-500"
          >
            Add
          </button>
        </footer>
      </form>
    </div>
  )
}