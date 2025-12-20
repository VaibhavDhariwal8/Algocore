let isMudMode = false;

const nodes = [
    { id: 0, x: 50,  y: 50 },
    { id: 1, x: 200, y: 50 },
    { id: 2, x: 350, y: 50 },
    { id: 3, x: 500, y: 50 },
    { id: 4, x: 650, y: 50 },
    { id: 5, x: 50,  y: 250 },
    { id: 6, x: 200, y: 250 },
    { id: 7, x: 350, y: 250 },
    { id: 8, x: 500, y: 250 },
    { id: 9, x: 650, y: 250 }
];

//adjacency list
const edges = [
    { from: 0, to: 1, weight: 10 },
    { from: 1, to: 2, weight: 10 },
    { from: 1, to: 6, weight: 8 },
    { from: 1, to: 7, weight: 13 },
    { from: 2, to: 3, weight: 10 },
    { from: 2, to: 7, weight: 8 },
    { from: 2, to: 8, weight: 13 },
    { from: 3, to: 4, weight: 10 },
    { from: 3, to: 8, weight: 8 },
    { from: 5, to: 6, weight: 10 },
    { from: 6, to: 7, weight: 10 },
    { from: 7, to: 8, weight: 10 },
    { from: 8, to: 9, weight: 10 }
];

// --- RENDER FUNCTION ---
function renderGraph() {
    const container = document.getElementById('graph-container');
    const svg = document.getElementById('connections');
    
    const oldElements = svg.querySelectorAll('line, text'); 
    oldElements.forEach(el => el.remove());

    //Edges (Arrows)
    edges.forEach(edge => {
        const startNode = nodes.find(n => n.id === edge.from);
        const endNode = nodes.find(n => n.id === edge.to);

        if (!startNode || !endNode) return;

        //CENTER(Center of the 40px node)
        const x1 = startNode.x + 20; 
        const y1 = startNode.y + 20;
        const x2 = endNode.x + 20;
        const y2 = endNode.y + 20;


        //calculating midpoints
        const midX = (endNode.x + startNode.x)/2;
        const midY = (endNode.y + startNode.y)/2

        //Calculate new endpoint to stop at the circle's edge
        //Distance between centers
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        //We want to stop 22px short (20px radius + 2px buffer for arrowhead)
        const offset = 22; 
        
        //Normalize the vector and subtract offset
        const newX2 = x2 - (dx / distance) * offset;
        const newY2 = y2 - (dy / distance) * offset;

        //Create the line with the Arrow Marker
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', newX2);
        line.setAttribute('y2', newY2);
        const edgeColor = edge.weight > 15 ? '#8B4513' : '#555';
        line.setAttribute('stroke', edgeColor);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)'); // This adds the arrow
        line.id = `edge-${edge.from}-${edge.to}`;
        
        svg.appendChild(line);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 1); // Shift up slightly so it doesn't overlap the line
        text.setAttribute('fill', '#fff'); // White text
        text.setAttribute('text-anchor', 'middle'); // Center horizontally
        text.setAttribute('font-size', '12px');
        text.setAttribute('font-weight', 'bold');
        text.textContent = edge.weight; //The value
        
        svg.appendChild(text);

        text.style.cursor = "pointer"; //Change mouse to hand pointer
        text.style.pointerEvents = "auto"; 
        text.onclick = () => {
            if (isMudMode) {
                const sliderVal = document.getElementById('weightSlider') ? 
                                  parseInt(document.getElementById('weightSlider').value) : 5;

                // 2. Increase the edge weight
                edge.weight += sliderVal;

                // 3. Re-draw the graph to show the new number
                renderGraph();
                
                // 4. Reset visuals (clear old yellow paths since they might be invalid now)
                document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
            }
        };

        // ...
        svg.appendChild(text);
    });

    //Draw Nodes (Divs) - Only if they don't exist yet
    // (Prevents duplicating nodes on reset)
    nodes.forEach(node => {
        if(document.getElementById(`node-${node.id}`)) return;

        const div = document.createElement('div');
        div.className = 'graph-node';
        div.style.left = `${node.x}px`;
        div.style.top = `${node.y}px`;
        div.innerHTML = `
            <span style="font-size:14px; display:block; line-height:1;">${node.id}</span>
            <span id="dist-${node.id}" style="font-size:10px; display:block; line-height:1; margin-top:2px;">∞</span>
        `;
        div.id = `node-${node.id}`;
        container.appendChild(div);
    });
}

function dijkstra(startId, endId) {
    let distance = [];
    let previous = [];
    let isVisited = [];
    
    //We will store "snapshots" of what happened
    let animationLog = []; 

    for (let i = 0; i < 10; i++) {
        distance.push(Infinity);
        previous.push(null);
        isVisited.push(false);
    }
    distance[startId] = 0;
    
    // Log initial 0 distance for start node
    animationLog.push({ type: 'update', node: startId, newDist: 0 });

    while (true) {
        let minDistance = Infinity;
        let closestNode = null;

        for (let i = 0; i < 10; i++) {
            if (!isVisited[i] && distance[i] < minDistance) {
                minDistance = distance[i];
                closestNode = i;
            }
        }

        if (closestNode === null) break;
        
        // Log that we are visiting this node now
        animationLog.push({ type: 'visit', node: closestNode });

        if (closestNode === endId) break;
        isVisited[closestNode] = true;

        edges.forEach(edge => {
            if (edge.from === closestNode) {
                let newDist = distance[closestNode] + edge.weight;
                if (newDist < distance[edge.to]) {
                    distance[edge.to] = newDist;
                    previous[edge.to] = closestNode;
                    
                    // Log that we found a better distance!
                    animationLog.push({ type: 'update', node: edge.to, newDist: newDist });
                }
            }
        })
    }

    let path = [];
    let currentNode = endId;
    while (currentNode !== null) {
        path.push(currentNode);
        currentNode = previous[currentNode];
    }
    
    // Return the log AND the path
    return { 
        path: path.reverse(), 
        animationLog: animationLog 
    };
}

function animateAlgorithm(animationLog, finalPath) {
    //ANIMATE THE SEARCH (Visits & Updates)
    for (let i = 0; i < animationLog.length; i++) {
        setTimeout(() => {
            const event = animationLog[i];
            
            if (event.type === 'visit') {
                const node = document.getElementById(`node-${event.node}`);
                node.classList.add("visited");
            } 
            else if (event.type === 'update') {
                const node = document.getElementById(`node-${event.node}`);
                // Update the text to show the new distance
                node.innerHTML = `
                    <span style="font-size:14px; display:block; line-height:1;">${event.node}</span>
                    <span style="font-size:10px; display:block; line-height:1; margin-top:2px;">${event.newDist}</span>
                `;
                node.style.backgroundColor = "#fff"; // Flash white
                setTimeout(() => {
                    node.style.backgroundColor = ""; // Revert to Orange (or Blue if already visited)
                }, 300);
            }
            
        }, 500 * i); // 500ms per step
    }

    //CLEANUP & SHOW FINAL PATH
    // Calculate when the search animation ends
    const totalSearchTime = animationLog.length * 500;

    setTimeout(() => {
        // A. RESET ALL NODES (Turn back to original color)
        document.querySelectorAll('.visited').forEach(el => el.classList.remove('visited'));
        
        // B. ANIMATE THE FINAL YELLOW PATH
        for (let j = 0; j < finalPath.length; j++) {
            setTimeout(() => {
                const nodeId = finalPath[j];
                const node = document.getElementById(`node-${nodeId}`);
                
                node.classList.add("active"); // Turn Yellow
                
                // Color the edge if there is a next node
                if(j < finalPath.length - 1) {
                    const nextNodeId = finalPath[j+1];
                    const edge = document.getElementById(`edge-${nodeId}-${nextNodeId}`);
                    if(edge) edge.classList.add("active");
                }
            }, 300 * j);
        }

    }, totalSearchTime + 500); // Wait for search to finish, then pause 500ms
}

function toggleMudMode() {
    isMudMode = !isMudMode;
    
    const btn = document.getElementById('weight-btn');
    if (isMudMode) {
        btn.classList.add('active');
        btn.innerText = "MUD MODE: ON";
    } else {
        btn.classList.remove('active');
        btn.innerText = "MUD TOOL";
    }
}

// Initial Draw
renderGraph();

function runDijkstra() {
    // Clear old classes
    document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.visited').forEach(el => el.classList.remove('visited'));
    
    // Reset text to "Infinity" (optional, for cleanliness)
    nodes.forEach(n => {
        const el = document.getElementById(`node-${n.id}`);
        if(el) el.innerHTML = `${n.id}<br><span style="font-size:10px">∞</span>`;
    });

    const result = dijkstra(0, 9); 
    
    if (result.path.length > 0) {
        animateAlgorithm(result.animationLog, result.path);
    } else {
        alert("No path found!");
    }
}

function resetGraph() {
    renderGraph();
}