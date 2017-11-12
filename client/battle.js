
var createBoard = function (board) {
    
    var size = 50;
    var matrix = []

    board.setup = function () {
        board.createCanvas(600, 600)
        board.stroke(0)
        board.noLoop()
        window.mySocket.on('battle', function (payload) {
            matrix = board._userNode.id == 'naval-field' ? payload.board : payload.hitBoard
            board.redraw()
        })
    }

    board.draw = function () {
        board.clear()
        if(matrix.length <= 0) {
            return
        }
        for (var row = 0; row < matrix.length; row++) {
            // column indicates the x offset
            for (var column = 0; column < matrix.length; column++) {
                var cell = getFill(matrix[row][column])
                board.fill(cell.r, cell.g, cell.b)
                board.rect(column * size, row * size, size, size)
            }
        }
    }

    board.mousePressed = function() {
        if(board._userNode.id != 'naval-hits')
            return
        var coordinates = getCoordinates(board.mouseX,board.mouseY)
        if(!coordinates.hasOwnProperty('x') || !coordinates.hasOwnProperty('y')) 
            return
        if(coordinates.x < 0 || coordinates.x >9)
            return
        if(coordinates.y < 0 || coordinates.y > 9)
            return
        window.mySocket.emit('fire', coordinates)
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

    function getCoordinates(mouseX, mouseY) {
        return {
            x:  Math.floor(mouseY / size),
            y: Math.floor(mouseX / size)
        }
    }
}
