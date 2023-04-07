/**
 * STEPS:
 * 1. create a requestController class and define the needed variables for the API call
 * 2. Create a method that will get the current (last added) comic and set the currentComicsNumber and
 *    maxComicsNumber accordingly, call that method on load
 * 3. Register an event for the random comic number and add all the chain of event to display it
 * 4. Add Previous/Next, First/Last and get Comic by ID functionality to the app
 * 5. Adjust UI states accordingly
 */

class DOMInterface {
    constructor() {
        this.form = document.querySelector("#comic-form")
        this.searchField = document.querySelector("#search-input")

        this.title = document.querySelector("#comic-title")
        this.image = document.querySelector("#comic-image")

        this.error = document.querySelector("#error")
        this.formError = document.querySelector("#form-error")
        this.loader = document.querySelector("#loader")

        this.controls = {
            previous: document.querySelector("#request-prev"),
            next: document.querySelector("#request-next"),
            random: document.querySelector("#request-random"),
            first: document.querySelector("#request-first"),
            last: document.querySelector("#request-last")
        };
    }
}