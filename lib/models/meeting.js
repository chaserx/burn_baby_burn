import Increment from "./increment.js";
import { SECONDS_PER_MINUTE, SECONDS_PER_HOUR, MILLISECONDS_TO_SECONDS } from "../constants.js";

export default class Meeting {

    // variables
    clockRunning = false;
    increments = [];
    currentIncrementStartTime = '';
    currentIncrementAttendeeCount = 4;
    currentIncrementAverageWage = 15;
    purpose = '';

    constructor (attendeeCount, averageWage, warehouse, increments=[], purposeInput='') {
        this.currentIncrementAttendeeCount = attendeeCount;
        this.currentIncrementAverageWage = averageWage;
        this.warehouse = warehouse;
        this.increments = increments;
        this.purpose = purposeInput;
    }

    startMeeting () {
        this.increments = [];
        this.clockRunning = true;
        this.currentIncrementStartTime = new Date;
    }

    stopMeeting () {
        this.clockRunning = false;
        this.pushIncrement();
        this.warehouse.save(this.increments);
    }

    resetMeeting () {
        Object.keys(Meeting.defaultObject).map(key => this[key] = Meeting.defaultObject[key]);
    }

    changeAttendeeCount (newAttendeeCount) {
        this.pushIncrement();
        this.currentIncrementAttendeeCount = newAttendeeCount;
    }

    changeAverageWage (newAverageWage) {
        this.pushIncrement();
        this.currentIncrementAverageWage = newAverageWage;
    }

    changePurpose (purpose) {
        this.purpose = purpose;
    }

    getTotalCost() {
        const [lastIncrement, ...rest] = this.increments.slice().reverse();
        const totalCost = !!lastIncrement ? lastIncrement.totalCost : 0.00;
        if (this.clockRunning)
            return totalCost + (new Increment(this.currentIncrementStartTime, new Date, this.currentIncrementAttendeeCount, this.currentIncrementAverageWage)).cost;
        return totalCost;
    }

    getTotalTime() {
        return (this.increments.reduce((accumulator, currentValue) => accumulator + currentValue.elapsedTime, 0.00) + this.timeElapsedInSeconds());
    }

    getMaxAttendees() {
        return (this.increments.reduce((accumulator, currentValue) => currentValue.attendeeCount > accumulator ? currentValue.attendeeCount : accumulator, 0));
    }

    burnPerSecond () {
        return (this.currentIncrementAttendeeCount * this.currentIncrementAverageWage) / SECONDS_PER_HOUR;
    }

    burnPerMinute () {
        return this.burnPerSecond() * SECONDS_PER_MINUTE;
    }

    timeElapsedInSeconds (currentTime = new Date, pastTime = this.currentIncrementStartTime) {
        let diff = currentTime - pastTime;
        return diff / MILLISECONDS_TO_SECONDS;
    }

    // private-ish

    pushIncrement(){
        if (this.currentIncrementStartTime === '') return null;
        let time = new Date;
        const [lastIncrement, ...rest] = this.increments.slice().reverse();
        const totalCost = !!lastIncrement ? lastIncrement.totalCost : 0.00;
        this.increments.push(new Increment(this.currentIncrementStartTime, time, this.currentIncrementAttendeeCount, this.currentIncrementAverageWage, totalCost, this.purpose));
        this.currentIncrementStartTime = time;
    }

    // class
    static get defaultObject() {
        return {
            clockRunning: false,
            increments: [],
            currentIncrementStartTime: '',
            currentIncrementStopTime: '',
            currentIncrementAttendeeCount: 12,
            currentIncrementAverageWage: 38.46,
            purpose: '',
        }
    }
}
