// Initialise global variables
let ANIM_DELAY = 20, scale = 45  // px side length of each cell
let isToggling = false
let WIDTH = Math.floor((window.innerWidth/100*95)/scale), HEIGHT = Math.floor((window.innerHeight/100*95)/scale)  // Width and Height of map
// if (WIDTH%2 !== 0)WIDTH -=1
// if (HEIGHT%2 !== 0)HEIGHT -=1

let start = {x: 0, y:Math.floor(HEIGHT/2)}, target = {x: Math.floor(WIDTH-1), y: Math.floor(HEIGHT/2)}
let map = [], Q = []  // Array containing all nodes in the set
let algorithm = 'Dijkstra'
let maze = undefined


/**
 * The class representing a node on which pathfinding algorithms are executed.
 * @param x y co-ordinate of Node on grid.
 * @param y x co-ordinate of Node on grid.
 */
class Node {
    constructor(x, y) {
        this.x = x
        this.y = y
        if (this.x === start.x && this.y === start.y) {this.weight = 'S'}
        else if (this.x === target.x && this.y === target.y) {this.weight = 'T';}
        else {this.weight = 0}
        this.dist = Infinity
        this.h = (this.x - target.x)**2 + (this.y-target.y)**2  // h is the estimated distance to target
        this.visited = false // Used to generate mazes
        this.prev = undefined
        map[[x, y]] = this
        document.getElementById('grid').innerHTML += `<div class="cell empty" id="${x}, ${y}" 
        onmousedown="enable_toggle(this)" onmouseover="toggle_cell(this)" onmouseup="disable_toggle()" 
        ondblclick="set_target(this)" oncontextmenu="set_start(this)"><p class="h">${this.h}</p></div>`
    }

    get_neighbours() {
        let neighbours = [], neighbour
        neighbour = map[[this.x-1, this.y]] // left neighbour
        if (neighbour !== undefined && this.x > neighbour.x)neighbours.push(neighbour)

        neighbour= map[[this.x, this.y-1]] // top neighbour
        if (neighbour !== undefined && this.y > neighbour.y)neighbours.push(neighbour)

        neighbour = map[[this.x+1, this.y]] // right neighbour
        if (neighbour !== undefined && this.x < neighbour.x)neighbours.push(neighbour)

        neighbour = map[[this.x, this.y+1]] // bottom neighbour
        if (neighbour !== undefined && this.y < neighbour.y)neighbours.push(neighbour)


        // uncomment to allow diagonal movement
        // neighbour = map[[this.x-1, this.y-1]] // top left neighbour
        // if (neighbour !== undefined)neighbours.push(neighbour)

        // neighbour= map[[this.x+1, this.y-1]] // top right neighbour
        // if (neighbour !== undefined)neighbours.push(neighbour)

        // neighbour = map[[this.x-1, this.y+1]] // bottom left neighbour
        // if (neighbour !== undefined)neighbours.push(neighbour)

        // neighbour = map[[this.x+1, this.y+1]] // bottom right neighbour
        // if (neighbour !== undefined)neighbours.push(neighbour)
        return neighbours
    }

    get_maze_neighbours() {
        let neighbours = [], neighbour
        neighbour = map[[this.x-2, this.y]] // left neighbour
        if (neighbour !== undefined && this.x > neighbour.x)neighbours.push(neighbour)

        neighbour= map[[this.x, this.y-2]] // top neighbour
        if (neighbour !== undefined && this.y > neighbour.y)neighbours.push(neighbour)

        neighbour = map[[this.x+2, this.y]] // right neighbour
        if (neighbour !== undefined && this.x < neighbour.x)neighbours.push(neighbour)

        neighbour = map[[this.x, this.y+2]] // bottom neighbour
        if (neighbour !== undefined && this.y < neighbour.y)neighbours.push(neighbour)

        return neighbours
    }
}

/**
 * Create a grid of nodes with size [WIDTH, HEIGHT].
 */
function initialise_grid() {
    let node
    Q = []
    for (let y=0; y<HEIGHT; y++) {
        for (let x=0; x<WIDTH; x++) {
            if (map[[x, y]] === undefined)node = new Node(x, y)

            else if (map[[x, y]].weight === 'S' && map[[x, y]].weight === 'T') {
                node = map[[x, y]]
                node.dist = Infinity
                node.prev = undefined
            }
            
            else {
                node = map[[x, y]]
                node.dist = Infinity
                node.prev = undefined
                node.weight = 0
                node.visited = false
            }
            if (!Q.includes(node))Q.push(node)
        }
    }
    draw_grid()
}

/**
 * Assign each cell in the html grid with their corresponding classes.
 */
function draw_grid() {
    for (let x = 0; x<WIDTH; x++) {
        for (let y = 0; y<HEIGHT; y++) {
            node = map[[x, y]]
            cell = document.getElementById(`${node.x}, ${node.y}`)
            switch (node.weight) {
                case -1:
                    cell.className = "cell wall"
                    break;
                case 'S':
                    cell.className = "cell start";
                    cell.innerHTML = '<p>S</p>';
                    break;
                case 'T':
                    cell.className = "cell target"
                    cell.innerHTML = '<p>T</p>';
                    break;
                case 'p':
                    cell.className = "cell path"
                    break;
                default:
                    cell.className = "cell"
                    break;
            }
            if(isFinite(node.dist) && Number.isInteger(node.weight) && node.weight !== -1) {
                if(Q.includes(node))cell.className = "cell open"
                else {cell.className = "cell closed"}
            }
        }
    }
}

/**
* Reconstruct the path from target.
 * @param {Node} target The node from which the path will be reconstructed.
 */
function draw_path(target) { 
    while (target.prev !== undefined && target.prev.weight !== 'S') {
        target.prev.weight = 'p'
        target = target.prev
    }
}

/**
 * Start drawing walls in cells the mouse enters.
 * @param {HTMLDivElement} div The cell which has been clicked.
 */
function enable_toggle(div) {
    isToggling = true
    toggle_cell(div) // toggle the cell that was clicked
}

/**
 * Stop drawing walls under the mouse.
 */
function disable_toggle() {
    isToggling = false
}

/**
 * Toggles the cell under the mouse if the mouse is down.
 * @param {HTMLDivElement} div The cell to be toggled.
 */
function toggle_cell(div) {
    if (isToggling) {
        let coords = div.id.split(', ')
        cell = map[[coords[0], coords[1]]]
        if(cell.weight === -1) {cell.weight=0}
        else if (cell.weight !== 'T' && cell.weight !== 'S')cell.weight = -1
        draw_grid()
    }
}

/**
 * Sets the start node to the cell which has been selected.
 * @param  {HTMLDivElement} div The selected div
 */
function set_start(div) {
    let coords = div.id.split(', ')
    cell = map[[coords[0], coords[1]]]
    cell.weight = 'S'
    map[[start.x, start.y]].weight = 0
    document.getElementById(`${start.x}, ${start.y}`).innerHTML = ""
    start = {x: coords[0], y: coords[1]}
    draw_grid()
}

/**
 * Sets the target node to the cell which has been selected.
 * @param  {HTMLDivElement} div The selected div
 */
function set_target(div) {
    let coords = div.id.split(', ')
    cell = map[[coords[0], coords[1]]]
    cell.weight = 'T'
    map[[target.x, target.y]].weight = 0
    document.getElementById(`${target.x}, ${target.y}`).innerHTML = ""
    target = {x: coords[0], y: coords[1]}
    draw_grid()
}
/**
 * Set the animation speed
 * @param  {number} speed New animation delay in milliseconds
 */
function set_speed(speed) {
    ANIM_DELAY = speed
    document.getElementById('speed_dropdown').classList.toggle("show");
}

/**
 * Execute and visualise the current search algorithm.
 */
function run() {
    switch (algorithm) {
        case 'Dijkstra':
            dijkstras()
            break;
        case 'A*':
            a_star()
            break;
        default:
            dijkstras()
            break;
    }  
    draw_grid()
}

initialise_grid()
draw_grid()

