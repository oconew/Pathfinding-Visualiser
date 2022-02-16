/**
 * Change the current algorithm to given new algorithm.
 * @param {string} algo new algorithm 
 */
 function setAlgorithm(algo) {
    algorithm = algo
    document.getElementById('dropdown').classList.toggle('show')
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