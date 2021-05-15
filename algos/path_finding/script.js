let rows = 19,
    cols = 44;
let mouseIsDown = false;

let isBlocked = new Array(rows);
let data = new Array(rows);

for (let i = 0; i < rows; i++) {
    isBlocked[i] = new Array(cols).fill(0);
    data[i] = new Array(cols);
}

let currentlyRunning = false;
let foundPath = false;

let startingPointX = 9;
let startingPointY = 15;
let endingPointX = 9;
let endingPointY = 27;

let speed = 10;

class PriorityQueue {
    constructor(defaultNode, comparator) {
        this.values = [];
        this.comparator = comparator;
        this.defaultNode = defaultNode;
    }
    add(element) {
        this.values.push(element);
        let index = this.values.length - 1;
        while (index >= 1 && this.comparator(this.values[index], this.values[Math.floor(index / 2)])) {
            [this.values[index], this.values[Math.floor(index / 2)]] = [this.values[Math.floor(index / 2)], this.values[index]];
            index = Math.floor(index / 2);
        }
    }
    getTop() {
        if (this.isEmpty()) return 'No elements in priority queue';
        return this.values[0];
    }
    pop() {
        if (this.isEmpty()) return 'Underflow';
        [this.values[0], this.values[this.values.length - 1]] = [this.values[this.values.length - 1], this.values[0]];
        this.values.pop();

        let element = this.values[0];
        let index = 0;
        while (index * 2 + 1 < this.values.length) {
            let leftNode = this.defaultNode;
            let rightNode = this.defaultNode;
            if (index * 2 + 1 < this.values.length) leftNode = this.values[index * 2 + 1];
            if (index * 2 + 2 < this.values.length) rightNode = this.values[index * 2 + 2];

            if (this.comparator(element, rightNode) && this.comparator(element, leftNode)) break;
            if (index * 2 + 2 === this.values.length || this.comparator(leftNode, rightNode)) {
                [this.values[index], this.values[index * 2 + 1]] = [this.values[index * 2 + 1], this.values[index]];
                index = index * 2 + 1;
            } else {
                [this.values[index], this.values[index * 2 + 2]] = [this.values[index * 2 + 2], this.values[index]];
                index = index * 2 + 2;
            }
        }
    }
    isEmpty() {
        return this.values.length === 0;
    }
}

class Queue {
    constructor() {
        this.values = [];
    }
    enqueue(element) {
        this.values.push(element);
    }
    dequeue() {
        if (this.isEmpty()) return 'Underflow';
        return this.values.shift();
    }
    front() {
        if (this.isEmpty()) return 'No elements in Queue';
        return this.values[0];
    }
    isEmpty() {
        return this.values.length == 0;
    }
}

let grid = createGrid(rows, cols, function (el, row, col) {
    if (row == startingPointX && col == startingPointY) {
    } else if (row == endingPointX && col == endingPointY) {
    } else if (el.className == 'clicked') {
        el.className = '';
        isBlocked[row][col] = 0;
    } else {
        el.className = 'clicked';
        isBlocked[row][col] = 1;
    }
});

document.getElementById('container').appendChild(grid);

document.querySelector('html').addEventListener('mousedown', function () {
    mouseIsDown = 1;
});
document.querySelector('html').addEventListener('mouseup', function () {
    mouseIsDown = 0;
});

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    mouseIsDown = false;
    e.dataTransfer.setData('sourceId', e.target.id);
}

function drop(e) {
    e.preventDefault();
    let sourceId = e.dataTransfer.getData('sourceId');
    let targetId = e.target.id;

    var src = document.getElementById(sourceId);
    var tar = document.getElementById(targetId);
    let tarX = Number.parseInt(tar.id.substr(1, 2));
    let tarY = Number.parseInt(tar.id.substr(4, 2));
    if (!src || !tar) return;
    if (
        (src.className === 'startPoint' && tar.className === 'endPoint') ||
        (src.className === 'endPoint' && tar.className === 'startPoint')
    ) {
        [startingPointX, endingPointX] = [endingPointX, startingPointX];
        [startingPointY, endingPointY] = [endingPointY, startingPointY];
    } else {
        if (src.className === 'startPoint') {
            startingPointX = tarX;
            startingPointY = tarY;
        } else {
            endingPointX = tarX;
            endingPointY = tarY;
        }
        src.draggable = false;
        src.ondragstart = null;
        tar.draggable = true;
        tar.ondragstart = (e) => drag(e);
    }

    [src.className, tar.className] = [tar.className, src.className];
    [src.id, tar.id] = [tar.id, src.id];
}

function createGrid(rows, cols, callback) {
    let grid = document.createElement('table');
    grid.className = 'grid';

    for (let i = 0; i < rows; i++) {

        let tr = grid.appendChild(document.createElement('tr'));
        tr.ondrop = (e) => drop(e);
        tr.ondragover = (e) => allowDrop(e);

        for (let j = 0; j < cols; j++) {
            
            let cell = tr.appendChild(document.createElement('td'));
            // Unique ID for each cell. if row or cell number is single digit then put 0 infront of it.
            cell.id = 'r' + ('0'+i).slice(-2) + 'c' + ('0'+j).slice(-2);


            if (i == startingPointX && j == startingPointY) {
                cell.className = 'startPoint';
                cell.draggable = true;
                cell.ondragstart = (e) => drag(e);
            } else if (i == endingPointX && j == endingPointY) {
                cell.className = 'endPoint';
                cell.draggable = true;
                cell.ondragstart = (e) => drag(e);
            }

            data[i][j] = cell;
            cell.addEventListener('mouseover', () => {
                if (mouseIsDown) callback(cell, i, j);
            }, false);
            cell.addEventListener('mousedown',() => {
                callback(cell, i, j);
            }, false);
        }
    }
    return grid;
}

function isValid(x, y) {
    return x >= 0 && y >= 0 && x < rows && y < cols;
}

function printPath(path) {
    console.log('Algorithm finished. Printing path');
    if (foundPath === false) {
        console.log('No path exist');
        return;
    }

    let s = '';

    let curi = endingPointX;
    let curj = endingPointY;

    while (!(curi == startingPointX && curj == startingPointY)) {
        if (path[curi][curj] == 'D') {
            s += 'U';
            curi++;
        } else if (path[curi][curj] == 'U') {
            s += 'D';
            curi--;
        } else if (path[curi][curj] == 'L') {
            s += 'R';
            curj--;
        } else if (path[curi][curj] == 'R') {
            s += 'L';
            curj++;
        }
    }
    s = s.split('').reverse().join('');

    curi = startingPointX;
    curj = startingPointY;
    let i = 0;

    let pathInterval = setInterval(() => {
        curi += s[i] == 'D';
        curi -= s[i] == 'U';
        curj += s[i] == 'R';
        curj -= s[i] == 'L';
        data[curi][curj].className = 'path';
        i++;
        if (currentlyRunning === false) {
            clearInterval(pathInterval);
            clearGrid();
        }
        if (i >= s.length - 1) {
            currentlyRunning = false;
            clearInterval(pathInterval);
        }
    }, speed * 2.5);
}

function DijkstraComparator(a, b) {
    if (a.dis != b.dis) return a.dis < b.dis;
    return Math.abs(a.y - endingPointY) < Math.abs(b.y - endingPointY);
}

function Dijkstra() {
    let INF = 1000000000;
    let vis = new Array(rows);
    let path = new Array(rows);
    let dis = new Array(rows);
    for (let i = 0; i < rows; i++) {
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill('0');
        dis[i] = new Array(cols).fill(INF);
    }
    let defaultNode = {
        dis: INF,
        x: -1,
        y: -1,
    };

    let pq = new PriorityQueue(defaultNode, DijkstraComparator);

    let newNode = defaultNode;
    newNode.dis = 0;
    newNode.x = startingPointX;
    newNode.y = startingPointY;
    pq.add(newNode);
    dis[startingPointX][startingPointY] = 0;
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = '1';

    let dx = [1, 0, -1, 0];
    let dy = [0, 1, 0, -1];
    let direction = ['U', 'L', 'D', 'R'];

    let DijkstraInterval = setInterval(() => {
        let p = pq.getTop();
        pq.pop();
        let x = p.x;
        let y = p.y;

        if (x == endingPointX && y == endingPointY) {
            clearInterval(DijkstraInterval);
            foundPath = true;
            printPath(path);
        } else {
            if (!(x == startingPointX && y == startingPointY)) {
                data[x][y].className = 'visited';
            }
            for (let i = 0; i < 4; i++) {
                let newX = x + dx[i];
                let newY = y + dy[i];
                if (isValid(newX, newY) && isBlocked[newX][newY] === 0 && dis[x][y] + 1 < dis[newX][newY]) {
                    let newNode = {
                        dis: dis[x][y] + 1,
                        x: newX,
                        y: newY,
                    };
                    pq.add(newNode);
                    vis[newX][newY] = 1;
                    dis[newX][newY] = dis[x][y] + 1;
                    path[newX][newY] = direction[i];
                }
            }

            if (currentlyRunning === false) {
                clearInterval(DijkstraInterval);
                clearGrid();
            }
            if (pq.isEmpty() == 1) {
                clearInterval(DijkstraInterval);
                currentlyRunning = false;
            }
        }
    }, speed);
}

function BFS() {
    let vis = new Array(rows);
    let path = new Array(rows);
    for (let i = 0; i < rows; i++) {
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill('0');
    }

    let q = new Queue();
    q.enqueue([startingPointX, startingPointY]);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = '1';

    let dx = [1, 0, -1, 0];
    let dy = [0, 1, 0, -1];
    let direction = ['U', 'L', 'D', 'R'];

    let bfsInterval = setInterval(() => {
        let p = q.front();
        q.dequeue();
        let x = p[0];
        let y = p[1];

        if (x == endingPointX && y == endingPointY) {
            clearInterval(bfsInterval);
            foundPath = true;
            printPath(path);
        } else {
            if (!(x == startingPointX && y == startingPointY)) {
                data[x][y].className = 'visited';
            }

            for (let i = 0; i < 4; i++) {
                let newX = x + dx[i];
                let newY = y + dy[i];
                if (isValid(newX, newY) && isBlocked[newX][newY] === 0 && vis[newX][newY] === 0) {
                    q.enqueue([newX, newY]);
                    vis[newX][newY] = 1;
                    path[newX][newY] = direction[i];
                }
            }
            if (currentlyRunning === false) {
                clearInterval(bfsInterval);
                clearGrid();
            }
            if (q.isEmpty() == 1) {
                clearInterval(bfsInterval);
                currentlyRunning = false;
            }
        }
    }, speed);
}

function DFS() {
    let vis = new Array(rows);
    let path = new Array(rows);
    for (let i = 0; i < rows; i++) {
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill('0');
    }

    let s = [];
    s.push([startingPointX, startingPointY]);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = '1';

    let dx = [0, -1, 0, 1];
    let dy = [-1, 0, 1, 0];
    let direction = ['R', 'D', 'L', 'U'];

    let dfsInterval = setInterval(() => {
        //get top of element of stack
        let p = s[s.length - 1];
        s.pop();
        let x = p[0];
        let y = p[1];

        //if dfs is completed then print the path
        if (x == endingPointX && y == endingPointY) {
            clearInterval(dfsInterval);
            foundPath = true;
            printPath(path);
        } else {
            //change visual of current cell. we visited it.
            if (!(x == startingPointX && y == startingPointY)) {
                data[x][y].className = 'visited';
            }

            for (let i = 0; i < 4; i++) {
                let newX = x + dx[i];
                let newY = y + dy[i];
                if (isValid(newX, newY) && isBlocked[newX][newY] === 0 && vis[newX][newY] === 0) {
                    s.push([newX, newY]);
                    vis[newX][newY] = 1;
                    path[newX][newY] = direction[i];
                }
            }

            if (currentlyRunning === false) {
                clearInterval(dfsInterval);
                clearGrid();
            }
            if (s.length === 0) {
                clearInterval(dfsInterval);
                currentlyRunning = false;
            }
        }
    }, speed);
}

function findManhattanDistance(sx, sy, fx, fy) {
    return Math.abs(fx - sx) + Math.abs(fy - sy);
}

function AStarComparator(x, y) {
    return x.f < y.f;
}

function AStar() {
    let INF = 1000000000;
    let vis = new Array(rows);
    let path = new Array(rows);
    for (let i = 0; i < rows; i++) {
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill('0');
    }

    let defaultNode = {
        f: INF,
        x: -1,
        y: -1,
    };
    let pq = new PriorityQueue(defaultNode, AStarComparator);

    let newNode = defaultNode;
    newNode.f = findManhattanDistance(startingPointX, startingPointY, endingPointX, endingPointY);
    newNode.x = startingPointX;
    newNode.y = startingPointY;
    pq.add(newNode);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = '1';

    let dx = [1, 0, -1, 0];
    let dy = [0, 1, 0, -1];
    let direction = ['U', 'L', 'D', 'R'];

    let AStarInterval = setInterval(() => {
        let p = pq.getTop();
        pq.pop();
        let x = p.x;
        let y = p.y;

        if (x == endingPointX && y == endingPointY) {
            clearInterval(AStarInterval);
            foundPath = true;
            printPath(path);
        } else {
            if (!(x == startingPointX && y == startingPointY)) {
                data[x][y].className = 'visited';
            }
            for (let i = 0; i < 4; i++) {
                let newX = x + dx[i];
                let newY = y + dy[i];
                if (isValid(newX, newY) && isBlocked[newX][newY] === 0 && vis[newX][newY] === 0) {
                    let newNode = {};
                    newNode.f = findManhattanDistance(newX, newY, endingPointX, endingPointY);
                    newNode.x = newX;
                    newNode.y = newY;
                    pq.add(newNode);
                    vis[newX][newY] = 1;
                    path[newX][newY] = direction[i];
                }
            }

            if (currentlyRunning === false) {
                clearInterval(AStarInterval);
                clearGrid();
            }
            if (pq.isEmpty() == 1) {
                clearInterval(AStarInterval);
                currentlyRunning = false;
            }
        }
    }, speed + 4);
}

function removeVisitedCell() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (data[i][j].className == 'visited' || data[i][j].className == 'path') {
                data[i][j].className = '';
            }
        }
    }
}

function algorithmCaller() {
    if (currentlyRunning == true) {
        return;
    }
    type = document.getElementById('algorithm_type').value;
    currentlyRunning = true;
    foundPath = false;
    removeVisitedCell();
    if (type == 'dijkstra') {
        Dijkstra();
    } else if (type == 'a*') {
        AStar();
    } else if (type == 'bfs') {
        BFS();
    } else if (type == 'dfs') {
        DFS();
    }
}

function clearGrid() {
    currentlyRunning = false;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((i == startingPointX && j == startingPointY) || (i == endingPointX && j == endingPointY));
            else {
                data[i][j].className = '';
            }
            isBlocked[i][j] = 0;
        }
    }
}

document.getElementById('visualizeButton').addEventListener('click', algorithmCaller);
document.getElementById('clearButton').addEventListener('click', clearGrid);
