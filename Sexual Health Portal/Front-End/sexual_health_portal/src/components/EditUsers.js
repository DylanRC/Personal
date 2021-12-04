import React, { useState } from 'react'
import { AUlabel, AUformGroup } from '../pancake/react/form';
import AUtextInput from '../pancake/react/text-inputs';
import AUbutton from '../pancake/react/buttons';

export default function EditUsers() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState("");
    const [fullName, setFullName] = useState("");

    function EditPassword(email, password, admin) {
        // Form a JSON request
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, admin: admin, fullName: fullName })
        };

        // Send the API request accordingly
        fetch("http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT + "/users/edit", requestOptions)
            .then(res => res.json())
            .then((res) => {
                if (res.error) {
                    alert(res.message);
                }
                else {
                    window.location.href = '/dashboard';
                }
            });
    }

    return (
        <div id="formContent">
            <div className="au-body main-content custom-style form-body">
                <div className="au-body">
                    <div id="main-div">
                        <AUformGroup className="center-login">
                            <h2><bold> Edit User </bold></h2>
                            <br />
                            <div className="form">
                                <div id="login-break">
                                    <AUlabel htmlFor="email" text="Email" />
                                    <AUtextInput type="email" name="email" id="email"
                                        onChange={(e) => { setEmail(e.target.value); }} />
                                </div>
                                <div id="login-break">
                                    <AUlabel htmlFor="fullname" text="Full name" />
                                    <AUtextInput type="fullname" name="fullname" id="fullname"
                                        onChange={(e) => { setFullName(e.target.value); }} />
                                </div>
                                <div id="login-break">
                                <AUlabel htmlFor="password" text="Password" />
                                <AUtextInput type="password" name="password" id="password"
                                    onChange={(e) => { setPassword(e.target.value); }} />
                                </div>
                                <div id="login-break" style={{marginTop: "1rem"}}>
                                    <input type="checkbox" id="admin_checkbox" name="admin_checkbox" value="1"
                                        onChange={(e) => { setAdmin(e.target.value); }} />
                                    <label for="admin_checkbox">Administrator?</label>
                                </div>
                            </div>
                            <br />
                            <AUbutton class="au-btn button-width" style={{marginBottom: "5rem"}} type='submit'
                                onClick={(e) => {
                                    e.preventDefault();
                                    EditPassword(email, password, admin);
                                }}>
                                Save
                            </AUbutton>
                        </AUformGroup>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}
