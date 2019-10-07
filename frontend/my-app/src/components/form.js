import React from 'react';

/* Should this be a parent which holds state, and the specific form
 * appearance goes within it, or should this hold some of the basic
 * state-changing logic from a parent?
 */
/*
 *class Form extends React.Component {
 *}
 */



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
