import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import RemoveModal from './RemoveModal';
import { DeleteIcon, EditIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function FoodsView() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //---------------------------------------STATE---------------------------------------------------------------------------
    const [foods, setFoods] = useState([]); //Foods array, populated by fetch (on load useEffect)
    const [shownFoods, setShownFoods] = useState([]); //Shown foods, foods get filtered and assigned to this array on search input text onChange (this is the rendered array)

    //Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [modalSettings, setModalSettings] = useState({ //passed by props to the modal, defines the type of entity(food, meal or routine) 
        type: "",                                        //and the id of the record to delete
        id: 0
    });
    //-----------------------------------------------------------------------------------------------------------------------

    //On component load: fetch the foods and load them into state arrays (both foods and shownFoods arrays)
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
                const orderedData = data.reverse();
                setFoods(orderedData);
                setShownFoods(orderedData);
            });
    }, [])

    //---------------------------------------------FUNCTIONS---------------------------------------------------------------
    //On search input text change filter foods array and assign the result to rendered array shownFoods
    function handleSearchChange(e) {
        e.preventDefault();
        const { value } = e.target;
        if (value != "") {
            var newFoods = foods.filter(a => a.name.toLowerCase().startsWith(value.toLowerCase()));
            (foods.filter(a => a.name.toLowerCase().includes(value.toLowerCase()) && !(a.name.toLowerCase().startsWith(value.toLowerCase())))).forEach(a => newFoods.push(a))

            setShownFoods(newFoods)
        }
        else {
            setShownFoods(foods)
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------

    return (
        <>
            <div className={`xl:block hidden mt-8 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
                {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={setShownFoods} />}
                <div className='flex justify-between items-start mb-5'>
                    <h2 className='font-corbel font-bold text-4xl text-green-700 mx-5'>FOODS</h2>
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
                    <NavLink className='mb-2 flex flex-row items-center justify-between w-96' tag={Link} to="/food-form" state={{ isEdit: false }}>
                        <span className='font-corbel text-green-700 underline text-2xl'>New food</span>
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

                    {shownFoods && shownFoods.map(food => (

                        <tr className={`mb-2 border-b-2  ${userSettings.isDark && 'border-zinc-500'}`} key={food.id}>
                            <td className='font-corbel text-2xl max-w-28 w-28'>{food.name}</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.calories}</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.carbos} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.proteins} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.fats} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.fibers} g</td>
                            <td className='font-sans text-2xl w-28 px-1'>{food.water} g</td>
                            <td>
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
                                        className='ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                </span>
                            </td>
                        </tr>

                    ))}
                    

                </table>
            </div>
            <div className={`xl:hidden block mt-8 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
                {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={setFoods} />}

                <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3'>FOODS</h2>
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
                        <NavLink  tag={Link} to="/food-form" state={{ isEdit: false }}>
                            <span className='font-corbel text-green-700 underline text-2xl'>New food</span>
                        </NavLink>
                    </li>
                    {shownFoods && shownFoods.map(food => (
                        <li className='mb-2 max-w-[800px] w-80' key={food.id}>
                            <div className='flex flex-row items-center justify-between'>
                                <span className='font-corbel text-2xl'>{food.name}</span>
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
                                            className='ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                                    </span>
                                </span>
                            </div>
                            <ul className='mt-1 grid grid-cols-1 md:grid-cols-2'>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>Kcal: <font className="font-sans">{food.calories}</font></li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>carbohydrates: <font className="font-sans">{food.carbos}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>proteins: <font className="font-sans">{food.proteins}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fats: <font className="font-sans">{food.fats}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fibers: <font className="font-sans">{food.fibers}</font> g</li>
                                <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>water: <font className="font-sans">{food.water}</font> g</li>
                            </ul>
                        </li>
                    ))}
                    
                </ul>
            </div>
        </>
    )
}