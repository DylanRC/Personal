import React, { useEffect } from 'react';

var current_div;

//ToggleSwitch component
export default function ToggleSwitch(props) {

    current_div = props.items[0][1];


    //React hook which sets the default radio button to checked
    useEffect(() => {
        document.getElementById("radio-1").checked = true;
    }, []);

    return (
        <div class="toggle-switch-parent">
            <ul class="toggle-switch">
                <li class="au-btn">
                    <input type="radio" onClick={() => { change_div(props.items[0][1]) }} id="radio-1" class="au-btn" name="toggle-switch"/>
                    <label for="radio-1">{props.items[0][0]}</label>
                </li>
                <li class="au-btn">
                    <input type="radio" onClick={() => { change_div(props.items[1][1]) }} id="radio-2" class="au-btn" name="toggle-switch"/>
                    <label for="radio-2">{props.items[1][0]}</label>
                </li>
            </ul>
        </div>
    )
}


//Function used to change the currently visible div
function change_div(div_id) {

    // Change the content
    document.getElementById(current_div).style.display = "none";
    document.getElementById(div_id).style.display = "block";

    // Update the current div
    current_div = div_id;

}