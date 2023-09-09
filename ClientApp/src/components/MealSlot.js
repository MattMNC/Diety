import React, { useContext, useEffect, useState } from 'react';
import { AddIcon, DeleteIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function MealSlot({ day, type, setShowMealsModal, setShowMealDetailModal, setMeal, setModalMeal, slotMealId, deleteMeal }) {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //STATE
    //Data of the meal assigned to the slot, if empty an empty slot will be rendered, if populated a slot with assigned meal will be rendered
    const [slotMeal, setSlotMeal] = useState();
    //

    //If a meal id is passed in the slot as prop fetch meal and popolate slotMeal(state) with the result, else set slotMeal to empty
    useEffect(() => {
        if (slotMealId != undefined) {
            fetch('meal/' + slotMealId,
                {
                    headers: {
                        'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                    }
                })
                .then(response => { return response.json(); })
                .then(data => {
                    setSlotMeal(data);

                }).catch(error => { return undefined })
        }
        else {
            setSlotMeal();
        }
    }, [slotMealId])

    //On click of the add button rendered in empty slot
    //set Meal (state variable in RoutineForm component) type and day as the slot's type and day and open the radio button list meals modal
    function onAddClick() {
        setMeal(prevMeal => ({
            ...prevMeal,
            type: type,
            day: day
        }))
        setShowMealsModal(true)
    }

    //On click of the meal name rendered in populated slot set modalMeal (RoutineForm state variable that will be passed as prop to MealDetailModal)
    //and set showMealDetailModal to true (RoutineForm state variable that determines if meal detail modal is shown or hidden)
    function onMealClick() {
        setModalMeal(slotMeal)
        setShowMealDetailModal(true)
    }

    return (
        <>
            {slotMeal == null || slotMeal == undefined ?
                //Empty meal slot
                <div className={`flex flex-col items-center justify-center my-1 border-[1px] h-24 ${userSettings.isDark ? 'border-zinc-400 text-zinc-200' : 'border-black'}`} >
                    <button className={`flex items-center justify-center font-corbel font-bold text-1xl mt-3 py-4 self-center  border border-green-700 rounded-[50%] h-12 w-12 hover:bg-green-700 hover:text-white hover:duration-200 ${userSettings.isDark ? ' bg-green-900 text-zinc-200' : 'bg-white text-green-700'}`} type="button" onClick={onAddClick}><AddIcon /></button>
                    <span>{type}</span>
                </div>
                :     //Meal slot containing a meal
                <div className={`flex flex-col items-center justify-center my-1 border-[1px] h-24 ${userSettings.isDark ? 'border-zinc-400 text-zinc-200' : 'border-black'}`}  >
                    <span onClick={onMealClick}>{slotMeal.name}</span>
                    <DeleteIcon className=' mt-2 cursor-pointer w-[25px] h-[25px] hover:text-green-700 hover:duration-200' onClick={() => deleteMeal(slotMeal.id, day, type)} />
                </div>
            }
        </>
    );
}