
var createBoard = function (board) {
    var matrix = 10;
    var size = 50;

    board.setup = function () {
        board.createCanvas(600, 600)
        board.stroke(0)
    }

    board.draw = function () {
        // row indicates the y offset
        for (var row = 0; row < matrix; row++) {
            // column indicates the x offset
            for (var column = 0; column < matrix; column++) {
                board.rect(column * size, row * size, size, size)
            }
        }
    }
}

var game = new p5(createBoard, 'naval-field')