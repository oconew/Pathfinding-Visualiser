const ANIM_DELAY = 20, scale = 25  // px side length of each cell
let isToggling = false
const WIDTH = Math.floor((window.innerWidth/100*100)/scale), HEIGHT = Math.floor((window.innerHeight/100*94)/scale)  // Width and Height of map
const start = {x: 4, y:Math.floor(HEIGHT/2)}, target = {x: Math.floor(WIDTH-1), y: Math.floor(HEIGHT/2)}
let map = [], Q = []  // Array containing all nodes in the set
let algorithm = 'Dijkstra'


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
        this.prev = undefined
        map[[x, y]] = this
        document.getElementById('grid').innerHTML += `<div class="cell empty" id="${x}, ${y}" onmousedown="enable_toggle(this)" onmouseover="toggle_cell(this)" onmouseup="disable_toggle()"><p class="h">${this.h}</p></div>`
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
}

/**
 * Create a grid of nodes with size [WIDTH, HEIGHT].
 */
function initialise_grid() {
    let node
    for (let y=0; y<HEIGHT; y++) {
        for (let x=0; x<WIDTH; x++) {
            node = new Node(x, y)
            Q.push(node)
        }
    }
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
 * Perform dijkstra's search algorithm on the grid of nodes. For a given source node in the graph, the 
 * algorithm finds the shortest path between that node and every other until the target node is reached.
 */
function dijkstras() { 
    let current, alt, cell
    draw_grid()
    map[[start.x, start.y]].dist = 0  // start node has distance of 0
    if (Q.length > 0) {
        Q.sort((a, b) => (a.dist > b.dist) ? 1 : -1) // sort open array by distance
        current = Q.shift()  // evaluate node with lowest distance
        if (current.weight ===  'T') {return {current}}
        for (let neighbour of current.get_neighbours()) {
            // Get new distances of neighbours
            if (neighbour !== undefined && neighbour.weight !== -1 && Q.includes(neighbour)) {
                if (neighbour.weight === 'p')neighbour.weight=0;
                alt = current.dist + 1
                if (alt < neighbour.dist || neighbour.dist === Infinity) {
                    neighbour.dist = alt
                    neighbour.prev = current
                }
            }
        }        
        setTimeout(dijkstras, ANIM_DELAY)
    }
    draw_path(map[[target.x, target.y]])
}

/** 
 * Performs A* search on the grid of nodes until target is reached. A* algorithm introduces a heuristic into a 
 * regular graph-searching algorithm, essentially planning ahead at each step so a more optimal decision is made.
 */
function a_star() {
    let current, alt
    map[[start.x, start.y]].dist = 0
    draw_grid()
    if (Q.length > 0) {
        current = Q.shift()  // evaluate node with lowest distance
        Q.sort((a, b) => (a.dist + a.h > b.dist + b.h) ? 1 : -1) // sort open array by fScore
        if (current.weight ===  'T') {return {current}}
        for (let neighbour of current.get_neighbours()) {
        if (neighbour !== undefined && neighbour.weight !== -1 && Q.includes(neighbour)) {
            if (neighbour.weight === 'p')neighbour.weight=0;
            alt = current.dist + neighbour.h
            if (alt < neighbour.dist || neighbour.dist === Infinity) {
                neighbour.dist = alt
                neighbour.prev = current
            }
        }
    }
    setTimeout(a_star, ANIM_DELAY)
    }
    draw_path(map[[target.x, target.y]])
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
 * Change the current algorithm to given new algorithm.
 * @param {string} algo new algorithm 
 */
function setAlgorithm(algo) {
    algorithm = algo
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

