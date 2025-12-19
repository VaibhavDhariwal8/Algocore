# ALGO.CORE — Dijkstra's Algorithm Visualizer

A sleek, interactive visualization of **Dijkstra's Shortest Path Algorithm** built with vanilla JavaScript, HTML, and CSS. This project demonstrates proficiency in Data Structures and Algorithms through an engaging, real-time pathfinding visualization.

![Dijkstra Visualizer](https://img.shields.io/badge/Algorithm-Dijkstra-8fa18d?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🎯 Features

- **Real-time Visualization** — Watch Dijkstra's algorithm explore the grid step-by-step
- **Interactive Grid** — Draw walls by clicking and dragging to create obstacles
- **Draggable Nodes** — Reposition start and finish nodes anywhere on the grid
- **Shortest Path Highlighting** — See the optimal path animate after exploration completes
- **Clean, Modern UI** — Minimalist dark theme with smooth animations

---

## 🧠 Algorithm Overview

### Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path between nodes in a graph. In this visualizer:

1. **Initialization** — Set the start node's distance to 0, all others to infinity
2. **Exploration** — Visit the unvisited node with the smallest distance
3. **Update Neighbors** — Calculate tentative distances to all unvisited neighbors
4. **Repeat** — Continue until the finish node is reached or all nodes are visited
5. **Backtrack** — Trace back from the finish node using stored previous pointers

**Time Complexity:** O(V²) where V is the number of vertices (grid cells)

**Space Complexity:** O(V) for storing distances and visited states

---

## 🛠️ Technical Implementation

### Data Structures Used

| Structure | Purpose |
|-----------|---------|
| **2D Array (Grid)** | Represents the graph as a 20×20 matrix of nodes |
| **Node Class** | Encapsulates cell properties: position, wall status, visited state, distance, previous pointer |
| **Array (Queue)** | Stores unvisited nodes, sorted by distance for greedy selection |

### Core Components

```
ShortestPath.js
├── Node Class           — Graph node representation
├── createInitialGrid()  — Grid initialization
├── dijkstra()           — Core algorithm implementation
├── getNeighbours()      — Adjacent node retrieval (4-directional)
├── animateDijkstra()    — Visualization of exploration
└── animateShortestPath() — Path reconstruction & display
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/algocore.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd algocore
   ```

3. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   npx serve .
   ```

---

## 🎮 How to Use

1. **Draw Walls** — Click and drag on the grid to create obstacles
2. **Move Start Node** — Drag the green start node to reposition it
3. **Move Finish Node** — Drag the red finish node to reposition it
4. **Run Algorithm** — Click "INITIALIZE SEARCH" to start the visualization
5. **Reset** — Click "RESET GRID" to clear and start over

---

## 📁 Project Structure

```
Algocore/
├── index.html        # Main HTML structure
├── ShortestPath.js   # Algorithm & grid logic
├── styles.css        # Styling & animations
└── README.md         # Documentation
```

---

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🟢 Green | Start Node |
| 🔴 Red | Finish Node |
| ⬛ Dark | Wall (Obstacle) |
| 🔵 Blue | Visited Node |
| 🟡 Yellow | Shortest Path |

---

## 📚 DSA Concepts Demonstrated

- **Graph Representation** — Adjacency through grid neighbors
- **Greedy Algorithms** — Always selecting the minimum distance node
- **Priority Queue Concept** — Sorting unvisited nodes by distance
- **Path Reconstruction** — Backtracking using previous node pointers
- **BFS-like Traversal** — Level-by-level exploration pattern

---

## 🔮 Future Enhancements

- [ ] Add A* Algorithm with heuristics
- [ ] Implement maze generation algorithms
- [ ] Add diagonal movement option
- [ ] Include weighted edges visualization
- [ ] Add algorithm comparison mode

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Built to demonstrate proficiency in **Data Structures & Algorithms**.

---

<p align="center">
  <i>Finding the essence of the shortest path.</i>
</p>
