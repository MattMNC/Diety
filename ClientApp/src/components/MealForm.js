import React, { useState, useEffect, useContext } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useLocation } from 'react-router-dom';
import SaveModal from './SaveModal';
import { DeleteIcon, AddIcon } from '@fluentui/react-icons-mdl2';
import { useNavigate } from 'react-router-dom';
import { UserSettingsContext } from '../App';

export default function MealForm() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    const location = useLocation(); //Location to read the state passed to the component by NavLink('routing prop')

    const navigate = useNavigate(); //Assign to navigate a function that takes as parameter a route to navigate to

    //-----------------------------STATE-----------------------------------------------------------------
    //Foods array, populated by fetch, used as base for foodsOptions
    const [foods, setFoods] = useState([])

    //Foods Options array, contains the foods but in a 'value - label' format which is usable as input dropdown options parameter
    const [foodsOptions, setFoodsOptions] = useState([]);

    //Meal form data
    const [mealData, setMealData] = useState({
        name: "",
        notes: "",
        foods: [{ foodId: 0, quantity: 0 }],
        calories: 0,
        carbos: 0,
        proteins: 0,
        fats: 0,
        fibers: 0,
        water: 0,
    })

    //Modal state
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState({ //passed by props to the modal, defines the type of message and the message text itself
        type: null, // "error" or "warning" or null
        text: ""
    })
    //---------------------------------------------------------------------------------------------------

    //On component load: if the foods are passed by location (from FoodsAndMeals to MealForm) use them to set the 2 state arrays
    //else fetch request to food.
    useEffect(() => {
        if (location.state.foods != undefined) {
            location.state.foods.map(food => {
                setFoodsOptions(prevFoodsOptions => ([...prevFoodsOptions, {
                    value: food.id,
                    label: food.name
                }]))
            });
            setFoods(location.state.foods);
        }
        else {
            fetch('food',
                {
                    headers: {
                        'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                    }
                })
                .then(response => { return response.json(); })
                .then(data => {
                    data.map(food => {
                        setFoodsOptions(prevFoodsOptions => ([...prevFoodsOptions, {
                            value: food.id,
                            label: food.name
                        }]))
                    });
                    setFoods(data);
                });
        }
        //If the form is in edit mode fetch meal and foods by meal and set meal form data with the results
        if (location.state.isEdit == true) {
            fetch('meal/' + location.state.mealId,
                {
                    headers: {
                        'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                    }
                })
                .then(response => { return response.json(); })
                .then(data => {
                    setMealData(prevMealData => ({
                        ...prevMealData,
                        name: data.name,
                        notes: data.notes,
                        calories: data.calories,
                        carbos: data.carbos,
                        proteins: data.proteins,
                        fats: data.fats,
                        fibers: data.fibers,
                        water: data.water
                    }));
                })
                .catch(error => { return undefined })

            fetch('food/meal/' + location.state.mealId,
                {
                    headers: {
                        'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                    }
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    setMealData(prevMealData => ({ ...prevMealData, foods: data }))

                }).catch(error => { return undefined })
        }
    }, [])

    function handleFoodIdChange(e, index) {
        const { value } = e;
        const newFoods = [...mealData.foods];
        newFoods[index].foodId = value;
        setMealData(prevMealData => ({ ...prevMealData, foods: newFoods }));
        setNV()
    }

    function handleFoodQuantityChange(e, index) {
        const { value } = e.target;
        const newFoods = [...mealData.foods];
        newFoods[index].quantity = value;
        setMealData(prevMealData => ({ ...prevMealData, foods: newFoods }));
        setNV()
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setMealData(prevMealData => ({
            ...prevMealData,
            [name]: value
        }));
    }

    //On submit check possible errors or warnings and set the modal state before showing the modal
    function handleSubmit(e) {
        e.preventDefault();
        if (mealData.name == null || mealData.name == undefined || mealData.name == "") {
            setModalMessage({
                type: "error",
                text: "A meal must have a name."
            })
        }
        // MAX CHARACTER ERRORS ARE BUILT IN THE INPUTS, THESE ARE THE CONDITIONS TO CHECK NAME AND NOTES LENGTH
        // else if (mealData.name.length > 30) {
        //     setModalMessage({
        //         type: "error",
        //         text: "Meal name must be less than 30 characters"
        //     })
        // }
        // else if (mealData.notes.length > 500) {
        //     setModalMessage({
        //         type: "error",
        //         text: "Meal notes must be shorter than 500 characters"
        //     })
        // }
        else {
            mealData.foods.forEach(a => {
                if (a.foodId == 0 || a.foodId == null || a.foodId == undefined || a.foodId == "") {
                    setModalMessage({
                        type: "error",
                        text: "One or more empty food selection"
                    })
                    setShowSaveModal(true)
                    return
                }
                if (a.quantity == 0 || a.quantity == null || a.quantity == undefined || a.quantity == "") {
                    setModalMessage({
                        type: "error",
                        text: "Each food must have a quantity greater than 0"
                    })
                    setShowSaveModal(true)
                    return
                }
            })
            if (mealData.foods.length < 1) {
                setModalMessage({
                    type: "warning",
                    text: "Your meal has no foods"
                })
            }
        }
        setShowSaveModal(true)
    }

    //Passed to the modal as prop, if form is not on edit make a POST meal request to meals, else make a PUT request to meals
    function save() {
        if (location.state.isEdit != true) {
            fetch('meal', {
                method: 'POST',
                body: JSON.stringify(mealData),
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
                            navigate("/meals-view");
                    }
                    else if (data.value.result == "Error") {
                        setModalMessage({
                            type: "error",
                            text: data.value.message
                        })
                        setShowSaveModal(true)
                    }
                })
        }
        else {
            fetch('meal/' + location.state.mealId, {
                method: 'PUT',
                body: JSON.stringify(mealData),
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
                            navigate("/meals-view");
                    }
                    else if (data.value.result == "Error") {
                        setModalMessage({
                            type: "error",
                            text: data.value.message
                        })
                        setShowSaveModal(true)
                    }
                })
        }
    }

    //--------------------------------------------------FUNCTIONS---------------------------------------------------------------------------------------------------
    function handleAddFood(e) {
        e.preventDefault();
        setMealData(prevMealData => ({ ...prevMealData, foods: [...prevMealData.foods, { foodId: 0, quantity: 0 }] }));
    }

    //This function excludes already selected foods from FoodsOptions and returns them into the variable used as input dropdown options parameter
    function filterOptions() {
        var filteredOptions = []
        if (mealData.foods != undefined) {
            filteredOptions = foodsOptions.filter(ao => {
                var optionId = ao.value;
                var found = mealData.foods.find(a => a.foodId == optionId)
                if (found == undefined) {
                    return true
                }
            })
        }
        return filteredOptions;
    }

    function deleteFood(e, index) {
        e.preventDefault();
        const newFoods = [...mealData.foods];
        newFoods.splice(index, 1);
        setMealData(prevMealData => ({ ...prevMealData, foods: newFoods }));
    }

    function resetModalMessage() {
        setModalMessage({
            type: null,
            text: ""
        })
    }

    //This function sets the nutritional values of the meal
    function setNV() {
        var totalCarbos = 0;
        var totalProteins = 0;
        var totalFats = 0;
        var totalFibers = 0;
        var totalWater = 0;
        var totalCalories = 0;
        var foodNV;

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.carbos || 0
            if (foodNV == 0) {
                return false;
            }
            totalCarbos += (foodNV / 100 * a.quantity)
        })

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.proteins || 0
            if (foodNV == 0) {
                return false;
            }
            totalProteins += (foodNV / 100 * a.quantity)
        })

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.fats || 0
            if (foodNV == 0) {
                return false;
            }
            totalFats += (foodNV / 100 * a.quantity)
        })

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.fibers || 0
            if (foodNV == 0) {
                return false;
            }
            totalFibers += (foodNV / 100 * a.quantity)
        })

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.water || 0
            if (foodNV == 0) {
                return false;
            }
            totalWater += (foodNV / 100 * a.quantity)
        })

        mealData.foods.forEach(a => {
            foodNV = foods.find(al => al.id == a.foodId)?.calories || 0
            if (foodNV == 0) {
                return false;
            }
            totalCalories += (foodNV / 100 * a.quantity)
        })

        setMealData(prevMealData => ({
            ...prevMealData,
            carbos: totalCarbos.toFixed(1),
            proteins: totalProteins.toFixed(1),
            fats: totalFats.toFixed(1),
            fibers: totalFibers.toFixed(1),
            water: totalWater.toFixed(1),
            calories: totalCalories.toFixed(0)
        }));
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <>
            {showSaveModal && <SaveModal type="meal" setShowModal={setShowSaveModal} save={save} message={modalMessage} resetMessage={resetModalMessage} />}
            <form className={`md:text-xl font-corbel text-lg mt-8 min-h-[750px] h-auto flex flex-col align-center sm:shadow-2xl rounded-xl sm:w-[600px] w-full ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} onSubmit={handleSubmit}>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="name">Name</label>
                    <input
                        className={`mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Name'
                        maxLength="50"
                        value={mealData.name}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold' htmlFor="notes">Notes</label>
                    <textarea
                        className={`resize-none h-40 mt-1 font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="notes"
                        id="notes"
                        placeholder='Notes'
                        maxLength="500"
                        value={mealData.notes}
                        onChange={handleChange} />
                </div>
                <div className='mx-4 mt-4'>
                    <label className='font-bold'>Meal nutritional values</label>
                    <ul className='mt-1 grid grid-cols-2 md:grid-cols-3'>
                        <li className='border md-text-xl text-base px-2'>Kcal: <font className="font-sans">{mealData.calories}</font></li>
                        <li className='border md-text-xl text-base px-2'>carbohydrates: <font className="font-sans">{mealData.carbos}</font> g</li>
                        <li className='border md-text-xl text-base px-2'>proteins: <font className="font-sans">{mealData.proteins}</font> g</li>
                        <li className='border md-text-xl text-base px-2'>fats: <font className="font-sans">{mealData.fats}</font> g</li>
                        <li className='border md-text-xl text-base px-2'>fibers: <font className="font-sans">{mealData.fibers}</font> g</li>
                        <li className='border md-text-xl text-base px-2'>water: <font className="font-sans">{mealData.water}</font> g</li>
                    </ul>
                </div>
                <h2 className='font-bold mx-4 mt-4'>Foods</h2>
                {
                    mealData.foods.map((food, index) => {
                        var filteredOptions = filterOptions()
                        return (
                            <div className='mx-4 mb-4 flex items-end border-b-2 pb-2' key={index}>
                                <Dropdown className={`w-full ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`} options={filteredOptions} onChange={(e) => handleFoodIdChange(e, index)} value={foodsOptions.filter(ao => ao.value == food.foodId)[0]} placeholder="Select an option" />
                                <div className='flex flex-col ml-6'>
                                    <label className='font-bold' htmlFor={"quantity" + index}>Quantity</label>
                                    <div>
                                        <input
                                            className={`mt-1 h-[45px] w-[44%] font-sans shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                                            type="number"
                                            name={"Quantity" + index}
                                            id={"quantity" + index}
                                            placeholder='Quantity'
                                            value={mealData.foods[index].quantity}
                                            onChange={(e) => handleFoodQuantityChange(e, index)}
                                            max="999"
                                        />
                                        <span className='ml-2'>g</span>
                                    </div>
                                </div>
                                <DeleteIcon className=' mr-2 cursor-pointer w-[25px] h-[25px] hover:w-[28px] hover:h-[28px] hover:text-green-700 duration-200' onClick={(e) => deleteFood(e, index)} />
                            </div>
                        )
                    })
                }
                {mealData.foods.length < 15 && <button className={`flex items-center justify-center font-corbel font-bold text-1xl mt-3 py-4 self-center  border border-green-700 rounded-[50%] h-12 w-12 hover:bg-green-700 hover:text-white duration-500 ${userSettings.isDark ? ' bg-green-900 text-white' : 'bg-white text-green-700'}`} type="button" onClick={handleAddFood}><AddIcon /></button>}
                <button className='font-corbel text-2xl mt-6 mb-4 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500' type="submit">{location.state.isEdit != true ? <>Create</> : <>Save</>}</button>
            </form>
        </>
    )
}