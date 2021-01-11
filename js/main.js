// ----- INIT -----

// Reference to the element
window.connect_4 = document.getElementsByClassName('connect-4')[0]


// Get the css variable for the square size
window.square_size = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--square-size')
)
window.padding = square_size/4

// Game variable
window.column = -1
window.gamestate = ['','','','','','',''] // setup empty game
window.turn = 'yellow'
setText('Yellow\'s turn')

window.winner = null


// ----- SETUP THE BOARD -----

// Create the board section
var board = document.getElementsByClassName('connect-4-board')[0]

// each square's id is:
// connect-4-board-square-column-row
for (row=5; row>=0; row--) {
    for (column=0; column<7; column++) {
        square = document.createElement('div')
        square.className = 'connect-4-square empty'
        square.id = `connect-4-board-square-${column}-${row}`

        board.appendChild(square)
    }
}

// Create the hover section
var hover = document.getElementsByClassName('connect-4-hover')[0]

for (i=0; i<7; i++) {
    square = document.createElement('div')
    square.className = 'connect-4-square transparent'
    square.id = `connect-4-hover-square-${i}`

    hover.appendChild(square)
}

// Add them to the element
window.connect_4.appendChild(hover)
window.connect_4.appendChild(board)

console.log('Created the board')


// ----- FUNCTIONS -----

// When the mouse mouse, update the column it's in
window.connect_4.onmousemove = function(event) {
    if (window.winner != null) {
        // If the game is already over, don't bother tracking where the mouse is and stuff
        return null
    }
    
    updateColumn(event)
}

// Handle mouse clicks
window.connect_4.onclick = function(event) {

    if (window.winner != null) {
        // If the game is already over, don't bother tracking where the mouse is and stuff
        return null
    }

    // when the mouse is clicked, update the column it's in
    // i didn't think this was necessary but it breaks without it
    updateColumn(event)

    // console.log('Clicked column ' + window.column)
    
    num_pieces_in_column = window.gamestate[window.column].length

    if (num_pieces_in_column < 6) {
        // Add the first letter of the color to that column in the gamestate
        window.gamestate[window.column] += window.turn[0]
        
        // Drop the piece (the number of pieces previously in the columna also happens to be the y coordinate)
        document.getElementById(`connect-4-board-square-${window.column}-${num_pieces_in_column}`).className = 'connect-4-square ' + window.turn

        // Change who's turn it is
        if (window.turn == 'yellow') {
            window.turn = 'red'
            setText('Red\'s turn')
        }
        else {
            window.turn = 'yellow'
            setText('Yellow\'s turn')
        }

        //Update the hovering token
        document.getElementById(`connect-4-hover-square-${window.column}`).className = 'connect-4-square ' + window.turn


        // Check if there's a winner
        // vertical
        for (column=0; column<7; column++) {
            var column_string = window.gamestate[column]
            winnerCheck(column_string)
        }

        // horizontal
        for (row=0; row<6; row++) {
            var row_string = ''
            for (column=0; column<7; column++) {
                var token = window.gamestate[column][row]
                if (token === undefined) {
                    row_string += ' '
                }
                else {
                    row_string += token
                }
            }
            winnerCheck(row_string)
        }
        // diagonal
        // yes, i couldve calculated this each time but writing it out wasn't too bad and it's faster at runtime
        // each pos is (column, row)
        var diagonals = [
            //
            [[0,3],[1,2],[2,1],[3,0]],
            [[0,4],[1,3],[2,2],[3,1],[4,0]],
            [[0,5],[1,4],[2,3],[3,2],[4,1],[5,0]],
            [[1,5],[2,4],[3,3],[4,2],[5,1],[6,0]],
            [[2,5],[3,4],[4,3],[5,2],[6,1]],
            [[3,5],[4,4],[5,3],[6,2]],
            //
            [[0,2],[1,3],[2,4],[3,5]],
            [[0,1],[1,2],[2,3],[3,4],[4,5]],
            [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5]],
            [[1,0],[2,1],[3,2],[4,3],[5,4],[6,5]],
            [[2,0],[3,1],[4,2],[5,3],[6,4]],
            [[3,0],[4,1],[5,2],[6,3]]
        ]

        for (diagonal in diagonals) {
            var diagonal_string = ''

            for (i in diagonals[diagonal]) {
                var pos = diagonals[diagonal][i]
                var token = window.gamestate[pos[0]][pos[1]]
                if (token === undefined) {
                    diagonal_string += ' '
                }
                else {
                    diagonal_string += token
                }
            }
            winnerCheck(diagonal_string)
        }
    }
    else {
        console.log('That column is full')
    }

}

// Updates window.column to make it contain the current column the mouse is in 
function updateColumn(event) {
    rect = window.connect_4.getBoundingClientRect()
        
    // rect.x is the position of the connect 4 box (top left)
    // padding is the padding to the left
    // event.clientX gives the position of the mouse
    var new_column = Math.floor((event.clientX - rect.x - window.padding)/window.square_size)

    if (new_column != window.column) {
        // Handle a change in column
        // Remove the hovering color from the previous column

        if ( window.column >= 0 && window.column <= 6) {
            // if there was a hovering dot, remove the dot
            // console.log('Removing dot from column '+ window.column)
            document.getElementById(`connect-4-hover-square-${window.column}`).className = 'connect-4-square transparent'
        }

        if ( new_column >= 0 && new_column <= 6) {
            // if add the new hovering dot
            // console.log('Adding dot to ' + new_column)
            document.getElementById(`connect-4-hover-square-${new_column}`).className = 'connect-4-square ' + window.turn
        }

        window.column = new_column
    }
}

// Given a string, check if there is a four in a row in it
function winnerCheck(string) {
    if (string.includes('yyyy')) {
        window.winner = 'yellow'
        setText('Yellow wins!')
    }
    else if (string.includes('rrrr')) {
        window.winner = 'red'
        setText('Red wins!')
    }
    else {
        return null
    }

    // Remove the hovering token
    try {
        document.getElementById(`connect-4-hover-square-${window.column}`).className = 'connect-4-square transparent'
    }
    catch(e) {
        console.log(window.column)
    }
    
}

// Sets the text displayed under the board
function setText(string) {
    document.getElementsByClassName('info-text')[0].innerHTML = string
}