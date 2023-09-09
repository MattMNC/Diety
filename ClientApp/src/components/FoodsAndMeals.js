import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import RemoveModal from './RemoveModal';
import { DeleteIcon, EditIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function FoodsAndMeals() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //------------------------------------------STATE---------------------------------------------
    const [foods, setFoods] = useState([]); //Foods array, populated by fetch (on load useEffect)
    const [meals, setMeals] = useState([]); //Meals array, populated by fetch (on load useEffect)

    //Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [modalSettings, setModalSettings] = useState({ //passed by props to the modal, defines the type of entity(food, meal or routine) 
        type: "",                                        //and the id of the record to delete
        id: 0
    });
    //---------------------------------------------------------------------------------------------

    //On component load: fetch the meals and the foods and load them into state arrays
    useEffect(() => {
        fetch('food',
            {
                headers: {
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            }
        )
            .then(response => { return response.json(); })
            .then(data => {
                const orderedData = data.reverse()
                setFoods(orderedData);
            });
        fetch('meal',
            {
                headers: {
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            }
        )
            .then(response => { return response.json(); })
            .then(data => {
                const orderedData = data.reverse()
                setMeals(orderedData);
            });
    }, [])

    return (
        <div className='mt-8'>
            {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={modalSettings.type == "food" ? setFoods : setMeals} />}
            <div className='flex items-center justify-between'>
                <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3 '>FOODS</h2>
                <NavLink tag={Link} to="/foods-view">
                    <p className='font-corbel underline text-xl text-green-700 '>see all</p>
                </NavLink>
            </div>
            <ul className='flex flex-col justify-center items-center '>
                {foods && foods.map((food, index) => {
                    if (index >= 10)
                        return false
                    else return (
                        <li className={`mb-2 flex flex-row items-center justify-between border-b-2 w-80 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} key={food.id}>
                            <span className='font-corbel  text-2xl'>{food.name}</span>
                            <span>
                                <NavLink tag={Link} to="/food-form" state={{ isEdit: true, foodId: food.id }}>
                                    <EditIcon className={`ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} />
                                </NavLink>
                                <span>
                                    <DeleteIcon
                                        onClick={() => {
                                            setModalSettings({
                                                type: "food",
                                                id: food.id
                                            })
                                            setShowDeleteModal(true)
                                        }}
                                        className=' ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                </span>
                            </span>
                        </li>
                    )
                })}
                <li className='mb-2 flex flex-row items-center justify-between w-80'>
                    <NavLink tag={Link} to="/food-form" state={{ isEdit: false }}>
                        <span className='font-corbel text-green-700 underline text-2xl'>New food</span>
                    </NavLink>
                </li>
            </ul>

            <div className='flex items-center justify-between mt-8'>
                <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3'>MEALS</h2>
                <NavLink tag={Link} to="/meals-view">
                    <p className='font-corbel  underline text-xl text-green-700'>see all</p>
                </NavLink>
            </div>
            <ul className='mb-4 flex flex-col justify-center items-center'>
                {meals && meals.map((meal, index) => {
                    if (index >= 10)
                        return false
                    else return (
                        <li className={`mb-2 flex flex-row items-center justify-between border-b-2 w-80 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} key={meal.id}>
                            <span className='font-corbel  text-2xl'>{meal.name}</span>
                            <span>
                                <NavLink tag={Link} to="/meal-form" state={{ isEdit: true, mealId: meal.id, foods: foods }}>
                                    <EditIcon className={`ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} />
                                </NavLink>
                                <span>
                                    <DeleteIcon
                                        onClick={() => {
                                            setModalSettings({
                                                type: "meal",
                                                id: meal.id
                                            })
                                            setShowDeleteModal(true)
                                        }}
                                        className=' ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                </span>
                            </span>
                        </li>
                    )
                })}
                <li className='mb-2 flex flex-row items-center justify-between  w-80'>
                    <NavLink tag={Link} className="text-dark" to="/meal-form" state={{ isEdit: false, foods: foods }}>
                        <span className='font-corbel text-green-700 underline text-2xl'>New meal</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}