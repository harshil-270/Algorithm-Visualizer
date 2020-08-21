var lastClicked;
let rows = 20,cols = 40;
let mouseIsDown = false;
let grid = new Array(rows);
let data = new Array(rows);
let cnt = 0;
for(let i = 0; i < rows; i++){
    grid[i] = new Array(cols).fill(0);
    data[i] = new Array(cols);
}

let starting_point_i = 9;
let starting_point_j = 14;
let ending_point_i = 9;
let ending_point_j = 24;

class Queue
{ 
    constructor(){
        this.items = []; 
    }
    enqueue(element){
        this.items.push(element); 
    }

    dequeue(){
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    }
    front(){
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    }
    isEmpty(){
        return this.items.length == 0; 
    }
    printQueue(){
        var str = ""; 
        for(var i = 0; i < this.items.length; i++) 
            str += this.items[i] +" "; 
        return str; 
    }
}




var grid_manager = clickableGrid(rows,cols,function(el,row,col,i){
    if(row == starting_point_i && col == starting_point_j){

    }
    else if(row == ending_point_i && col == ending_point_j){

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

function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';

    grid.addEventListener('mousedown', function() { 
        mouseIsDown = 1;
    });
    grid.addEventListener('mouseup', function() {
        mouseIsDown = 0;
    });
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            if(r == starting_point_i && c == starting_point_j){
                cell.className = 'start_point';
            }
            else if(r == ending_point_i && c == ending_point_j){
                cell.className = 'end_point';
            }
            // cell.innerHTML = ++i;
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


function clear_grid(){
    cnt++;
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if((i == starting_point_i && j == starting_point_j) || (i == ending_point_i && j == ending_point_j));
            else{
                data[i][j].className = '';
            }
            grid[i][j] = 0;
        }
    }
}

function printpath(path){
    console.log("bfs done. Printing path");
    let s = "";
    let curi = ending_point_i;
    let curj = ending_point_j;
    let cnt = 0;
    // console.log(path);
    while( !(curi == starting_point_i && curj == starting_point_j) ){
        // console.log(curi,curj);
        cnt++;
        if(cnt >= rows * cols){
            console.log("didn't finished")
            break;
        }
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
    curi = starting_point_i;
    curj = starting_point_j;
    let i = 0;
    let oldcnt = cnt;
    let pathrepeater = setInterval(() => {
        if(cnt != oldcnt){
            clearInterval(pathrepeater)
        }
        curi += (s[i] == "D");
        curi -= (s[i] == "U");
        curj += (s[i] == "R");
        curj -= (s[i] == "L");
        data[curi][curj].className = 'path';
        i++;
        if(i >= s.length - 1){
            clearInterval(pathrepeater);
        }
    },1000/20);
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
    q.enqueue([starting_point_i,starting_point_j]);
    vis[starting_point_i][starting_point_j] = 1;
    path[starting_point_i][starting_point_j] = "1";
    let oldcnt = cnt;
    let bfsrepeater = setInterval(() => {
        if(oldcnt != cnt){
            clearInterval(bfsrepeater)
        }
        let p = q.front();
        q.dequeue();
        let i = p[0];
        let j = p[1];
        console.log(i,j);
        if(i == ending_point_i && j == ending_point_j){
            clearInterval(bfsrepeater);
            
            printpath(path);
        }
        else if(!(i == starting_point_i && j == starting_point_j)){
            data[i][j].className = 'visited';
        }
        if(i < rows - 1 && grid[i + 1][j] === 0 && vis[i + 1][j] === 0){
            q.enqueue([i + 1,j]);
            vis[i + 1][j] = 1;
            path[i + 1][j] = "U";
        }
        if(j < cols - 1 && grid[i][j + 1] === 0 && vis[i][j + 1] === 0){
            q.enqueue([i,j + 1]);
            vis[i][j + 1] = 1;
            path[i][j + 1] = "L";
        }
        if(i > 0 && grid[i - 1][j] === 0 && vis[i - 1][j] === 0){
            q.enqueue([i - 1,j]);
            vis[i - 1][j] = 1;
            path[i - 1][j] = "D";
        }
        if(j > 0 && grid[i][j - 1] === 0 && vis[i][j - 1] === 0){
            q.enqueue([i,j - 1]);
            vis[i][j - 1] = 1;
            path[i][j - 1] = "R";
        }
        
        
    
    },1000/60);
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
    s.push([starting_point_i,starting_point_j]);
    vis[starting_point_i][starting_point_j] = 1;
    path[starting_point_i][starting_point_j] = "1";
    let oldcnt = cnt;
    let dfsrepeater = setInterval(() => {
        if(oldcnt != cnt){
            clearInterval(dfsrepeater);
        }
        let p = s[s.length - 1];
        s.pop();
        let i = p[0];
        let j = p[1];
        
        if(i == ending_point_i && j == ending_point_j){
            clearInterval(dfsrepeater);
            
            printpath(path);
        }
        else if(!(i == starting_point_i && j == starting_point_j)){
            data[i][j].className = 'visited';
        }
        if(j > 0 && grid[i][j - 1] === 0 && vis[i][j - 1] === 0){
            s.push([i,j - 1]);
            vis[i][j - 1] = 1;
            path[i][j - 1] = "R";
        }
        if(j < cols - 1 && grid[i][j + 1] === 0 && vis[i][j + 1] === 0){
            s.push([i,j + 1]);
            vis[i][j + 1] = 1;
            path[i][j + 1] = "L";
        }
        if(i < rows - 1 && grid[i + 1][j] === 0 && vis[i + 1][j] === 0){
            s.push([i + 1,j]);
            vis[i + 1][j] = 1;
            path[i + 1][j] = "U";
        }
        if(i > 0 && grid[i - 1][j] === 0 && vis[i - 1][j] === 0){
            s.push([i - 1,j]);
            vis[i - 1][j] = 1;
            path[i - 1][j] = "D";
        }
    },1000/60);
}

function algorithm_caller(){
    type = document.getElementById('algorithm_type').value
    cnt++;
    if(type == 'dfs'){
        DFS();
    }
    else if(type == 'bfs'){
        BFS();
    }
}

document.getElementById('visualize_button').addEventListener('click',algorithm_caller);
document.getElementById('clear_button').addEventListener('click',clear_grid);
