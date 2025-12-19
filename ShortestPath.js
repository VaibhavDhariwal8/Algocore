let isDraggingStart = false;
let isDraggingFinish = false;
let isDraggingWall = false;
let isDraggingWeight = false;

let currentTool = 'wall'
let currentWeightValue = 5;

class Node {
    constructor(row, col, isWall, isStart, isFinish, isVisited) {
        this.row = row;
        this.col = col;
        this.isWall = isWall;
        this.isStart = isStart;
        this.isFinish = isFinish;
        this.isVisited = isVisited;
        this.distance = Infinity;
        this.previousNode = null;
        this.weight = 1;
    }
}

function createInitialGrid(){
    return Array.from({length : 20}, (_,row) => {
        return Array.from({length : 20}, (_,col) => {
            return new Node(row,col,false,false,false,false);
        })
    })
}

function toggleWall(row, col, grid){
    const node = grid[row][col];
    if(node.isStart || node.isFinish) return;

    node.isWall = !node.isWall;
    const element = document.getElementById(`node-${row}-${col}`);
    element.classList.toggle("node-wall");
}

function handleMouseDown(row, col, grid) {
    const node = grid[row][col];
    if (node.isStart) isDraggingStart = true;
    else if (node.isFinish) isDraggingFinish = true;
    else {
        if (currentTool === 'wall') {
            isDraggingWall = true;
            toggleWall(row, col, grid);
        } else {
            isDraggingWeight = true;
            toggleWeight(row, col, grid);
        }
    }
}

function handleMouseEnter(row,col,grid){
    const node = grid[row][col];

    if(isDraggingStart && !node.isFinish && !node.isWall){
        const oldStart = grid.flat().find(n => n.isStart);
        oldStart.isStart = false;
        document.getElementById(`node-${oldStart.row}-${oldStart.col}`).classList.remove("node-start");

        node.isStart = true;
        document.getElementById(`node-${row}-${col}`).classList.add("node-start");

        currentStartNode = node;
    }
    
    if(isDraggingFinish && !node.isStart && !node.isWall){
        const oldFinish = grid.flat().find(n => n.isFinish);
        oldFinish.isFinish = false;
        document.getElementById(`node-${oldFinish.row}-${oldFinish.col}`).classList.remove("node-finish");

        node.isFinish = true;
        document.getElementById(`node-${row}-${col}`).classList.add("node-finish");

        currentFinishNode = node;
    }

    if(isDraggingWall){
        toggleWall(row,col,grid);
    }
    
    if (isDraggingWeight) {
        toggleWeight(row, col, grid);
    }
}

function handleMouseUp() {
    isDraggingStart = false;
    isDraggingFinish = false;
    isDraggingWall = false;
    isDraggingWeight = false;
}

function resetGridData(grid){
    for(let i=0; i<grid.length; i++){
        for(let j=0; j<grid[i].length; j++){
            grid[i][j].distance = Infinity;
            grid[i][j].isVisited = false;
            grid[i][j].previousNode = null;
            const element = document.getElementById(`node-${i}-${j}`);
            element.classList.remove("node-visited");
            element.classList.remove("node-shortest-path");
        }
    }
}

function toggleWeight(row, col, grid) {
    const node = grid[row][col];
    if (node.isStart || node.isFinish || node.isWall) return;

    node.weight = currentWeightValue;
    
    const element = document.getElementById(`node-${row}-${col}`);
    
    if (node.weight === 1) {
        element.classList.remove("node-weight");
        element.style.opacity = "1"; // Reset opacity
    } else {
        element.classList.add("node-weight");
        
        
        const intensity = Math.min(0.3 + (node.weight / 50), 1); 
        element.style.opacity = intensity;
    }
}

function updateWeightValue(val) {
    currentWeightValue = parseInt(val);
    document.getElementById('weightDisplay').innerText = val; // Update the text label
}

function renderGrid(grid){

    const container = document.getElementById("grid-container")

    for(let i =0; i<grid.length; i++){
        for(let j =0; j<grid[i].length; j++){
            const node = grid[i][j];
            const nodeElement = document.createElement("div");

            nodeElement.id = `node-${i}-${j}`;
            nodeElement.className = "node";

            if(node.isStart) nodeElement.classList.add("node-start");
            if(node.isFinish) nodeElement.classList.add("node-finish");

            nodeElement.addEventListener('mousedown', () => handleMouseDown(i,j,grid));
            nodeElement.addEventListener('mouseenter', () => handleMouseEnter(i,j,grid));
            nodeElement.addEventListener('mouseup', () => handleMouseUp());
            container.appendChild(nodeElement);
        }
    }
}

function getNeighbours(node, grid){
    const neighbours = [];
    const {row, col} = node;

    if(row > 0) neighbours.push(grid[row-1][col]); //go up
    if(row < 19) neighbours.push(grid[row+1][col]); //go down
    if(col > 0) neighbours.push(grid[row][col-1]); //go left
    if(col < 19) neighbours.push(grid[row][col+1]); //go right

    return neighbours;
}

function updateUnvisitedNeighbours(closestNode, grid) {
    const neighbours = getNeighbours(closestNode, grid);

    for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];
        if (!neighbour.isVisited) {
            const newDistance = closestNode.distance + neighbour.weight;
            
            if (newDistance < neighbour.distance) {
                neighbour.distance = newDistance;
                neighbour.previousNode = closestNode;
            }
        }
    }
}


function dijkstra(grid, startNode, finishNode){
    startNode.distance = 0;
    const unvisitedNodes = grid.flat();
    const visitedNodesInOrder = [];
    
    while(unvisitedNodes.length > 0){
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall) continue;
        if(closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if(closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighbours(closestNode, grid);
    }

}


function animateDijkstra(visitedNodesInOrder, finishNode) {
    if(visitedNodesInOrder[visitedNodesInOrder.length - 1] != finishNode) return;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(visitedNodesInOrder);
            }, 10 * i);
            return;
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            if (!node.isStart && !node.isFinish) {
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
            }
        }, 10 * i);
    }
}

function animateShortestPath(visitedNodesInOrder) {
    const finishNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
    let currentNode = finishNode;
    let path = [];
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
            const node = path[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path');
        }, 50 * i);
    }
}


const mainGrid = createInitialGrid();
let currentStartNode = mainGrid[0][0];
let currentFinishNode = mainGrid[5][15];

currentStartNode.isStart = true;
currentFinishNode.isFinish = true;

renderGrid(mainGrid);

function startVisualizer() {
    // Now it uses the dynamic positions!
    resetGridData(mainGrid);
    const visitedNodesInOrder = dijkstra(mainGrid, currentStartNode, currentFinishNode);
    animateDijkstra(visitedNodesInOrder, currentFinishNode);
}