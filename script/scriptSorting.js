let canvas
let canvasContext
let n = 135
let lineWidth;
var cnt = 0
var a = new Array();
var curType = ""
var currentlyRunning = false
var isGenerated = false
function randomvalue(min,max){
    return Math.random() * (max - min) + min;
}

function randomArrayGenerator(){
    cnt++
    n = slider.value
    lineWidth = canvas.width / n
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

function generateButton(){
    currentlyRunning = false
    isGenerated = true
    randomArrayGenerator()
}

function sortFunctionCaller(){
    type = document.getElementById('sort_type').value
    if(curType != "" && type != curType && isGenerated == false){
        randomArrayGenerator();
        cnt++;
    }
    // mySound.play()  
    currentlyRunning = true
    if(curType == type && isGenerated == false){
        return
    }
    curType = type;
    isGenerated = false;
    if(type == 'bubble'){
        bubbleSort();
    }
    else if(type == 'selection'){
        selectionSort();
    }
    else if(type == 'insertion'){
        insertionSort();
    }
    else if(type == 'merge'){
        mergeSort();
    }
    else if(type == 'quick'){
        quickSort();
    }
}

function draw(aa,bb,color1,color2){
    canvasContext.fillStyle = "rgba(35,50,65,1)";
    canvasContext.fillRect(0,0,canvas.width,canvas.height);
    
    for(let ii = 0; ii < n; ii++){
        if(ii == aa){
            canvasContext.fillStyle = color1;
        }
        else if(ii == bb){
            canvasContext.fillStyle = color2;
        }
        else{
            canvasContext.fillStyle = 'white';
        }
        canvasContext.fillRect(ii * lineWidth,canvas.height - a[ii],lineWidth - 1 ,a[ii])
    }
}

function draw2(aa,bb,cc,color1,color2,color3){
    canvasContext.fillStyle = "rgba(35,50,65,1)" ;
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    
    for(let ii = 0; ii < n; ii++){
        if(ii == aa){
            canvasContext.fillStyle = color1;
        }
        else if(ii == bb){
            canvasContext.fillStyle = color2;
        }
        else if(ii == cc){
            canvasContext.fillStyle = color3;
        }
        else{
            canvasContext.fillStyle = 'white';
        }
        canvasContext.fillRect(ii * lineWidth,canvas.height - a[ii],lineWidth - 1 ,a[ii])
    }
}
function draw3(aa,bb,cc,dd,color1,color2,color3,color4){
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    
    for(let ii = 0; ii < n; ii++){
        if(ii == aa){
            canvasContext.fillStyle = color1;
        }
        else if(ii == bb){
            canvasContext.fillStyle = color2;
        }
        else if(ii == cc){
            canvasContext.fillStyle = color3;
        }
        else if(ii == dd){
            canvasContext.fillStyle = color4;
        }
        else{
            canvasContext.fillStyle = 'white';
        }
        canvasContext.fillRect(ii * lineWidth,canvas.height - a[ii],lineWidth - 1 ,a[ii])
    }
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
    document.getElementById('slider_value').innerHTML = slider.value
    randomArrayGenerator();
    isGenerated = true;
}

window.onload = function(){
    canvas = document.getElementById('maincanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = "rgba(35,50,65,1)"
    canvasContext.fillRect(0,0,canvas.width,canvas.height)

    randomArrayGenerator();

    console.log('Window Loaded and canvas ready');
}

function bubbleSort(){
    let i = 0,j = 0,oldcnt= cnt
    var bubblerepeat = setInterval(() => {
        if(currentlyRunning == true){
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
                draw(j,j + 1,"red","red")
            }  
            if(i >= n) {
                draw(-1,-1,"green","green")
                console.log('Bubble sort Completed')
            }
            curType = "bubble"
        }
    }, 1000/300);
}

function selectionSort(){
    let i = 0, j = 0,min_index = 0,oldcnt = cnt
    var selectionrepeat = setInterval(()=>{
        if(currentlyRunning == true){
            if(i >= n || oldcnt != cnt){
                draw2(-1,-1,-1,"green","green","green")
                clearInterval(selectionrepeat);
            }
            j = j + 1
            if(j >= n){
                swap(i,min_index);
                draw2(i,j,min_index,"blue","red","green")
                i = i + 1
                min_index = i
                j = i
            }
            if(j < n)
                draw2(i,j,min_index,"blue","red","green")
            if(j < n && a[j] < a[min_index])
                min_index = j;
            if(i >= n){
                draw2(-1,-1,-1,"green","green","green")
                console.log("Selection sort completed : ")
            }
            curType = "selection"
        }
    },1000/300);
}

function insertionSort(){
    let i = 0, j = -1,oldcnt = cnt;
    a[n + 1] = a[0]
    var insertionrepeat = setInterval(() => {
        if(currentlyRunning == true){
            if(i >= n || oldcnt != cnt){
                draw(-1,-1,"green","green");
                clearInterval(insertionrepeat);
            }

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
            curType = "insertion";
        }
    },1000/300);
}

function mergeSort(){
    let curr_size = 1
    let left_start = 0
    let mid = 0
    let right_end = 1
    let l = left_start
    let m = mid
    let r = right_end
    let i = 0
    let j = 0
    let k = l
    let n1 = m - l + 1
    let n2 = r - m
    let L = new Array()
    let R = new Array()
    for (i = 0; i < n1; i++) {
        L[i] = a[l + i]; 
    }
    for (j = 0; j < n2; j++) 
        R[j] = a[m + 1+ j]; 
        console.log(n1)
    i = 0
    j = 0
    k = l
    let oldcnt = cnt
    
    var mergerepeat = setInterval(() => {
        if(currentlyRunning == true){
            if(oldcnt != cnt){
                draw(-1,-1,"green","green")
                clearInterval(mergerepeat)
            }
            else if(i >= n1 && j >= n2){
                if(left_start + 2 * curr_size < n - 1){
                    left_start += 2 * curr_size
                    mid = Math.min(left_start + curr_size - 1, n-1);
                    right_end = Math.min(left_start + 2*curr_size - 1, n-1); 
                }
                else{
                    if(2 * curr_size <= n - 1){
                        curr_size = 2 * curr_size
                        left_start = 0
                        mid = Math.min(left_start + curr_size - 1, n-1); 
                        right_end = Math.min(left_start + 2*curr_size - 1, n-1); 
                    }
                    else{
                        draw(-1,-1,"green","green")
                        console.log('Merge Sort completed')
                        clearInterval(mergerepeat)
                    }
                }

                l = left_start;
                m = mid
                r = right_end
                n1 = m - l + 1; 
                n2 = r - m;
    
                for (i = 0; i < n1; i++) 
                    L[i] = a[l + i]; 
                for (j = 0; j < n2; j++) 
                    R[j] = a[m + 1+ j]; 
                i = 0; 
                j = 0; 
                k = l; 
            }
            else{
                if(l == 0 && r == 1){
                    console.log(L,R)
                }
                if(i < n1 && j < n2){
                    if (L[i] < R[j]) { 
                        a[k] = L[i]; 
                        i++; 
                    } 
                    else { 
                        a[k] = R[j]; 
                        j++; 
                    } 
                    k++; 
                }    
                else if(i < n1){
                    a[k] = L[i]; 
                    i++; 
                    k++;
                }
                else if(j < n2){
                    a[k] = R[j]; 
                    j++; 
                    k++;
                }
                draw(k,-1,"red","red")
            }
            curType = 'merge'
        }
    },1000/150);

}

function quickSort(){
    let l = 0
    let h = n - 1
    let stack = new Array()
    let top = -1
    stack[++top] = l
    stack[++top] = h
    let j = 100000
    let x = 0;
    let i = 0;
    let partition = 0 ;
    let calculated = 0
    let oldcnt = cnt;
    var quickrepeat = setInterval(() => {
        if(currentlyRunning == true){
            if(oldcnt != cnt){
                draw3(-1,-1,-1,-1,"green","green","green","green")
                clearInterval(quickrepeat)
            }
            if(calculated == 1 && j <= h - 1){
                if(a[j] <= x){
                    i++;
                    swap(i,j)
                }
                draw3(-1,i,j,-1,"blue","red","red","blue")
                j = j + 1
            }
            else{
                if(top >= 0 || calculated == 1){
                    if(calculated == 0){
                        h = stack[top--]
                        l = stack[top--]
                        x = a[h]
                        i = l - 1
                        j = l
                        calculated = 1
                    }
                    else{
                        calculated = 0
                        swap(i + 1,h)
                        partition = i + 1
                        let p = partition;
                        if(p - 1 > l){
                            stack[++top] = l
                            stack[++top] = p - 1
                        }
                        if(p + 1 < h){
                            stack[++top] = p + 1;
                            stack[++top] = h;
                        }
                        j = 100000
                    }
                }
                else{
                    draw3(-1,-1,-1,-1,"green","green","green","green")
                    console.log('Quick Sort completed : ')
                    clearInterval(quickrepeat)
                }
            }
        }
    },1000/100);
}

document.getElementById('generateButton').addEventListener('click', generateButton);
document.getElementById('sortButton').addEventListener('click', sortFunctionCaller);
document.getElementById('stopButton').addEventListener('click', function() {
    currentlyRunning = false ;
});
