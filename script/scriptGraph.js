let rows = 20,cols = 40;
let mouseIsDown = false;

let grid = new Array(rows);
let data = new Array(rows);

for(let i = 0; i < rows; i++){
    grid[i] = new Array(cols).fill(0);
    data[i] = new Array(cols);
}

let currentlyRunning = false;
let foundPath = false;

let startingPointX = 9;
let startingPointY = 14;
let endingPointX = 9;
let endingPointY = 24;



class PriorityQueue {
    constructor(defaultNode, comparator) {
        this.values = [] ;
        this.comparator = comparator ; 
        this.defaultNode = defaultNode;
    }
    add(element) {
        this.values.push(element) ;
        let index = this.values.length - 1;
        while (index >= 1 && this.comparator(this.values[index], this.values[ Math.floor(index / 2) ] ) ) {
            [this.values[index], this.values[Math.floor(index / 2) ]] = [this.values[Math.floor(index / 2) ], this.values[index]] ;
            index = Math.floor(index / 2) ;
        }
    }
    getTop() {
        if (this.isEmpty()) return "No elements in priority queue" ;
        return this.values[0] ;
    }
    pop() {
        if (this.isEmpty())return "Underflow";
        [this.values[0], this.values[this.values.length - 1]] = [this.values[this.values.length - 1], this.values[0]] ;
        this.values.pop();
        
        let element = this.values[0];
        let index = 0;
        while(index * 2 + 1 < this.values.length) {
            let leftNode = this.defaultNode;
            let rightNode = this.defaultNode;
            if (index * 2 + 1 < this.values.length) leftNode = this.values[index * 2 + 1] ;
            if (index * 2 + 2 < this.values.length) rightNode = this.values[index * 2 + 2];
            
            if (this.comparator(element, rightNode) && this.comparator(element, leftNode) ) break;
            if (index * 2 + 2 === this.values.length || this.comparator(leftNode, rightNode)) {
                [this.values[index], this.values[index * 2 + 1]] = [this.values[index * 2 + 1], this.values[index]] ;
                index = index * 2 + 1;
            } else {
                [this.values[index], this.values[index * 2 + 2]] = [this.values[index * 2 + 2], this.values[index]] ;
                index = index * 2 + 2;
            }
        }
    }
    isEmpty() {
        return (this.values.length === 0);
    }
}


class Queue { 
    constructor() {
        this.values = []; 
    }
    enqueue(element){
        this.values.push(element); 
    }
    dequeue(){
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.values.shift(); 
    }
    front(){
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.values[0]; 
    }
    isEmpty(){
        return this.values.length == 0; 
    }
}





var grid_manager = clickableGrid(rows,cols,function(el,row,col,i){
    if(row == startingPointX && col == startingPointY){

    }
    else if(row == endingPointX && col == endingPointY){

    }
    else if(el.className == 'clicked'){
        el.className = '';
        grid[row][col] = 0;
    }
    else{
        el.className = 'clicked';
        grid[row][col] = 1;
    }
});

document.getElementById('container').appendChild(grid_manager);

document.querySelector('html').addEventListener('mousedown', function() { 
    mouseIsDown = 1;
});
document.querySelector('html').addEventListener('mouseup', function() {
    mouseIsDown = 0;
});

function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';

    // grid.addEventListener('mousedown', function() { 
    //     mouseIsDown = 1;
    // });
    // grid.addEventListener('mouseup', function() {
    //     mouseIsDown = 0;
    // });
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            if(r == startingPointX && c == startingPointY){
                cell.className = 'start_point';
            }
            else if(r == endingPointX && c == endingPointY){
                cell.className = 'end_point';
            }
            cell.addEventListener('mouseover',(function(el,r,c,i){
                data[r][c] = el;
                return function(){
                    if(mouseIsDown){
                        callback(el,r,c,i);
                    }
                }
            })(cell,r,c,i),false);
            cell.addEventListener('mousedown',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}


function isValid(x, y) {
    return (x >= 0 && y >= 0 && x < rows && y < cols) ;
}

function printPath(path){
    console.log("Algorithm finished. Printing path");
    if(currentlyRunning === false) {
        console.log('')
    }
    if(foundPath === false) {
        console.log('No path exist') ;
        return ;
    }

    let s = "";
    
    let curi = endingPointX;
    let curj = endingPointY;
    
    while( ! (curi == startingPointX && curj == startingPointY) ){
        if(path[curi][curj] == "D"){
            s += "U";
            curi++;
        }
        else if(path[curi][curj] == "U"){
            s += "D";
            curi--;
        }
        else if(path[curi][curj] == "L"){
            s += "R";
            curj--;
        }
        else if(path[curi][curj] == "R"){
            s += "L";
            curj++;
        }
    }
    s = s.split("").reverse().join("");
    console.log(s);

    curi = startingPointX;
    curj = startingPointY;
    let i = 0;
    
    let speed = 20;
    if(s.length > 50)
        speed = 40;
    let pathrepeater = setInterval(() => {
        curi += (s[i] == "D");
        curi -= (s[i] == "U");
        curj += (s[i] == "R");
        curj -= (s[i] == "L");
        data[curi][curj].className = 'path';
        i++;
        
        if(currentlyRunning === false){
            clearInterval(pathrepeater);
        }
        if(i >= s.length - 1){
            currentlyRunning = false;
            clearInterval(pathrepeater);
        }
    },1000/speed);
}

function BFS(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(data[i][j].className == 'visited' || data[i][j].className == 'path'){
                data[i][j].className = '';
            }
        }
    }
    let vis = new Array(rows);
    let path = new Array(rows);
    for(let i = 0; i < rows; i++){
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill("0");
    }

    let q = new Queue();
    q.enqueue([startingPointX,startingPointY]);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = "1";
    

    let dx = [1,0,-1,0] ;
    let dy = [0,1,0,-1] ;
    let direction = ["U", "L", "D", "R"] ;

    let bfsRepeater = setInterval(() => {

        let p = q.front();
        q.dequeue();
        let x = p[0];
        let y = p[1];
        
        if(x == endingPointX && y == endingPointY){
            clearInterval(bfsRepeater);
            foundPath = true;    
            printPath(path);
        }
        else if( ! (x == startingPointX && y == startingPointY)){
            data[x][y].className = 'visited';
        }

        for (let i = 0; i < 4; i++) {
            let newX = x + dx[i];
            let newY = y + dy[i];
            if(isValid(newX, newY) && grid[newX][newY] === 0 && vis[newX][newY] === 0){
                q.enqueue([newX, newY]);
                vis[newX][newY] = 1;
                path[newX][newY] = direction[i];
            }
        }
        if(currentlyRunning === false){
            clearInterval(bfsRepeater);
        }
        if(q.isEmpty() == 1){
            clearInterval(bfsRepeater);
            currentlyRunning = false;
        }
    },1000/70);
}

function DFS(){    
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(data[i][j].className == 'visited' || data[i][j].className == 'path'){
                data[i][j].className = '';
            }
        }
    }
    let vis = new Array(rows);
    let path = new Array(rows);
    for(let i = 0; i < rows; i++){
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill("0");
    }

    let s = [];
    s.push([startingPointX,startingPointY]);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = "1";
    

    let dx = [0,-1,0,1] ;
    let dy = [-1,0,1,0] ;
    let direction = ["R", "D", "L", "U"] ;


    let dfsRepeater = setInterval(() => {
        //get top of element of stack
        let p = s[s.length - 1];
        s.pop();
        let x = p[0];
        let y = p[1];
        
        //if dfs is completed then print the path
        if(x == endingPointX && y == endingPointY){
            clearInterval(dfsRepeater);
            foundPath = true;
            printPath(path);
        }

        //change visual of current cell. we visited it.
        else if(! (x == startingPointX && y == startingPointY)){
            data[x][y].className = 'visited';
        }

        for (let i = 0; i < 4; i++) {
            let newX = x + dx[i];
            let newY = y + dy[i];
            if(isValid(newX, newY) && grid[newX][newY] === 0 && vis[newX][newY] === 0){
                s.push([newX, newY]);
                vis[newX][newY] = 1;
                path[newX][newY] = direction[i];
            }
        }

        if(s.length === 0){
            clearInterval(dfsRepeater);
            currentlyRunning = false;
        }
        if(currentlyRunning === false) {
            clearInterval(dfsRepeater) ;
        }
    },1000/70);
}

function findDistance(sx, sy, fx, fy) {
    return Math.abs(fx - sx) + Math.abs(fy - sy) ;
}

function AStarComparator(x, y) {
    if(x.f !== y.f) 
        return x.f < y.f;
    else 
        return x.h < y.h;
}

function AStar() {
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(data[i][j].className == 'visited' || data[i][j].className == 'path'){
                data[i][j].className = '';
            }
        }
    }
    let vis = new Array(rows);
    let path = new Array(rows);
    let fValue = new Array(rows);
    for(let i = 0; i < rows; i++){
        vis[i] = new Array(cols).fill(0);
        path[i] = new Array(cols).fill("0");
        fValue[i] = new Array(cols).fill(-1) ;
    }

    let defaultNode = {
        g: Number.MAX_SAFE_INTEGER,
        h: Number.MAX_SAFE_INTEGER,
        f: Number.MAX_SAFE_INTEGER,
        x: -1,
        y: -1
    }
    let pq = new PriorityQueue(defaultNode, AStarComparator);

    let newNode = defaultNode;
    newNode.g = 0;
    newNode.h = findDistance(startingPointX, startingPointY, endingPointX, endingPointY);
    newNode.f = newNode.g + newNode.h;
    newNode.x = startingPointX;
    newNode.y = startingPointY;
    pq.add(newNode);
    vis[startingPointX][startingPointY] = 1;
    path[startingPointX][startingPointY] = "1";
    
    let dx = [1,0,-1,0] ;
    let dy = [0,1,0,-1] ;
    let direction = ["U", "L", "D", "R"] ;

    let AStarRepeater = setInterval(() => {
        let p = pq.getTop();
        pq.pop();
        let x = p.x;
        let y = p.y;
        
        if(x == endingPointX && y == endingPointY){
            clearInterval(AStarRepeater);
            foundPath = true;    
            printPath(path);
        }
        else if( ! (x == startingPointX && y == startingPointY)){
            data[x][y].className = 'visited';
        }
        for (let i = 0; i < 4; i++) {
            let newX = x + dx[i];
            let newY = y + dy[i];
            if(isValid(newX, newY) && grid[newX][newY] === 0 && vis[newX][newY] === 0){
                let newNode = {};
                newNode.g = p.g + 1;
                newNode.h = findDistance(newX, newY, endingPointX, endingPointY) ;
                newNode.f = newNode.g + newNode.h;
                newNode.x = newX;
                newNode.y = newY;
                pq.add(newNode);
                vis[newX][newY] = 1;
                path[newX][newY] = direction[i];
            }
        }
        
        if(currentlyRunning === false){
            clearInterval(AStarRepeater);
        }
        if(pq.isEmpty() == 1){
            clearInterval(AStarRepeater);
            currentlyRunning = false;
        }
    },1000 / 70);
} 

function algorithmCaller(){
    if(currentlyRunning == true){
        return ;
    }
    type = document.getElementById('algorithm_type').value
    currentlyRunning = true;
    foundPath = false;
    if(type == 'dfs') {
        DFS();
    }
    else if(type == 'bfs') {
        BFS();
    } 
    else if(type == 'a*') {
        AStar() ;
    }
}


function clearGrid(){
    currentlyRunning = false;
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if((i == startingPointX && j == startingPointY) || (i == endingPointX && j == endingPointY));
            else{
                data[i][j].className = '';
            }
            grid[i][j] = 0;
        }
    }
}

document.getElementById('visualize_button').addEventListener('click',algorithmCaller);
document.getElementById('clear_button').addEventListener('click',clearGrid);
