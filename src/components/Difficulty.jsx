import DifficultyButton from "./DifficultyButton"
import Modal from "./Modal"

const Difficulty = ({ multiplier, setMultiplier, reset }) => {
    const icon =  <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/></svg>
    const content = (
        <div id="difficulty-buttons">
            <DifficultyButton buttonMultiplier={1} multiplier={multiplier} setMultiplier={setMultiplier} title="Easy" reset={reset}/>
            <DifficultyButton buttonMultiplier={2} multiplier={multiplier} setMultiplier={setMultiplier} title="Medium" reset={reset}/>
            <DifficultyButton buttonMultiplier={3} multiplier={multiplier} setMultiplier={setMultiplier} title="Hard" reset={reset}/>
        </div>
    )
    return (
        <Modal content={content} buttonClass="header-item orange-hover" buttonText="Difficulty" buttonIcon={icon}/>
    )
}


export default Difficulty