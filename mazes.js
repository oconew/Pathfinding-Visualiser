/**
 * Fill all walls on the grid with an even x or y coord.
 */
function fill_walls() {
    for (let x=0; x<WIDTH; x++) {
        for (let y=0; y<HEIGHT; y++) {
            if (x%2 === 0 || y%2 === 0) {map[[x, y]].weight = -1}
        }
    }
}

/**
 * Recuresively generate a depth first maze.
 * @param  {Node} cell The cell currently being visited.
 */
function depth_first_maze(cell) {
    cell.visited = true
    for (let neighbour of cell.get_maze_neighbours()) {
        if (!neighbour.visited) {
            map[[cell.x + ((neighbour.x - cell.x) /2), cell.y + ((neighbour.y - cell.y) /2)]].weight = 0
            setTimeout(10, depth_first_maze(map[[Math.floor((Math.random()*WIDTH)/2)*2, Math.floor((Math.random()*HEIGHT)/2)*2]]))
        }
    }
}

/**
 * WORK IN PROGRESS
 */
function recursive_division() {
    let index = Math.floor(Math.random()*chambers.length), chamber = chambers[index], top_left = chamber[0], bottom_right = chamber[1]
    let chamber_width = bottom_right[0] - top_left[0], chamber_height = bottom_right[1] - top_left[1], horizontal

    if (chamber_width<4 || chamber_height<4 || chambers.length === 0) {
        chambers.splice(index, 1)
        return
    }

    // horizontal wall
    if (chamber_width < chamber_height) {horizontal = true}

    //vertical wall
    else {horizontal = false}

    point = [top_left[0] + Math.floor(Math.random()*chamber_width), top_left[1] + Math.floor(Math.random()*chamber_height)]

    if (horizontal) {
        for (let x=top_left[0]; x<bottom_right[0]; x++) {
            if (x === point[0]) {continue;}
            else {
                map[[x, point[1]]].weight = -1
                chambers.push([top_left, [bottom_right[0], point[1]-1]])
                setTimeout(5, recursive_division())
            }
        }
    }

    else {
        for (let y=top_left[1]; y<bottom_right[1]; y++) {
            if (y === point[1]) {continue;}
            else {
                map[[point[0], y]].weight = -1
                chambers.push([point[0]+1, top_left[1], bottom_right])
                setTimeout(5, recursive_division(chambers))
            }
        }
    }
}


/**
 * Update the maze algorithm to be used.
 * @param  {string} new_maze The new maze algorithm.
 */
function set_maze(new_maze) {
    maze = new_maze
    document.getElementById("maze_dropdown").classList.toggle("show");
}

/**
 * Use the current maze generation algorithm to generate a maze on the grid.
 */
function generate_maze() {
    switch (maze) {
        case 'Depth First':
            fill_walls()
            depth_first_maze(map[[0,0]])
            break;
            case 'Recursive Division':
                recursive_division()
                break;
        default:
            let chambers = [[0, 0], [WIDTH, HEIGHT]]
            depth_first_maze(chambers)
            break;
    }
    draw_grid()
}

