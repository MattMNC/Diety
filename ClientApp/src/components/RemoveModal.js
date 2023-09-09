import { ChromeCloseIcon } from '@fluentui/react-icons-mdl2';
import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../App';

export default function RemoveModal({ type, id, setShowModal, setList }) {
  const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

  //State
  //For the elimination of entities contained in other entities (they can be meal containing foods or routines containing meals) i fetch the containing entities
  //and i load them in this array to display them in the remove confirmation modal
  const [entityList, setEntityList] = useState([])

  useEffect(() => {
    if (type == "meal") {
      //If i'm deleting a meal fetch the routines containing that meal
      fetch('routine/meal/' + id,
        {
          headers: {
            'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
          }
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          setEntityList(data)
        }).catch(error => { return undefined })
    }
    else if (type == "food") {
      //If i'm deleting an food fetch the meals containing that food
      fetch('meal/food/' + id,
        {
          headers: {
            'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
          }
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          setEntityList(data)
        }).catch(error => { return undefined })
    }
  }, [])

  //On remove modal confirmation delete the related entity
  function handleSubmit(e) {
    e.preventDefault()
    if (type == "routine") {
      //REMOVE ROUTINE
      fetch('routine/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
        }
      })
        .then(response => { return response.json(); })
        .then(setList(
          prevList => prevList.filter(l => l.id != id)
        ))
        .then(setShowModal(false))
    }
    else if (type == "meal") {
      //REMOVE MEAL
      fetch('meal/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
        }
      })
        .then(response => { return response.json(); })
        .then(setList(
          prevList => prevList.filter(l => l.id != id)
        ))
        .then(setShowModal(false))
    }
    else if (type == "food") {
      //REMOVE FOOD
      fetch('food/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
        }
      })
        .then(response => { return response.json(); })
        .then(setList(
          prevList => prevList.filter(l => l.id != id)
        ))
        .then(setShowModal(false))
    }
  }

  return (
    <div className="h-screen w-full bg-gray-700/50 fixed left-0 top-0 flex justify-center items-center z-40">
      <form onSubmit={handleSubmit} className={`flex flex-col font-corbel text-lg justify-between rounded-lg shadow-2xl min-h-44 h-auto w-[360px] z-50 p-0 ${userSettings.isDark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}>
        <header className="bg-green-700 rounded-t-lg flex justify-end items-center h-8">
          <ChromeCloseIcon className="text-white mr-2 cursor-pointer" onClick={() => setShowModal(false)} />
        </header>
        <p className='font-corbel text-xl ml-3 mt-2'>Do you want to delete this {type}?</p>
        {
          type == "meal" && entityList.length > 0 ?
            <div>
              <p className='font-corbel md:text-lg text-xl ml-3 mt-2'>This meal is contained in routines: </p>
              <ul>
                {
                  entityList.map(en => <li key={en.id} className={`flex items-center justify-between border-b px-4 mx-2 mt-1 ${userSettings.isDark && 'border-zinc-600'}`}>{en.name}</li>)
                }
              </ul>
            </div>
            :
            type == "food" && entityList.length > 0 ?
              <div>
                <p className='font-corbel md:text-lg text-xl ml-3 mt-2'>This food is contained in meals: </p>
                <ul>
                  {
                    entityList.map(en => <li key={en.id} className={`flex items-center justify-between border-b px-4 mx-2 mt-1 ${userSettings.isDark && 'border-zinc-600'}`}>{en.name}</li>)
                  }
                </ul>
              </div>
              :
              null
        }
        <footer className={`flex justify-end border-t p-3 mt-5 ${userSettings.isDark && 'border-zinc-600'}`}>
          <button
            type="submit"
            className="flex items-center justify-center font-corbel text-xl  bg-green-700 text-white  rounded w-28 h-10"
          >
            Remove
          </button>
        </footer>
      </form>
    </div>
  )
}