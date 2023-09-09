import React, { useContext, useEffect, useState } from 'react';
import MealSlot from './MealSlot';
import MealsModal from './MealsModal';
import MealDetailModal from './MealDetailModal';
import SaveModal from './SaveModal';
import { useLocation, useNavigate } from 'react-router-dom'
import { AddIcon, RemoveIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';


export default function RoutineForm() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    const location = useLocation() //Location to read the state passed to the component by NavLink('routing prop')

    const navigate = useNavigate(); //Assign to navigate a function that takes as parameter a route to navigate to

    //------------------------------------------------STATE----------------------------------------------------------
    //Routine form state
    const [routine, setRoutine] = useState({
        name: "",
        notes: "",
        meals: []
    });

    //Used as temp variable to store meal data before pushing in routine->meals array (state)
    //Details: on click of the slot add button type and day are set to the slot ones, then the mealsModal opens and
    //on select of the meal mealId is set
    const [meal, setMeal] = useState({
        mealId: "",
        type: "",
        day: ""
    })

    //Meals array, populated by fetch (on load useEffect)
    const [meals, setMeals] = useState([]);

    //The data on which is based the rendering structure of the routine grid (for each day there are 7 types)
    const [mealSlots2, setMealSlots2] = useState([
        {
            day: "1",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "2",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "3",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "4",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "5",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "6",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
        {
            day: "7",
            types: ["Snack1", "Breakfast", "Snack2", "Lunch", "Snack3", "Dinner", "Snack4"]
        },
    ]);

    //Day visibility state: on mobile screen every day slot group can be expanded or hidden, this is the state to keep track
    //of what day is visible or hidden
    const [showMonday, setShowMonday] = useState(true);
    const [showTuesday, setShowTuesday] = useState(true);
    const [showWednesday, setShowWednesday] = useState(true);
    const [showThursday, setShowThursday] = useState(true);
    const [showFriday, setShowFriday] = useState(true);
    const [showSaturday, setShowSaturday] = useState(true);
    const [showSunday, setShowSunday] = useState(true);
    //

    //Modal state
    const [modalMeal, setModalMeal] = useState(); //Set on slot meal click and passed as prop to the meal detail modal

    const [showMealsModal, setShowMealsModal] = useState(false);
    const [showMealDetailModal, setShowMealDetailModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState({ //passed by props to the modal, defines the type of message and the message text itself
        type: null, // "error" or "warning" or null
        text: ""
    })
    //---------------------------------------------------------------------------------------------------------------

    //On component load: fetch meals and load them in state array, if the form is in edit mode load Routine data into the form data state array
    useEffect(() => {
        fetch('meal',
            {
                headers: {
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            }
        )
            .then(response => { return response.json(); })
            .then(data => {
                setMeals(data);
            });
        if (location.state.isEdit == true && location.state.routine != null && location.state.routine != undefined) {
            setRoutine({
                name: location.state.routine.name,
                notes: location.state.routine.notes,
                meals: location.state.routine.meals
            })
        }
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setRoutine(prevRoutine => ({
            ...prevRoutine,
            [name]: value
        }));
    }

    //On submit check possible errors or warnings and set the modal state before showing the modal
    function handleSubmit(e) {
        e.preventDefault();
        if (routine.name == null || routine.name == undefined || routine.name == "") {
            setModalMessage({
                type: "error",
                text: "A routine must have a name."
            })
        }
        else if (routine.meals.length < 1) {
            setModalMessage({
                type: "warning",
                text: "Your routine has no meals"
            })
        }
        setShowSaveModal(true)
    }

    //Passed to the modal as prop, if form is not on edit make a POST routine request to routines, else make a PUT request to routines
    function save() {
        if (location.state.isEdit != true) {
            fetch('routine', {
                method: 'POST',
                body: JSON.stringify(routine),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if (data.value.result == "Success") {
                        navigate("/meal-routines")
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
        else {
            fetch('routine/' + location.state.routine.id, {
                method: 'PUT',
                body: JSON.stringify(routine),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            })
                .then(response => { return response.json(); })
                .then(data => {
                    if (data.value.result == "Success") {
                        navigate("/meal-routines")
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

    //Add a meal to a slot - push meal(state) into routine form data -> meals
    function addMeal() {
        const newMeals = [...routine.meals]
        newMeals.push(meal)
        setRoutine(prevRoutine => ({ ...prevRoutine, meals: [...newMeals] }))
        setMeal({
            mealId: "",
            type: "",
            day: ""
        })
    }

    //Delete a Meal from a slot
    function deleteMeal(id, day, type) {
        var newMeals = [...routine.meals]
        newMeals = newMeals.filter(meal => meal.mealId != id || meal.day != day || meal.type != type)
        setRoutine(prevRoutine => ({ ...prevRoutine, meals: [...newMeals] }))
    }

    //Called for every meal slot, returns the eventual meal id of the selected meal for the slot
    function getSlotMealId(type, day) {
        return routine.meals.filter(meal => meal.type == type && meal.day == day)[0]?.mealId
    }

    function resetModalMessage() {
        setModalMessage({
            type: null,
            text: ""
        })
    }

    //This function calculates the nutritional values, differently from the SetNV() function in mealForm here nutritional values instead of being entity fields
    //are values that just need to be displayed, despite the calculation logic being almost the same the function is called getNV() and there is no setState, only values being calculated and returned
    function getNV(day, nutrient) {
        var dayMeals = routine.meals.filter(m => m.day == day)
        var mealNV = 0;
        var dayNV = 0;

        if (nutrient == "carbos") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.carbos || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }
        else if (nutrient == "proteins") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.proteins || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }
        else if (nutrient == "fats") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.fats || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }
        else if (nutrient == "fibers") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.fibers || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }
        else if (nutrient == "water") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.water || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }
        else if (nutrient == "calories") {
            dayMeals.forEach(m => {
                mealNV = meals.find(me => me.id == m.mealId)?.calories || 0
                if (mealNV == 0) {
                    return false;
                }
                dayNV += mealNV;
            })
        }

        if (nutrient == "calories")
            return dayNV.toFixed(0)
        else
            return dayNV.toFixed(1)
    }

    return (
        <>
            {showSaveModal && <SaveModal type="routine" setShowModal={setShowSaveModal} save={save} message={modalMessage} resetMessage={resetModalMessage} />}
            {showMealsModal && <MealsModal setShowModal={setShowMealsModal} meals={meals} setMeal={setMeal} addMeal={addMeal} meal={meal} />}
            {showMealDetailModal && <MealDetailModal setShowModal={setShowMealDetailModal} mealDetail={modalMeal} setMeal={setMeal} addMeal={addMeal} />}
            <form className={`mt-8 md:text-xl text-lg flex flex-col ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`} onSubmit={handleSubmit}>
                <div className='flex flex-col '>
                    <label className='font-corbel font-bold text-3xl mr-6 mb-1' htmlFor="name">Name</label>
                    <input
                        className={`font-sans shadow appearance-none border rounded h-9 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white border-zinc-500 bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Name'
                        autoComplete="off"
                        value={routine.name}
                        onChange={handleChange} />
                </div>
                <div className='flex flex-col  mt-4'>
                    <label className='font-corbel font-bold text-3xl mr-6 mb-1' htmlFor="notes">Notes</label>
                    <textarea
                        className={`h-40 resize-none font-sans shadow appearance-none border rounded  px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${userSettings.isDark ? 'text-white border-zinc-500 bg-zinc-700 placeholder-neutral-300' : 'text-black'}`}
                        type="text"
                        name="notes"
                        id="notes"
                        placeholder='Notes'
                        maxLength="500"
                        autoComplete="off"
                        value={routine.notes}
                        onChange={handleChange} />
                </div>
                <div className='flex 2xl:flex-row flex-col mt-4 '>
                    <div className='flex flex-col'>
                    </div>
                    {mealSlots2.map(slot => (
                        <div className='flex flex-col mx-1 flex-1 2xl:w-52 w-96 2xl:mt-auto mt-6'>
                            {
                                <div className='flex font-corbel font-bold text-3xl self-center'>
                                    <h2>
                                        {
                                            slot.day == "1" ? <>Monday</> :
                                                slot.day == "2" ? <>Tuesday</> :
                                                    slot.day == "3" ? <>Wednesday</> :
                                                        slot.day == "4" ? <>Thursday</> :
                                                            slot.day == "5" ? <>Friday</> :
                                                                slot.day == "6" ? <>Saturday</> :
                                                                    <>Sunday</>
                                        }
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={
                                            slot.day == "1" ? () => setShowMonday(prevShowMonday => !prevShowMonday) :
                                                slot.day == "2" ? () => setShowTuesday(prevShowTuesday => !prevShowTuesday) :
                                                    slot.day == "3" ? () => setShowWednesday(prevShowWednesday => !prevShowWednesday) :
                                                        slot.day == "4" ? () => setShowThursday(prevShowThursday => !prevShowThursday) :
                                                            slot.day == "5" ? () => setShowFriday(prevShowFriday => !prevShowFriday) :
                                                                slot.day == "6" ? () => setShowSaturday(prevShowSaturday => !prevShowSaturday) :
                                                                    () => setShowSunday(prevShowSunday => !prevShowSunday)
                                        }
                                        className="text-green-700 ml-2 text-base 2xl:hidden">
                                        {
                                            slot.day == "1" && showMonday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                slot.day == "2" && showTuesday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                    slot.day == "3" && showWednesday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                        slot.day == "4" && showThursday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                            slot.day == "5" && showFriday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                                slot.day == "6" && showSaturday == true ? <RemoveIcon /> : <AddIcon /> &&
                                                                    slot.day == "7" && showSunday == true ? <RemoveIcon /> : <AddIcon />
                                        }

                                    </button>
                                </div>
                            }
                            <div className={`transition-[max-height] max-h-[1000px] 2xl:max-h-full duration-200 2xl:visible ${slot.day == "1" && showMonday == false ? 'max-h-0 invisible' :
                                    slot.day == "2" && showTuesday == false ? 'max-h-0 invisible' :
                                        slot.day == "3" && showWednesday == false ? 'max-h-0 invisible' :
                                            slot.day == "4" && showThursday == false ? 'max-h-0 invisible' :
                                                slot.day == "5" && showFriday == false ? 'max-h-0 invisible' :
                                                    slot.day == "6" && showSaturday == false ? 'max-h-0 invisible' :
                                                        slot.day == "7" && showSunday == false ? 'max-h-0 invisible' : 'block'
                                } `}>
                                {slot.types.map((type, idx) => {
                                    var slotMealId = getSlotMealId(type, slot.day)
                                    return <MealSlot key={idx} day={slot.day} type={type} setShowMealsModal={setShowMealsModal} setShowMealDetailModal={setShowMealDetailModal} setMeal={setMeal} setModalMeal={setModalMeal} slotMealId={slotMealId} deleteMeal={deleteMeal} />
                                })}
                                <ul className='mt-1 grid grid-cols-2 md:grid-cols-1'>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>Kcal: <font className="font-sans">{getNV(slot.day, "calories")}</font></li>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>carbohydrates: <font className="font-sans">{getNV(slot.day, "carbos")}</font> g</li>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>proteins: <font className="font-sans">{getNV(slot.day, "proteins")}</font> g</li>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fats: <font className="font-sans">{getNV(slot.day, "fats")}</font> g</li>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>fibers: <font className="font-sans">{getNV(slot.day, "fibers")}</font> g</li>
                                    <li className={`border md-text-xl text-base px-2 ${userSettings.isDark && 'border-zinc-500'}`}>water: <font className="font-sans">{getNV(slot.day, "water")}</font> g</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <button className='font-corbel text-2xl mt-6 self-center bg-green-700 text-white py-2 px-2 rounded w-28 hover:bg-green-600 duration-500' type="submit">{location.state.isEdit != true ? <>Create</> : <>Save</>}</button>
            </form>
        </>
    )
}