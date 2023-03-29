/**
 * A button component for fetching a single Hawker Store by ID from a REST API.
 * @param {string} centreID - The ID of the Hawker Centre to which the store belongs.
 * @param {string} title - The text to display on the button.
 * @param {string} variant - The variant of the button (e.g. 'contained', 'outlined').
 * @returns {JSX.Element} - A Material-UI Button component.
 */
import {Button} from "@mui/material";
import React, {useContext} from "react";
import { HawkerContext } from "../context/HawkerContext";

export default function ButtonHawkerStore({centreID, title, variant}) {
    const {setOneHawkerStore} = useContext(HawkerContext);

    /**
     * Handles a click on the button by fetching a single Hawker Store by ID from a REST API
     * and updating the HawkerContext state with the response data.
     * @returns {Promise<void>}
     */
    const handleClick = async () => {
        const response = await fetch('http://localhost:4000/api/stall/' + centreID, {
          headers: { 
            'Access-Control-Allow-Origin': "http://localhost:4000"
        },
        credentials: "include"
        });
        const json = await response.json();
        console.log("buttonStore: ");
        console.log(json);
        setOneHawkerStore(json);
    };

    return (
        <Button variant={variant} onClick={handleClick}>{title}</Button>
    );
}