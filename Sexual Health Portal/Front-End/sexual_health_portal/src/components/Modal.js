import React, {useEffect} from 'react';

//Modal Component
export default function Modal(props) {
    useEffect(() => {
        var modal = document.getElementById(`modal${props.id}`);
        var button = document.getElementById(`openModal${props.id}`);
    
        button.onclick = function() {
            modal.style.display = "block";
        }
    
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        } 
    }, []);

    return(
        <div id={`modal${props.id}`} class="modal">           
            <div class="modal-content">
                {props.content}
            </div>
        </div>
    )
}