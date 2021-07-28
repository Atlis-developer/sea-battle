let view = {
    showMessageArea: function (msg) {
    let message = document.getElementById('messageArea');
    message.innerHTML = msg;
    },
    displayHit: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
    },
    displayMiss: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
    },

};

let model = {
    boardSize: 7,
    shipLength: 3,
    numShips: 3,
    shipsSunk:0,

    ships: [
        ship1 = { location: ['0', '0', '0'], hits: ['', '', ''] },
        ship2 = { location: ['0', '0', '0'], hits: ['', '', ''] },
        ship3 = { location: ['0', '0', '0'], hits: ['', '', ''] }
        ],

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.location.indexOf(guess);
            if (index >= 0){
                ship.hits [index] = 'hit';
                view.displayHit(guess);
                view.showMessageArea('Ты попал!');
                if (this.isSunk(ship)){
                    view.showMessageArea('Ты потопил мой корабль!')
                    this.shipsSunk ++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.showMessageArea('Ты промазал!')
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== 'hit'){
                return false;
            }
        }
        return true;
    },


    generateShipLocations: function () {
        let location;
        for (let i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
            }while (this.collision(location));
            this.ships[i].location = location;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
        if (direction === 1){ //horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        }else{ // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
    }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++){
            if (direction === 1){// horizontal
                newShipLocations.push(row + '' + (col + i));
            } else{ // vertical
                newShipLocations.push((row + i) + '' +col);
            }
        } return newShipLocations;
    },
    collision: function (location) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            for (let j = 0; j < location.length; j++){
                if (ship.location.indexOf(location[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};


let controller = {
    gusses: 0,
    processGuess: function (guess) {
        let location = parseGuess(guess);
        if(location){
            this.gusses++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.showMessageArea('Вы выиграли! За: ' + this.gusses + ' выстрелов Вы потопили: ' + model.shipsSunk + ' корабля.');
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess.length !== 2) {
    alert('Неверные координаты!');
    }else{
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)){
            alert('Неверные координаты!');
        }else if (row < 0 || row > model.boardSize || column < 0 || column > model.boardSize){
            alert('Неверные координаты!');
        }else{
            return row + column;
        }
    }return  null;
}


function init (){
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}
function handleFireButton (){
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
}
function handleKeyPress (e){
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }

}




window.onload = init;






