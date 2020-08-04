let canvas
let canvasContext
let n = 100
let line_width;
var cnt = 0
var a = new Array();


function randomvalue(min,max){
    return Math.random() * (max - min) + min;
}
function draw(a,aa,bb,color){
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    // canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    console.log(n)
    for(let ii = 0; ii < n; ii++){
        if(ii == aa || ii == bb){
            canvasContext.fillStyle = color
        }
        else{
            canvasContext.fillStyle = 'white'
        }
        // console.log(a[ii])
        canvasContext.fillRect(ii * line_width,canvas.height - a[ii],line_width - 1 ,a[ii])
    }
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
    document.getElementById('slider_value').innerHTML = slider.value
    // console.log(slider.value)
    cnt++
    n = slider.value
    line_width = canvas.width / n
    for(let i = 0; i < n; i++){
        a[i] = parseInt(randomvalue(1,canvas.height))
        console.log(a[i])
    }
    draw(a,-1,-1,"green")
}

window.onload = function(){
    canvas = document.getElementById('maincanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    canvasContext.fillRect(0,0,canvas.width,canvas.height)

    n = slider.value
    line_width = canvas.width / n
    for(let i = 0; i < n; i++){
        a[i] = parseInt(randomvalue(1,canvas.height))
        // console.log(a[i])
    }
    draw(a,-1,-1,"green")
    console.log('came');
}
function bubblesort() {
    cnt++;
    // console.log(slider.value)
    
    
    let i = 0,j = 0,oldcnt= cnt
    var repeat = setInterval(() => {
        console.log(cnt)
        if(i >= n || cnt != oldcnt){
            draw(a,-1,-1,"green")
            clearInterval(repeat);
        }
        j = j + 1
        if(j >= n - i - 1){
            i = i + 1
            j = 0
        }
        draw(a,j,j + 1,"red")
        if(j + 1 < n && i < n && a[j] > a[j + 1]) {
            let temp = a[j]
            a[j] = a[j + 1]
            a[j + 1] = temp
            draw(a,j,j + 1,"red")
        }  
        if(i >= n) {
            draw(a,-1,-1,"green")
            console.log('Completed')
        }
    }, 1000/300);
}

document.getElementById('sort_button').addEventListener('click',bubblesort);
document.getElementById('stop_button').addEventListener('click',function(){
    cnt++;
});

// bubble sort not working
// for(i = 0; i < n; i++){
//     for(j = 0; j < n - i - 1; j++){
//         if(a[j] > a[j + 1]){
//             draw(a,j,j + 1)
//             setTimeout(() => {
//                 let temp = a[j]
//                 a[j] = a[j + 1]
//                 a[j + 1] = temp
//                 cnt++;
//             }, 100);
//             draw(a,j,j + 1)
//         }
//     }
// }