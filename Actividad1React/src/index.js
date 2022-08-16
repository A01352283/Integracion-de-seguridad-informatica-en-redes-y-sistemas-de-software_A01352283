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
  
  class Board extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        squares: Array(9).fill(null),
      };
    }

    handleClick(i){
      const squares = this.state.squares.slice(); //This creates a copy of the squares array in order to modify it.
      squares[i] = 'X';
      this.setState({squares: squares});
    }

    renderSquare(i) {
      return (
        <Square 
          value={this.state.squares[i]} //Passes the state of each square
          onClick={() => this.handleClick(i)} //The onclick prop is a function that Square can call when clicked
        />
      );
    }
  
    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div className="status">{status}</div>
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
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  