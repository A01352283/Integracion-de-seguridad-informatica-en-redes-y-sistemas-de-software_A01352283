//Tutorial followed: https://reactjs.org/tutorial/tutorial.html
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


  //Function component
  function Square(props){
    return(
      <button className="square" onClick={props.onClick}> 
        {props.value}
      </button> //Shows the value passed to the square in the parent Board component. Adds an OnClick event for the squares
    );
  }

  class InteractiveTitle extends React.Component{
    state = {
      name: ""
    }

    handleInput = event => {
      this.setState({ name: event.target.value});
    }

    logValue = () => {
      console.log(this.state.name);
    }
    
    render(){

      return (
        <div>
          <h1>Welcome to tic-tac-toe</h1>
          {/* <input onChange={this.handleInput} placeholder='Enter your name' />
          <button>Log value</button>  */}
          <br/>
        </div>
      );
    }
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]} //Passes the state of each square
          onClick={() => this.props.onClick(i)} //The onclick prop is a function that Square can call when clicked
        />
      );
    }
  
    render() {  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true
      };
    }

    jumpTo(step){ //Goes to the given state of the played game
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice(); //This creates a copy of the squares array in order to modify it.
      if (calculateWinner(squares) || squares[i]){ //If someone has won the game, returns to ignore input
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O'; //Determines which mark to show, based on the player's turn
      this.setState({
        history: history.concat([{ //Concat doesn't mutate the original array
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext, //Flips the bool to indicate the next player
      });
    }

    render() { //This uses the most recent history to determine and display the game's status
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => { //Move refers to the current history element index
        const desc = move ?
          'Go to move # ' + move:
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner){
        status = 'Winner: ' + winner;
      } else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">

          <div className='container'>
            <InteractiveTitle
            />
          </div>

          <div className='container' id="game-container">
            <div className="game-board">
              <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
          
        </div>
      );
    }
  }
  
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  // ========================================

  //Helper function to check if the game has been won
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }