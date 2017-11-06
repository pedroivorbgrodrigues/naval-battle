
var createBoard = function (board) {
    var matrixSize = 10;
    var matrix = [];
    var size = 50;

    board.setup = function () {
        board.createCanvas(600, 600)
        board.stroke(0)
        // row indicates the y offset
        for (var row = 0; row < matrixSize; row++) {
            // column indicates the x offset
            for (var column = 0; column < matrixSize; column++) {
                if(column == 0) {
                    matrix[row] = []
                }
                matrix[row][column] = {hit: false, unit: 'water'}
            }
        }
        board.noLoop()
    }

    board.draw = function () {
        for (var row = 0; row < matrixSize; row++) {
            // column indicates the x offset
            for (var column = 0; column < matrixSize; column++) {
                var cell = getFill(matrix[row][column])
                board.fill(cell.r, cell.g, cell.b)
                board.rect(column * size, row * size, size, size)
            }
        } 
    }

    board.mousePressed = function() {
        board.clear()
        var index = getIndex(board.mouseX,board.mouseY)
        var cell = matrix[index.x][index.y]
        if(cell) {
            cell.hit = true
        }
        board.redraw()
        return false
    }

    function getFill(cell) {
        if(cell.unit == 'water') {
            if(!cell.hit) {
                return {r: 0, g: 0, b: 255}
            }
            return {r: 0, g: 0, b: 116}
        }
        if(cell.hit) {
            return {r: 255, g: 0, b: 0}
        }
        return {r: 127, g: 127, b: 127}
    }

    function getIndex(mouseX, mouseY) {
        return {
            x:  Math.floor(mouseY / size),
            y: Math.floor(mouseX / size)
        }
    }
}
