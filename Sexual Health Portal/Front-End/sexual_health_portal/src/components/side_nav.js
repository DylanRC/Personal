import React from 'react';

var current_div;


//Side nav component
export default function side_nav(props) {

    current_div = props.mainDiv;

    const list_items = props.items.map((_, id) =>
        <li><a onClick={() => { change_div(props.items[id][1]) }}>{props.items[id][0]}</a></li>
    );
    
    return (
        <aside class="au-side-nav" aria-label="side navigation">
            <div id="nav-default" class="au-side-nav__content">
                <h2 class="au-sidenav__title">
                    <a href="#" onClick={() => { change_div(props.mainDiv) }}>{props.title}</a>
                </h2>
                <ul class="au-link-list">
                    {list_items}
                </ul>
            </div>
        </aside>
    )
}

//Function which changes the currently visible div on the page
function change_div(div_id) {

    // Change the content
    document.getElementById(current_div).style.display = "none";
    document.getElementById(div_id).style.display = "block";

    // Update the current div
    current_div = div_id;
    
}