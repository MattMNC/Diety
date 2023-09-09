import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SaveModal from './SaveModal';
import { useNavigate } from 'react-router-dom';
import { UserSettingsContext } from '../App';

export default function FoodForm() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    const location = useLocation(); //Location to read the state passed to the component by NavLink('routing prop')

    const navigate = useNavigate(); //Assign to navigate a function that takes as parameter a route to navigate to

    //-----------------------------STATE---------------------------------
    //food form state
    const [foodData, setFoodData] = useState({
        name: "",
        notes: "",
        calories: 0,
        carbos: 0,
        proteins: 0,
        fats: 0,
        fibers: 0,
        water: 0
    });

    //Modal state
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState({ //passed by props to the modal, defines the type of message and the message text itself
        type: null, //"error" or "warning" or null
        text: ""
    })
    //-------------------------------------------------------------------

    //On component load: if the form is on edit mode fetch the food and load it into state
    useEffect(() => {
        if (location?.state?.isEdit == true) {
            fetch('food/' + location.state.foodId,
                {
                    headers: {
                        'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                    }
                })
                .then(response => { return response.json(); })
                .then(data => {
                    setFoodData(data);
                }).catch(error => { return undefined })
        }
    }, [])

    //---------------------------------------------FUNCTIONS---------------------------------------------------------------
    function handleChange(e) {
        const { name, value } = e.target;
        setFoodData(prevFoodData => ({
            ...prevFoodData,
            [name]: value
        }));
    }

    //On submit check possible errors or warnings and set the modal state before showing the modal
    function handleSubmit(e) {
        e.preventDefault();
        if (foodData.name == null || foodData.name == undefined || foodData.name == "") {
            setModalMessage({
                type: "error",
                text: "A food must have a name."
            })
        }
        //----------------------------------------------------------------------------------------------------------------
        //MAX CHARACTER ERRORS ARE BUILT-IN IN THE INPUTS, THESE ARE THE CONDITIONS TO CHECK NAME AND NOTES LENGTH
        /*else if (foodData.name.length > 30) {
            setModalMessage({
                type: "error",
                text: "food name must be less than 30 characters"
            })
        }
        else if (foodData.name.length > 500) {
            setModalMessage({
                type: "error",
                text: "food notes must be shorter than 500 characters"
            })
        }
        else if(parseFloat(foodData.carbos) > 100 || parseFloat(foodData.proteins) > 100 || parseFloat(foodData.fats) > 100 || parseFloat(foodData.fibers) > 100 || parseFloat(foodData.water) > 100) {
            setModalMessage({
                type: "error",
                text: "Each nutritional value must be smaller or equal to 100"
            })
        }
        else if(parseFloat(foodData.calories > 100000)) {
            setModalMessage({
                type: "error",
                text: "An food can't have more than 100000 Kcal"
            })
        }*/
        else {
            if (foodData.calories == null || foodData.calories == undefined || foodData.calories == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, calories: 0 }))
            if (foodData.carbos == null || foodData.carbos == undefined || foodData.carbos == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, carbos: 0 }))
            if (foodData.proteins == null || foodData.proteins == undefined || foodData.proteins == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, proteins: 0 }))
            if (foodData.fats == null || foodData.fats == undefined || foodData.fats == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, fats: 0 }))
            if (foodData.fibers == null || foodData.fibers == undefined || foodData.fibers == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, fibers: 0 }))
            if (foodData.water == null || foodData.water == undefined || foodData.water == "")
                setFoodData(prevFoodData => ({ ...prevFoodData, water: 0 }))
            if (foodData.carbos == 0 && foodData.proteins == 0 && foodData.fats == 0 && foodData.fibers == 0 && foodData.water == 0)
                setModalMessage({
                    type: "warning",
                    text: "All nutritional values are set to 0"
                })
            else if ((parseFloat(foodData.carbos) + parseFloat(foodData.proteins) + parseFloat(foodData.fats) + parseFloat(foodData.fibers) + parseFloat(foodData.water)) > 100)
                setModalMessage({
                    type: "warning",
                    text: "The sum of all nutritional values is greater than 100"
                })
        }
        setShowSaveModal(true)
    }

    //Passed to the modal as prop, if form is not on edit make a POST food request to foods, else make a PUT request to foods
    function save() {
        if (location.state.isEdit != true) {
            fetch('food', {
                method: 'POST',
                body: JSON.stringify({
                    name: foodData.name,
                    notes: foodData.notes,
                    calories: parseFloat(foodData.calories),
                    carbos: parseFloat(foodData.carbos),
                    proteins: parseFloat(foodData.proteins),
                    fats: parseFloat(foodData.fats),
                    fibers: parseFloat(foodData.fibers),
                    water: parseFloat(foodData.water)
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if (data.value.result == "Success") {
                        if(userSettings.advancedView == false)
                            navigate("/foods-and-meals");
                        else
                            navigate("/foods-view");
                    }
                    else if (data.value.result == "Error") {
                        setModalMessage({
                            type: "error",
                            text: data.value.message
                        });
                        setShowSaveModal(true);
                    }
                });
        }
        else {
            fetch('food/' + location.state.foodId, {
                method: 'PUT',
                body: JSON.stringify({
                    name: foodData.name,
                    notes: foodData.notes,
                    calories: parseFloat(foodData.calories),
                    carbos: parseFloat(foodData.carbos),
                    proteins: parseFloat(foodData.proteins),
                    fats: parseFloat(foodData.fats),
                    fibers: parseFloat(foodData.fibers),
                    water: parseFloat(foodData.water)
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if (data.value.result == "Success") {
                        if(userSettings.advancedView == false)
                            navigate("/foods-and-meals");
                        else
                            navigate("/foods-view");
                    }
                    else if (data.value.result == "Error") {
                        setModalMessage({
                            type: "error",
                            text: data.value.message
                        })
                        setShowSaveModal(true)
                    }
                });
        }
    }

    function resetModalMessage() {
        setModalMessage({
            type: null,
            text: ""
        })
    }
    //-----------------------------------------------------------------------------------------------------------------------

    return (
        <>
            {showSaveModal && <SaveModal type="food" setShowModal={setShowSaveModal} save={save} message={modalMessage} resetMessage={resetModalMessage} />}
            <form className={`md:text-xl font-corbel text-lg mt-8 h-auto flex flex-col align-center justify-center sm:shadow-2xl rounded-xl sm:w-[600px] w-full ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} onSubmit={handleSubmit}>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="name">Name</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Name'
                        maxLength="50"
                        autoComplete="off"
                        value={foodData.name}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="notes">Notes</label>
                    <textarea
                        className={`h-40 resize-none mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="notes"
                        id="notes"
                        placeholder='Notes'
                        maxLength="500"
                        autoComplete="off"
                        value={foodData.notes}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="calories">Calories</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="calories"
                        id="calories"
                        placeholder='Calories'
                        max="100000"
                        autoComplete="off"
                        value={foodData.calories}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="carbos">Carbohydrates</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="carbos"
                        id="carbos"
                        placeholder='Carbos'
                        max="100"
                        autoComplete="off"
                        value={foodData.carbos}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="proteins">Proteins</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="proteins"
                        id="proteins"
                        placeholder='Proteins'
                        max="100"
                        autoComplete="off"
                        value={foodData.proteins}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="fats">Fats</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="fats"
                        id="fats"
                        placeholder='Fats'
                        max="100"
                        autoComplete="off"
                        value={foodData.fats}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="fibers">Fibers</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="fibers"
                        id="fibers"
                        placeholder='Fibers'
                        max="100"
                        autoComplete="off"
                        value={foodData.fibers}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="water">Water</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="number"
                        name="water"
                        id="water"
                        placeholder='Water'
                        max="100"
                        autoComplete="off"
                        value={foodData.water}
                        onChange={handleChange} />
                </div>

                <button className='font-corbel text-2xl mt-6 mb-4 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500' type="submit">{location.state.isEdit != true ? <>Create</> : <>Save</>}</button>
            </form>
        </>
    )
}