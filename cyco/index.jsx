import { css } from "uebersicht";

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export const color1 = "#EBBA55";
export const color2 = "#FFFFFF";

export const className = `
	left: 50px;
	top: 00px;
	font-family: "Porter";
	z-index: 1;
  position: relative;
`;

const dayNumberCss = css`
  font-size: 500px;
  background: -webkit-linear-gradient(${color1}, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px #00000000;
`;

const dayInWeekCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  transform: rotate(-90deg);
  top: 250px;
  font-size: 30px;
`;

const monthNameCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  font-size: 70px;
  top: 200px;
  left: 170px;
`;

const timeCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  font-size: 50px;
  top: 300px;
  left: 170px;
`;

// How often command will be executed
export const refreshFrequency = 1000 * 15;

// Trigger UI refresh
export const command = (dispatch) => {
  dispatch({ output: new Date() });
};

export const render = ({ output }) => {
  const now = new Date();

  let monthName = months[now.getMonth()];
  let dayNumber = padZero(now.getDate(), 2);
  let dayInWeek = weekdays[now.getDay()];
  let time = padZero(now.getHours(), 2) + ":" + padZero(now.getMinutes(), 2);

  return (
    <div>
      <div className={dayNumberCss}>{dayNumber}</div>
      <div className={dayInWeekCss}>{dayInWeek}</div>
      <div className={monthNameCss}>{monthName}</div>
      <div className={timeCss}>{time}</div>
    </div>
  );
};

const padZero = (num, places) => String(num).padStart(places, "0");
