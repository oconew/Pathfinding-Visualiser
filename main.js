const start = {x: 0, y:0} // Co ords for starting node
const target = {x: 10, y: 5}  // Co ords for target node
const scale = 50  // px side length of each cell
const WIDTH = Math.floor(window.innerWidth/scale), HEIGHT = Math.floor(window.innerHeight/scale)  // Width and Height of map
let Q = []  // Array containing all nodes in the set
let end = {current: undefined, closed: undefined}

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
        this.prev = undefined
        document.getElementById('grid').innerHTML += `<div class="cell empty" id="${x}, ${y}" onclick="click_cell(this)" oncontectmenu="run()"></div>`

    }

    get_neighbours() {
        let neighbours = [], neighbour
        neighbour = Q[coord_to_Q(this.x, this.y)-1] // left neighbour
        if (neighbour !== undefined && this.x > neighbour.x)neighbours.push(neighbour)

        neighbour=Q[coord_to_Q(this.x, this.y)-WIDTH] // top neighbour
        if (neighbour !== undefined && this.y > neighbour.y)neighbours.push(neighbour)

        neighbour = Q[coord_to_Q(this.x, this.y)+1] // right neighbour
        if (neighbour !== undefined && this.x < neighbour.x)neighbours.push(neighbour)

        neighbour=Q[coord_to_Q(this.x, this.y)+WIDTH] // bottom neighbour
        if (neighbour !== undefined && this.y < neighbour.y)neighbours.push(neighbour)
        return neighbours
    }
}


function coord_to_Q(x, y) {
    return x + (y*WIDTH)
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
    for (let node of Q) {
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
                console.log('yup')
                break;
            default:
                cell.className = "cell"
                break;
        }
        if(node.dist < Infinity && Number.isInteger(node.weight)) {
            cell.className = "cell closed"
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
  

function djikstras() {
    let open = [], closed = [], current, alt
    open.push(Q[coord_to_Q(start.x, start.y)]) // add start node to open set
    open[0].dist = 0  // start node has distance of 0
    while (open.length > 0) {
        open.sort((a, b) => (a.dist > b.dist) ? 1 : -1) // sort open array by distance
        current = open.shift()  // evaluate node with lowest distance
        if (current.weight ===  'T') {return {current, closed}}
        for (let neighbour of current.get_neighbours()) {
            // Get new distances of neighbours
            if (neighbour !== undefined && neighbour.weight !== -1 && !closed.includes(neighbour)) {
                if (neighbour.weight === 'p')neighbour.weight=0;
                alt = current.dist + 1
                if (alt < neighbour.dist || neighbour.dist === Infinity) {
                    neighbour.dist = alt
                    neighbour.prev = current
                    //console.log(neighbour)
                    open.push(neighbour)
                }
            }
        }
        closed.push(current)
        //sleep(100)
        //console.log(Q[1].dist)
        //draw_grid()
    }
}

function draw_path(current) {
    // let current = Q[coord_to_Q(target.x, target.y)]
    while (current.prev !== undefined && current.prev.weight !== 'S' && current.prev.weight !== 'T') {
        current.prev.weight = 'p'
        current = current.prev
    }
}

function click_cell(div) {
    let coords = div.id.split(', ')
    cell = Q[coord_to_Q(parseInt(coords[0]), parseInt(coords[1]))]
    if(cell.weight === -1) {cell.weight=0}
    else if (cell.weight === 'T' || cell.weight === 'S') {cell.weight = cell.weight}
    else {cell.weight = -1}
    if(cell.weight === 'T') {
        run()
    }
    draw_grid()
}

initialise_grid()
draw_grid()
function run() {
    console.log('ghvjfhnj')
    let end = djikstras()
    draw_path(end.current)
    draw_grid()
}

// n


