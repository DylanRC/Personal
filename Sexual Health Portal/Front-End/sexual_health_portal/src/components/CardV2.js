import React, { useState, useEffect } from 'react';

export default function CardV2(props) {
    const [height, setHeight] = useState(0);

    var cardID = `card${props.id}`;

    const style = {
        height: `${height}px`,
        backgroundImage: `url(\"${props.image}\")`,
    }

    //React hook to adjust height based on width
    useEffect(() => {
        setHeight(document.getElementById(cardID).offsetWidth / (props.ratio));

    });

    //Go to the provided link on click
    function handleClick(e) {
        e.preventDefault();
        window.location = props.link;
    }

    //Set cover height to 100% on hover
    function handleHover() {
        document.getElementById("cardCover_" + cardID).style.height = "100%";
    }


    //Set the cover height to 0% once it is no longer hovered over
    function handleUnHover() {
        document.getElementById("cardCover_" + cardID).style.height = "0%";
    }

    return (
        <div href={props.link} id={cardID} className="card" onClick={handleClick} onMouseLeave={() => { handleUnHover() }
            } onMouseOver={() => { handleHover() }}
        >
            <div id={"cardCover_" + cardID} className="cardCover">
                <p> {props.text} </p>
            </div>
            <div className="cardImage" id={"cardImage_" + cardID} style={style}></div>
            <div className="cardHeader" id={ "cardHeader_" + cardID} >
                {props.title}
            </div>
        </div>
    )
}