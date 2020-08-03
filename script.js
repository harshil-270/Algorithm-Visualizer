var canvas
var canvasContext
const n = 15
let line_width;
function randomvalue(min,max){
    return Math.random() * (max - min) + min;
}
function draw(a,aa,bb){
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    for(let ii = 0; ii < n; ii++){
        if(ii == aa || ii == bb){
            canvasContext.fillStyle = 'red'
        }
        else{
            canvasContext.fillStyle = 'white'
        }
        canvasContext.fillRect(ii * line_width,canvas.height - a[ii],line_width - 1 ,a[ii])
    }
}
window.onload = function() {
    console.log('Page Loaded  : ');
    canvas = document.getElementById('maincanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    let a = new this.Array();
    for(let i = 0; i < n; i++){
        a[i] = parseInt(randomvalue(0,canvas.height))
    }
    line_width = canvas.width / n
    console.log('Line width : ' + line_width)
    // for(let i = 0; i < n; i++){
    //     canvasContext.fillStyle = 'white'
    //     console.log(a[i])
    //     canvasContext.fillRect(i * line_width,0,line_width ,a[i])
    // }
    let i = 0
    let j = 0
    var repeat = setInterval(() => {
        if(i >= n){
            draw(a,-1,-1)
            clearInterval(repeat);
        }
        j = j + 1
        if(j >= n - i - 1){
            i = i + 1
            j = 0
        }
        if(j + 1 < n && a[j] > a[j + 1]){
            let temp = a[j]
            a[j] = a[j + 1]
            a[j + 1] = temp
        }      
        draw(a,j,j + 1)
        if(i >= n){
            draw(a,-1,-1)
            console.log('Completed')
        }
    }, 1000/10);
}