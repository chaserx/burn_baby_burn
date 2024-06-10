import Meeting from '../models/meeting.js';

export default (meeting = new Meeting(), clear=false) => {
    const format_time = (timeInSeconds) => {
        const conversionFactors = [{ s: 60 }, { m: 60 }, { h: 24 }, { d: 30 }, { m: 12 }];

         const calculatedOutput = conversionFactors.reduce((accumulatorInSeconds, factor) => {
            let [accumulator, outputString] = Object.entries(accumulatorInSeconds)[0];
            const [label, divisor] = Object.entries(factor)[0];
            let newTime = Math.floor(accumulator % divisor);
            if (newTime > 0) outputString = `${newTime.toFixed(0)}${label} ${outputString}`;
            return { [Math.floor(accumulator / divisor)]: outputString};
        }, {[timeInSeconds]: ''});

        const [remainder, outputString] = Object.entries(calculatedOutput)[0];
        return remainder != 0 ? `${remainder}y ${outputString}` : outputString;
    };

    let html = clear ? `` : `
          <h2 class="count">$${meeting.getTotalCost().toFixed(2)}</h2>
          <small>$${(meeting.burnPerMinute()).toFixed(4)} / minute</small>
          <br>
          <small>$${meeting.burnPerSecond().toFixed(4)} / second</small>
          <br>
          <small>${format_time(meeting.getTotalTime())}</small>
          `;

    const renderedCost = document.querySelector('.cost');

    window.requestAnimationFrame(() => renderedCost.innerHTML = html);
}
