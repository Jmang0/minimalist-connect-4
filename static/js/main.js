window.column = -1
window.gamestate = ['','','','','','',''] // setup empty game
window.turn = 'yellow'

function setup() {

    // ----- INIT -----

    // Reference the element
    connect_4 = document.getElementsByClassName('connect-4')[0]

    // Get the css variable for the square size
    var square_size = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--square-size')
    )
    var padding = square_size/4
    


    // ----- SETUP THE BOARD -----
    // Create the board section
    var board = document.createElement('div')
    board.className = 'connect-4-board'

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
    var hover = document.createElement('div')
    hover.className = 'connect-4-hover'

    for (i=0; i<7; i++) {
        square = document.createElement('div')
        square.className = 'connect-4-square transparent'
        square.id = `connect-4-hover-square-${i}`

        hover.appendChild(square)
    }

    // Add them to the element
    connect_4.appendChild(hover)
    connect_4.appendChild(board)

    console.log('Created the board')


    // ----- FUNCTIONS -----
    connect_4.onmousemove = function(e) {
        rect = connect_4.getBoundingClientRect()
        
        // rect.x is the position of the connect 4 box (top left)
        // padding is the padding to the left
        // e.clientX gives the position of the mouse
        var new_column = Math.floor((e.clientX - rect.x - padding)/square_size)

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

    connect_4.onclick = function(e) {
        console.log('Clicked column ' + window.column)

        num_pieces_in_column = window.gamestate[window.column].length

        if (num_pieces_in_column < 6) {
            // Add the first letter of the color to that column in the gamestate
            window.gamestate[window.column] += window.turn[0]
            
            // Drop the piece (the number of pieces previously in the columna also happens to be the y coordinate)
            document.getElementById(`connect-4-board-square-${window.column}-${num_pieces_in_column}`).className = 'connect-4-square ' + window.turn

            // Change who's turn it is
            if (window.turn == 'yellow') {
                window.turn = 'red'
            }
            else {
                window.turn = 'yellow'
            }

            //Update the hovering token
            document.getElementById(`connect-4-hover-square-${window.column}`).className = 'connect-4-square ' + window.turn
        }
        else {
            console.log('That column is full')
        }
    }
}
