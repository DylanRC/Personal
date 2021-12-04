import React, { useEffect } from 'react';

//TitleBar Component
export default function TitleBar(props) {
    const style = {
        backgroundColor: props.background,
        color: props.colour,
        height: "0px",
        padding: "2rem 10% 1rem 10%",
        overflow: "hidden",
    }

    //Sets the height of the title bar to the scroll height
    useEffect(() => {
        var element = document.getElementById("title_bar");
        element.style.height = element.scrollHeight+"px";
    }, []);

    return (
        <div className="au-body" id="title_bar" style={style}>
            <div className="halfSplit">
                <h1>{props.title}</h1>
                <h2>{props.text}</h2>
            </div>
        </div>
    )
}