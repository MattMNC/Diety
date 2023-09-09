import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import RemoveModal from './RemoveModal';
import { EditIcon, DeleteIcon } from '@fluentui/react-icons-mdl2';
import { UserSettingsContext } from '../App';

export default function Routines() {
    const [userSettings, setUserSettings] = useContext(UserSettingsContext); //Context

    //------------------------------------------STATE---------------------------------------------
    const [routines, setRoutines] = useState([]);

    //Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [modalSettings, setModalSettings] = useState({ //passed by props to the modal, defines the type of entity(food, meal or routine) 
        type: "routine",                                 //and the id of the record to delete
        id: 0
    });
    //---------------------------------------------------------------------------------------------

    //On component load: fetch the routines and load them into state array
    useEffect(() => {
        fetch('routine',
            {
                headers: {
                    'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("jwtToken"))
                }
            }
        )
            .then(response => { return response.json(); })
            .then(data => {
                setRoutines(data);
            });
    }, []);

    return (
        <div className={`mt-8 ${userSettings.isDark ? 'text-zinc-200' : 'text-black'}`}>
            {showDeleteModal && <RemoveModal type={modalSettings.type} id={modalSettings.id} setShowModal={setShowDeleteModal} setList={setRoutines} />}
            <h2 className='font-corbel font-bold text-4xl text-green-700 mb-3'>ROUTINES</h2>
            <ul>
                {routines && routines.map(routine => (
                    <li className='mb-2 flex flex-row items-center justify-between border-b-2 w-80' key={routine.id}>
                        <span className='font-corbel  text-2xl'>{routine.name}</span>
                        <span>
                            <NavLink tag={Link} to="/routine-form" state={{ isEdit: true, routine: routine }}>
                                <EditIcon className={`ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200 ${userSettings.isDark ? 'text-white' : 'text-black'}`} />
                            </NavLink>
                            <span>
                                <DeleteIcon
                                    onClick={() => {
                                        setModalSettings({
                                            type: "routine",
                                            id: routine.id
                                        })
                                        setShowDeleteModal(true)
                                    }}
                                    className=' ml-2 cursor-pointer w-[20px] h-[20px] hover:w-[22px] hover:h-[22px] hover:text-green-700 duration-200' />
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
            <li className='mb-2 flex flex-row items-center justify-between w-80'>
                <NavLink tag={Link} to="/routine-form" state={{ isEdit: false }}>
                    <span className='font-corbel text-green-700 underline text-2xl'>New routine</span>
                </NavLink>
            </li>
        </div>
    )
}