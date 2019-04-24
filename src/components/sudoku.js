import React, { Component } from 'react';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Board from './board';
var _ = require('lodash');

class Sudoku extends Component {
	render() {
		return (
			<div className="game">
                <div className="game-board">
                    <Board />
                </div>
			</div>
		);
	}
}

export default Sudoku;
