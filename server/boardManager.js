var _ = require('lodash')
var matrixSize = 10

function _createMatrix() {
    var matrix = []
    // row indicates the y offset
    for (var row = 0; row < matrixSize; row++) {
        // column indicates the x offset
        for (var column = 0; column < matrixSize; column++) {
            if (column == 0) {
                matrix[row] = []
            }
            matrix[row][column] = { hit: false, unit: 'water' }
        }
    }
    return matrix
}

function createBoard() {
    var matrix = _createMatrix()
    _placeShips(matrix)
    return matrix
}

function createHitBoard() {
    return _createMatrix()
}

function _placeShips(matrix) {
    _placeShip(matrix, 4)
    _placeShip(matrix, 3)
    _placeShip(matrix, 3)
    _placeShip(matrix, 2)
    _placeShip(matrix, 2)
    _placeShip(matrix, 2)
    _placeShip(matrix, 1)
    _placeShip(matrix, 1)
    _placeShip(matrix, 1)
    _placeShip(matrix, 1)
}

function _placeShip(matrix, slots) {
    var placed = _canPlace(matrix, slots)
    while (!placed) {
        placed = _canPlace(matrix, slots)
    }
}

function _getBoatType(slots) {
    switch (slots) {
        case 4:
            return 'battleship'
        case 3:
            return 'cruiser'
        case 2:
            return 'destroier'
        default:
            return 'submarine'
    }
}

function _insideBounds(target, slots, positive) {
    var endsAt = target + (slots*positive)
    return endsAt > 0 && endsAt < 9
}

function _canPlace(matrix, slots) {
    var vertical = _.random(0, 1)
    var positive = _.random(0, 1) == 0 ? -1 : 1
    var nr = _.random(0, 9)
    var nc = _.random(0, 9)
    if (vertical) {
        if(!_insideBounds(nr,slots, positive))
            return false
    } else {
        if(!_insideBounds(nc,slots, positive))
            return false
    }
    var attempt = _.clone(matrix)
    var boat = _getBoatType(slots)
    for (var i = 0; i < slots; i++) {
        var cel = attempt[nr][nc]
        if (cel.unit != 'water') {
            return false
        }
        cel.unit = boat
        if (vertical) {
            nr += positive
        } else {
            nc += positive
        }
    }
    matrix = attempt
    return true
}

exports.createBoard = createBoard
exports.createHitBoard = createHitBoard