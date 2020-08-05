let canvas
let canvasContext
let n = 100
let line_width;
var cnt = 0
var a = new Array();
var cur_type = ""
var currently_running = false
var is_generated = false
function randomvalue(min,max){
    return Math.random() * (max - min) + min;
}

function random_array_gen(){
    cnt++
    n = slider.value
    line_width = canvas.width / n
    for(let i = 0; i < n; i++){
        a[i] = parseInt(randomvalue(1,canvas.height))
        // console.log(a[i])
    }
    draw(-1,-1,"green")
}

function swap(i,minindex){
    let temp = a[i];
    a[i] = a[minindex]
    a[minindex] = temp;
}

function generate_button(){
    currently_running = false
    is_generated = true
    random_array_gen()
}

function sort_function_caller(){
    type = document.getElementById('sort_type').value
    if(cur_type != "" && type != cur_type && is_generated == false){
        random_array_gen();
        cnt++;
    }
    currently_running = true
    if(cur_type == type && is_generated == false){
        return
    }
    cur_type = type
    is_generated = false
    if(type == 'bubble'){
        bubblesort()
    }
    else if(type == 'selection'){
        selectionsort()
    }
    else if(type == 'insertion'){
        insertion_sort()
    }
}

function draw(aa,bb,color1,color2){
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    // canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    // console.log(n)
    for(let ii = 0; ii < n; ii++){
        if(ii == aa){
            canvasContext.fillStyle = color1;
        }
        else if(ii == bb){
            canvasContext.fillStyle = color2;
        }
        else{
            canvasContext.fillStyle = 'white'
        }
        canvasContext.fillRect(ii * line_width,canvas.height - a[ii],line_width - 1 ,a[ii])
    }
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
    document.getElementById('slider_value').innerHTML = slider.value
    // console.log(slider.value)
    random_array_gen();
}

window.onload = function(){
    canvas = document.getElementById('maincanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    canvasContext.fillRect(0,0,canvas.width,canvas.height)

    random_array_gen();

    console.log('Window Loaded and canvas ready');
}
function bubblesort() {
    let i = 0,j = 0,oldcnt= cnt
    var bubblerepeat = setInterval(() => {
        if(currently_running == true){
            if(i >= n || cnt != oldcnt){
                draw(-1,-1,"green","green")
                clearInterval(bubblerepeat);
            }
            j = j + 1
            if(j >= n - i - 1){
                i = i + 1
                j = 0
            }
            draw(j,j + 1,"red","red")
            if(j + 1 < n && i < n && a[j] > a[j + 1]) {
                swap(j,j + 1)
                // let temp = a[j]
                // a[j] = a[j + 1]
                // a[j + 1] = temp
                draw(j,j + 1,"red","red")
            }  
            if(i >= n) {
                draw(-1,-1,"green","green")
                console.log('Bubble sort Completed')
            }
            cur_type = "bubble"
        }
    }, 1000/300);
}


function selectionsort() {
    let i = 0, j = 0,min_index = 0,oldcnt = cnt
    var selectionrepeat = setInterval(()=>{
        // console.log('came')
        if(currently_running == true){
            if(i >= n || oldcnt != cnt){
                draw(-1,-1,"green","green")
                clearInterval(selectionrepeat);
            }
            j = j + 1
            if(j >= n){
                swap(i,min_index);
                draw(i,min_index,"red","green")
                i = i + 1
                min_index = i
                j = i
            }
            if(j < n)
                draw(j,min_index,"red","green")
            if(j < n && a[j] < a[min_index])
                min_index = j;
            if(i >= n){
                draw(-1,-1,"green","green")
                console.log("Selection sort completed : ")
            }
            cur_type = "selection"
        }
    },1000/300);
}

function insertion_sort(){
    let i = 0, j = -1,oldcnt = cnt;
    a[n + 1] = a[0]
    var insertionrepeat = setInterval(() => {
        if(currently_running == true){
            if(i >= n || oldcnt != cnt){
                draw(-1,-1,"green","green");
                clearInterval(insertionrepeat);
            }
            console.log(a[i]+ " " + a[j])
            if(i < n && j >= 0 && a[j] > a[n + 1]){
                swap(j,j + 1);
                draw(j + 1,i,"red","green");
                j--;
            }
            else if(i < n){
                swap(n + 1,j + 1);
                draw(j + 1,i,"red","green");
                i++;
                a[n + 1] = a[i]
                j = i - 1;
            }
            if(i >= n){
                draw(-1,-1,"green","green");
                console.log("Insertion sort completed : ");
            }
            cur_type = "insertion";
        }
    },1000/300);
}


document.getElementById('generate_button').addEventListener('click',generate_button);
document.getElementById('sort_button').addEventListener('click',sort_function_caller);
document.getElementById('stop_button').addEventListener('click',function(){
    currently_running = false
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