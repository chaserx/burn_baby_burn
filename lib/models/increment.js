import { SECONDS_PER_HOUR, MILLISECONDS_TO_SECONDS } from "../constants.js";

export default class Increment {
    startTime = '';
    stopTime = '';
    elapsedTime = 0.00;
    attendeeCount = 0;
    averageWage = 0.00;
    cost = 0.00;
    totalCost = 0.00;
    purpose = '';

    constructor(currentIncrementStartTime, currentIncrementStopTime, currentIncrementAttendeeCount, currentIncrementAverageWage, previousIncrementTotalCost=0.00, purpose='') {
        this.startTime = currentIncrementStartTime;
        this.stopTime = currentIncrementStopTime;
        this.elapsedTime = (currentIncrementStopTime - currentIncrementStartTime) / MILLISECONDS_TO_SECONDS;
        this.attendeeCount = currentIncrementAttendeeCount;
        this.averageWage = currentIncrementAverageWage;
        this.cost = this.attendeeCount * (this.averageWage / SECONDS_PER_HOUR) * this.elapsedTime;
        this.totalCost = previousIncrementTotalCost + this.cost;
        this.purpose = purpose;
    }
}
