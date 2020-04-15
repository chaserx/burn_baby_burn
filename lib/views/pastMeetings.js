import Meeting from "../models/meeting.js";

export default (warehouse) => {
    let data = warehouse.load();
    data = (data !== null) ? JSON.parse(data) : [];

    let html = `
        <table class="table table-striped table-responsive table-hover table-sm">
            <thead class="thead-dark">
                <tr class="border-bottom">
                    <th></th>
                    <th class="px-2">Date</th>
                    <th class="px-2">Attendees</th>
                    <th class="px-2">Cost</th>
                    <th class="px-2">Purpose</th>
                </tr>
            </thead>
            `;
    if (!data.length) html += `
            <tr class="border-bottom">
                <td></td>
                <td colspan="3" class="border-bottom px-2">No past meetings</td>
            </tr>
        `;
    let count = 1;
    data.map(meetingData => {
        const [lastIncrement, ...rest] = meetingData.slice().reverse();
        let meeting = new Meeting(lastIncrement.attendeeCount, lastIncrement.averageWage, warehouse, meetingData);
        html += `
            <tr>
                <td class="border-bottom px-2">${count++}</td>
                <td class="border-bottom px-2">${new Date(Date(meeting.increments[0].startTime)).toLocaleString()}</td>
                <td class="border-bottom px-2">${meeting.getMaxAttendees()}</td>
                <td class="border-bottom px-2">$${meeting.getTotalCost().toFixed(2)}</td>
                <td class="border-bottom px-2">${lastIncrement.purpose}</td>
            </tr>
        `;
    });
    html += `
        </table>
        `;

    const pastMeetings = document.querySelector('.past-meetings');

    window.requestAnimationFrame(() => pastMeetings.innerHTML = html);

    const clearButton = document.querySelector('.clear-storage');
    const disabled = 'disabled';
    if (!!data.length && clearButton.disabled) {
        clearButton.removeAttribute(disabled);
    } else if (!data.length) {
        clearButton.setAttribute(disabled, disabled);
    }
}
