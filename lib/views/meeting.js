import Meeting from '../models/meeting.js';

export default (meeting = new Meeting(), clear=false) => {
    let html = clear ? `` : `
          <h2 class="count">$${meeting.getTotalCost().toFixed(2)}</h2>
          <small>$${(meeting.burnPerMinute()).toFixed(4)} / minute</small>
          <br>
          <small>$${meeting.burnPerSecond().toFixed(4)} / second</small>
          <br>
          <small>${meeting.getTotalTime().toFixed(1)} seconds so far</small>
          `;

    const renderedCost = document.querySelector('.cost');

    window.requestAnimationFrame(() => renderedCost.innerHTML = html);
}
