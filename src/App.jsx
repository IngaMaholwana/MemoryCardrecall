import { useState, useEffect, useRef } from 'react'
import Card from './components/Card'
import './styles/App.css'
import "./styles/Modal.css"
import Difficulty from './components/Difficulty'
import HowToPlay from './components/HowToPlay'
import Scores from './components/Scores'
import Timer from './components/Timer'

function App() {
  const [data, setData] = useState([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [clicks, setClicks] = useState([])
  const [gameStatus, setGameStatus] = useState({status: "playing", reason: "none"})
  const [lastPlay, setLastPlay] = useState(null)
  const [level, setLevel] = useState(1)
  const [multiplier, setMultiplier] = useState(1)
  const [timerCount, setTimerCount] = useState(null)
  let interval = useRef(null)
  const API_URL = "https://dragonball-api.com/api/characters/?"
  const MAX_CLICKS = 58

  useEffect(() => {
    fetch(`${API_URL}page=${level}`)
    .then(response => response.json())
    .then(data => setData(data.items))
  }, [level])

  const shuffle = () => {
    let newIndexes = [...Array(data.length).keys()]
    let newArray = new Array(data.length)
    data.forEach((item) => {
      let randomIndex = Math.floor(Math.random() * newIndexes.length)
      let newIndex = newIndexes[randomIndex]
      newArray = newArray.toSpliced(newIndex, 1, item)
      newIndexes = newIndexes.toSpliced(randomIndex, 1)
    })
    setData(newArray)
  }

  const clearTimer = () => {
    clearInterval(interval.current)
    interval.current = null
    setTimerCount(null)
  }

  useEffect(() => {
    if (interval.current === null && timerCount > 0) {
      interval.current = setInterval(() => {setTimerCount(prevtimer => prevtimer - 1)}, 1000) 
    }
    if (timerCount === 0) {
      clearTimer()
      setGameStatus({status: "loss", reason: "timeout"})
    }
  },[timerCount])
  
  const resetTimer = () => {
    if (multiplier === 2) {setTimerCount(prev => 10)}
    if (multiplier === 3) {setTimerCount(prev => 5)}
  }

  const checkGameOver = (id) => clicks.some((num) => num === id)

  const handleLevelUp = () => (score + multiplier) === ((level * 10)*multiplier) ? setLevel(level + 1) : null

  const handleScores = () => {
    let newScore = score + multiplier
    setScore(newScore)
    if (newScore > bestScore) { setBestScore(newScore)}
  }

  const handePlay = (id) => {
    if (checkGameOver(id)) {
      clearTimer()
      setLastPlay(id)
      return setGameStatus({status: "loss", reason: "click"})
    }
    handleScores()
    handleLevelUp()
    shuffle()
  }

  const handleClick = (id) => {
    let newClicks = clicks.concat(id)
    setClicks(newClicks)
    if (newClicks.length === MAX_CLICKS) {
      handleScores()
      clearTimer()
      return setGameStatus({status: "win"})
    }
    resetTimer()
    return handePlay(id)
  }

  const playAgain = () => {
    if (score > 0) {
      setScore(0)
      setClicks([])
      setGameStatus("playing")
      setLastPlay(null)
      setLevel(1)
      clearTimer()
      shuffle()
    }
  }
  const header = 
    <section id="header">
      <div id="buttons">
        <Difficulty multiplier={multiplier} setMultiplier={setMultiplier} reset={playAgain}/>
        <HowToPlay />
        <Timer timerCount={timerCount}/>
      </div>
      <h1 id="title">Dragon Ball Memory Card recall</h1>
      <Scores level={level} score={score} bestScore={bestScore}/>
    </section>

  if (gameStatus.status === 'win') {
    return (
      <>
        {header}
        <div id='game-over'>
          <h2>You won!</h2>
          { multiplier < 3 ? <p>Now try it with a higher difficulty</p> : null }
          <button type='button' className='play-again blue-hover' onClick={playAgain}>Play Again</button>
        </div>
      </>
    )
  }

  if (gameStatus.status === 'loss') {
    const character = data.find((char) => char.id === lastPlay)
    return (
      <>
        {header}
        <div id='game-over'>
          <h2>Game Over!</h2>
          { gameStatus.reason === 'click' ?
          <p>You clicked on <span id="game-over-character">{character.name}</span> twice</p>
          :
          <p>The timer ran out</p>
          }
          <button type='button' className='play-again blue-hover' onClick={playAgain}>Play Again</button>
        </div>
      </>
    )
  }
  return (
    <>
      {header}
      <section id="cards">
        {data.map((character) => 
          <Card key={character.id} id={character.id} name={character.name} image={character.image} onClick={handleClick}/>
          )}
      </section>
    </>
  )
}

export default App
