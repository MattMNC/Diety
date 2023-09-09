import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import RemoveModal from './RemoveModal';
import { DeleteIcon, EditIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function MealsView() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //---------------------------------------STATE---------------------------------------------------------------------------
    const [foods, setFoods] = useState([]); //Foods array, populated by fetch (on load useEffect)
    const [meals, setMeals] = useState([]); //Meals array, populated by fetch (on load useEffect)

    const [shownMeals, setShownMeals] = useState([]); //Shown meals, meals get filtered and assigned to this array on search input text onChange (this is the rendered array)

    //Modal state
    const [modalSettings, setModalSettings] = useState({ //passed by props to the modal, defines the type of entity(food, meal or routine) 
        type: "",                                        //and the id of the record to delete
        id: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    //-----------------------------------------------------------------------------------------------------------------------

    //On component load: fetch the foods and load them into state arrays (both meals and shownMeals arrays)
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
                setFoods(data);
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
                const orderedData = data.reverse();
                setMeals(orderedData);
                setShownMeals(orderedData);
            });
    }, [])

    //---------------------------------------------FUNCTIONS---------------------------------------------------------------
    //On search input text change filter foods array and assign the result to rendered array shownFoods
    function handleSearchChange(e) {
        e.preventDefault();
        const { value } = e.target;
        if (value != "") {
            var newMeals = meals.filter(m => m.name.toLowerCase().startsWith(value.toLowerCase()));
            (meals.filter(m => m.name.toLowerCase().includes(value.toLowerCase()) && !(m.name.toLowerCase().startsWith(value.toLowerCase())))).forEach(m => newMeals.push(m))
            setShownMeals(newMeals)
        }
        else {
            setShownMeals(meals)
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------

    return (
        <>
            <div className={`xl:block hidden mt-8 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
                {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={setShownMeals} />}
                <div className='flex justify-between items-start mb-5'>
                    <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3 mx-5'>MEALS</h2>
                    <input
                        className={`mt-1 mr-5 font-sans shadow appearance-none border self-end rounded w-[300px] h-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="search"
                        id="search"
                        placeholder='Search'
                        maxLength="50"
                        autoComplete="off"
                        onChange={handleSearchChange}
                    />
                </div>
                <table className='mx-5'>
                    <NavLink className='mb-2 flex flex-row items-center justify-between w-96' tag={Link} to="/meal-form" state={{ isEdit: false }}>
                        <span className='font-corbel text-green-700 underline text-2xl'>New meal</span>
                    </NavLink>
                    <tr>
                        <th className='font-corbel text-bold text-start text-2xl'>Name</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Calories</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Carbos</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Proteins</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Fats</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Fibers</th>
                        <th className='font-corbel text-bold text-start text-2xl'>Water</th>
                    </tr>
                    {shownMeals && shownMeals.map(meal => (
                        <tr className={`mb-2 border-b-2  ${userSettings.isDark && 'border-zinc-500'}`} key={meal.id}>
                            <td className='font-corbel text-2xl max-w-28 w-28'>{meal.name}</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.calories}</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.carbos} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.proteins} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.fats} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.fibers} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{meal.water} g</td>
                            <td>
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
                                        className='ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                </span>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
            <div className={`xl:hidden block mt-8 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
                {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={setMeals} />}
                <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3'>MEALS</h2>
                <input
                    className={`mt-1 mr-5 mb-5 font-sans shadow appearance-none border self-end rounded w-[300px] h-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Search'
                    maxLength="50"
                    autoComplete="off"
                    onChange={handleSearchChange}
                />
                <ul>
                    <li className='mb-2 flex flex-row items-center justify-between w-80'>
                        <NavLink  tag={Link} to="/meal-form" state={{ isEdit: false }}>
                            <span className='font-corbel text-green-700 underline text-2xl'>New meal</span>
                        </NavLink>
                    </li>
                    {shownMeals && shownMeals.map(meal => (
                        <li className='mb-2 max-w-[800px] w-80' key={meal.id}>
                            <div className='flex flex-row items-center justify-between'>
                                <span className='font-corbel text-2xl'>{meal.name}</span>
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
                                            className='ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                    </span>
                                </span>
                            </div>
                            <ul className='mt-1 grid grid-cols-1 md:grid-cols-2'>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>Kcal: <font className="font-sans">{meal.calories}</font></li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>carbohydrates: <font className="font-sans">{meal.carbos}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>proteins: <font className="font-sans">{meal.proteins}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fats: <font className="font-sans">{meal.fats}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fibers: <font className="font-sans">{meal.fibers}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>water: <font className="font-sans">{meal.water}</font> g</li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}