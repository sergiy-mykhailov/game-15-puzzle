// Created by Sergiy Mykhailov

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import GameFifteen from './components/GameFifteen.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <div className="container mt-2">
        <GameFifteen/>
    </div>,
    document.getElementById('fifteen-puzzle')
);
