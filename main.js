const ANIM_DELAY = 20
const scale = 50  // px side length of each cell
const parent = document.getElementById('grid')
const WIDTH = Math.floor((window.innerWidth/100*100)/scale), HEIGHT = Math.floor((window.innerHeight/100*95)/scale)  // Width and Height of map
const start = {x: 0, y:0} // Co ords for starting node
const target = {x: Math.floor(WIDTH/2), y: Math.floor(HEIGHT/2)}  // Co ords for target node
let map = []
let Q = []  // Array containing all nodes in the set
let end

class Node {
    /**
     * The class representing a node on which pathfinding algorithms are executed
     * @param x y co-ordinate of Node on grid
     * @param y x co-ordinate of Node on grid
     */
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
        document.getElementById('grid').innerHTML += `<div class="cell empty" id="${x}, ${y}" onclick="click_cell(this)" oncontectmenu="run()">${this.h}</div>`
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

function initialise_grid() {
    let node
    for (let y=0; y<HEIGHT; y++) {
        for (let x=0; x<WIDTH; x++) {
            node = new Node(x, y)
            Q.push(node)
        }
    }
}

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
                    cell.className = "cell start"
                    break;
                case 'T':
                    cell.className = "cell target"
                    break;
                case 'p':
                    cell.className = "cell path"
                    break;
                default:
                    cell.className = "cell"
                    break;
            }
            // if(node.dist < Infinity && Number.isInteger(node.weight)) {
            //     cell.className = "cell closed"
            // }
            if(isFinite(node.dist) && Number.isInteger(node.weight)) {
                if(Q.includes(node))cell.className = "cell open"
                else {cell.className = "cell closed"}
            }
        }
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
function changeClass(cell, new_class) {
    cell.className = new_class
}

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

function a_star() {
    let current, alt
    map[[start.x, start.y]].dist = 0
    draw_grid()
    if (Q.length > 0) {
        Q.sort((a, b) => (a.dist + a.h > b.dist + b.h) ? 1 : -1) // sort open array by fScore
        current = Q.shift()  // evaluate node with lowest distance
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


function draw_path(current) {
    // let current = Q[coord_to_Q(target.x, target.y)]
    while (current.prev !== undefined && current.prev.weight !== 'S') {
        current.prev.weight = 'p'
        current = current.prev
    }
}

function click_cell(div) {
    let coords = div.id.split(', ')
    cell = map[[coords[0], coords[1]]]
    if(cell.weight === -1) {cell.weight=0}
    else if (cell.weight === 'T' || cell.weight === 'S') {cell.weight = cell.weight}
    else {cell.weight = -1}
    if(cell.weight === 'T') {
        run()
    }
    //draw_path(map[[target.x, target.y]])
    draw_grid()
}

initialise_grid()
draw_grid()
function run() {

    a_star()    
    draw_grid()
}

// n

