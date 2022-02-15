function fill_walls() {
    for (let x=0; x<WIDTH; x++) {
        for (let y=0; y<HEIGHT; y++) {
            if (x%2 !== 0 || y%2 !== 0) {map[[x, y]].weight = -1}
        }
    }
}

function depth_first_maze(cell) {
    cell.visited = true
    for (let neighbour of cell.get_maze_neighbours()) {
        if (!neighbour.visited) {
            map[[cell.x + ((neighbour.x - cell.x) /2), cell.y + ((neighbour.y - cell.y) /2)]].weight = 0
            depth_first_maze(map[[Math.floor((Math.random()*WIDTH)/2)*2, Math.floor((Math.random()*HEIGHT)/2)*2]])
        }
    }
}

function set_maze(new_maze) {
    maze = new_maze
    document.getElementById("maze_dropdown").classList.toggle("show");
}

function generate_maze() {
    fill_walls()
    switch (maze) {
        case 'Depth First':
            depth_first_maze(map[[0,0]])
            break;
        default:
            depth_first_maze(map[[0, 0]])
            break;
    }
    draw_grid()
}

