import React from 'react';


//Acordian component
export default function accordianV2(props) {
    var open = false;
    var ID = `dropdown${props.id}`; 


    //Set the height of the dropdown content and the colour of the signal on click
    function handleClick(e) {
        e.preventDefault();
        var dropdown = document.getElementById(ID).children[1];

        open = !open;
        if (open) {
            dropdown.style.height = dropdown.scrollHeight+"px";
            document.getElementById(ID).children[0].children[1].style.backgroundColor = "red"
        }

        else {
            dropdown.style.height = "0px";
            document.getElementById(ID).children[0].children[1].style.backgroundColor = "lime"
        }

        
    }

    return (
        <div id={ID} className="accordianV2">
            <div className="accordianHead" onClick={handleClick}>
                <div className="accordianTitle"> 
                    {props.title}
                </div>
                <div className="accordianSignal"></div>
            </div>
            <div className="dropdown_content">
                <p> {props.text} </p>
            </div>
        </div>
    )
}