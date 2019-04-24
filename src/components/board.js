import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import * as generator from './generator';
var _ = require('lodash');

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        let startingBoard = generator.generateStartingBoard(30);
        this.state = {
            squares: startingBoard,
            status: {
                msg: '',
                color: 'blue'
            }
        };
    }

    handleSubmit(e, i) {
        const squares = this.state.squares.slice();
        squares[i].value = e.target.value;
        this.setState({ squares: squares });
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }

    handleValidation(squares) {
        const cells = generator.elementsToPositions(squares.slice());
        let emptyCells = cells.map(cell => cell.value === '').filter(v => v).length;
        let msg = 'No conflicts so far';
        let color = 'blue';

        let neighbours;
        cells.forEach((cell) => {
            cell.classes.delete(" conflict");
            if (cell.value) {
                neighbours = generator.getNeighbours(cell.coords, cells);
                neighbours.forEach((neighbour, i) => {
                    if (neighbour) {
                        if (String(neighbour.value) === String(cell.value)) {
                            cell.classes.add(" conflict");
                            msg = 'There\'s number repetition in board';
                            color = 'red';
                        }
                        else if (cell.value<1 || cell.value>9) {
                            cell.classes.add(" conflict");
                            msg = 'There\'s conflict on the board';
                            color = 'red';
                        }
                    }
                });
            }
        });
        let newSquares = generator.elementsToPositions(cells);
        this.setState({
            squares: newSquares,
            status: {
                msg: msg,
                color: color
            }
        });

        // Check for win
        let hasConflict = cells.map(cell => cell.classes).map(set => set.has(" conflict")).includes(true);
        let hasEmpty = cells.map(cell => cell.value).includes('');
        if (!hasEmpty && !hasConflict) {
            this.setState({
                status: {
                    msg: 'Puzzle Solved!!',
                    color: 'green'
                }
            });
        }
    }

    renderSquare(i) {
        let disabled = false;
        let className = "";

        if (this.state.squares[i].initial) {
            disabled = true;
        }

        this.state.squares[i].classes.forEach((element) => className += element);

        return (
            <Square value={this.state.squares[i].value}
                disabled={disabled}
                className={className}
                key={i}
                onKeyDown={this.handleKeyPress}
                onChange={(e) => this.handleSubmit(e, i)} />
        );
    }

    createBoard() {
        let board = [];
        let row, block;

        // generate squares
        for (let i = 0; i < 9; i++) {
            block = [];
            for (let j = 0; j < 3; j++) {
                row = [];
                for (let k = 0; k < 3; k++) {
                    row.push(this.renderSquare(i * 9 + j * 3 + k));
                }
                block.push(<div className="board-row" key={j}>{row}</div>);
            }
            board.push(<div className="block" key={i}>{block}</div>);
        }

        board.push(
            <Button className="validation"
                style={{ width:'25rem' }}
                onClick={
                    () => {
                        this.handleValidation(this.state.squares)
                    }
                }
                key={
                    "v-" + _.random(0, 1000)
                }>
                Check
            </Button>
        );

        board.push(
            <span className="status"
                key="stats"
                style={
                    { color: this.state.status.color }
                }>
                {this.state.status.msg}
            </span>
        );

        return (board);
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        );
    }
}

class Square extends Component {
    render() {
        return (<input value={this.props.value} type="number" disabled={this.props.disabled} pattern="[1-9]" maxLength="1" className={this.props.className} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} />);
    }
}