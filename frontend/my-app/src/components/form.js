import React, { useState } from 'react';

/* Should this be a parent which holds state, and the specific form
 * appearance goes within it, or should this hold some of the basic
 * state-changing logic from a parent?
 */
/*
 *class Form extends React.Component {
 *}
 */

function createChangeHandler(stateChanger) {
    return (e) => {
        stateChanger(e.currentTarget.value);
    };
}

export function Form(props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');

    return (
        <div>
            <label> name
                <input name='name'
                       onChange={createChangeHandler(setName)}
                       />
            </label>
            <label> password
            <input name='password'
                   onChange={createChangeHandler(setPassword)}
                   />
            </label>
            <label> age
            <input name='age'
                   onChange={createChangeHandler(setAge)}
                   />
            </label>
            <button onClick={() => {console.log(name, password, age);}}>
                click me
            </button>
        </div>
    );
}

/* What's common to my two forms so far?
 * - Each form tends to have custom submission logic.
 * - The appearance of the form is controlled through styles, not
 *   content.
 * - The state is determined by the inputs, and showing users why they
 *   failed to submit.
 * - The same handlers for input changes and keypresses.
 */

/*
 *
 * 3 forms:
 * - sign up
 * - sign in
 * - purchase stock
 */
