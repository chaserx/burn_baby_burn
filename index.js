import Meeting from './lib/models/meeting.js';
import MeetingTemplate from './lib/views/meeting.js';
import PastMeetingsTemplate from './lib/views/pastMeetings.js'
import Warehouse from './lib/models/Warehouse.js';

document.onDOMContentLoaded = (() => {
    // page elements
    const attendeeInput = document.getElementById("inputAttendees");
    const wageInput = document.getElementById('inputHourlyRate');
    const purposeInput = document.getElementById('inputPurpose');
    const costHeader = document.getElementById('costHeader');
    const formInputs = document.getElementById('formInputs');
    const formButtons = document.getElementById('formButtons');

    // update view callbacks
    const updateMeetingCost = (clear=false) => {
        MeetingTemplate(meeting, clear);
        if (clear) costHeader.classList.add('d-none');
    };

    const updatePastMeetings = () => PastMeetingsTemplate(warehouse);

    // reset form & meeting
    const resetMeeting = () => {
        meeting.resetMeeting();
        attendeeInput.value = Meeting.defaultObject['currentIncrementAttendeeCount'];
        wageInput.value = Meeting.defaultObject['currentIncrementAverageWage'];
        purposeInput.value = Meeting.defaultObject['purpose'];
    };

    // core logic
    const warehouse = new Warehouse();
    updatePastMeetings();
    const meeting = new Meeting(attendeeInput.value, wageInput.value, warehouse, purposeInput.value);
    resetMeeting();
    let interval;

    // button handlers
    const disableButton = (buttonTarget) => document.querySelector(buttonTarget).disabled = true;

    const enableButton = (buttonTarget) => document.querySelector(buttonTarget).disabled = false;

    // listeners
    attendeeInput.addEventListener('change', () => meeting.changeAttendeeCount(Number.parseInt(attendeeInput.value)));

    wageInput.addEventListener('change', () => meeting.changeAverageWage(Number.parseFloat(wageInput.value)));

    const purposeRemainingCharacterCount = document.getElementById('purposeRemainingCharacterCount');
    purposeInput.addEventListener('change', () => meeting.changePurpose(purposeInput.value));
    purposeInput.addEventListener('input', () => purposeRemainingCharacterCount.innerText = (purposeInput.maxLength - purposeInput.value.length).toString());

    // view elements
    const startButton = document.querySelector('.start-button');
    startButton.addEventListener('click', (event) => {
        event.preventDefault();
        disableButton('.start-button');
        enableButton('.stop-button');
        disableButton('.reset-button');
        interval = setInterval(updateMeetingCost, 100);
        meeting.startMeeting();
        [...document.querySelectorAll('.d-none')].map(element => element.classList.remove('d-none'));
        formInputs.classList.remove('order-1');
        formInputs.classList.add('order-2');
        formButtons.classList.remove('order-2');
        formButtons.classList.add('order-1');
    });

    const stopButton = document.querySelector('.stop-button');
    stopButton.addEventListener('click', (event) => {
        event.preventDefault();
        enableButton('.start-button');
        disableButton('.stop-button');
        enableButton('.reset-button');
        clearInterval(interval);
        meeting.stopMeeting();
        updateMeetingCost();
        updatePastMeetings();
    });

    const resetButton = document.querySelector('.reset-button');
    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        resetMeeting();
        updateMeetingCost(true);
        formInputs.classList.remove('order-2');
        formInputs.classList.add('order-1');
        formButtons.classList.remove('order-1');
        formButtons.classList.add('order-2');

    });

    const clearButton = document.querySelector('.clear-storage');
    clearButton.addEventListener('click', (event) => {
        event.preventDefault();
        warehouse.remove();
        updatePastMeetings();
    });
})();
