let canvas;
let canvasContext;
let n = 135;
let lineWidth;
let a = [];
let isStopped = false;
let isPaused = false;
let isGenerated = true;
let isSorted = false;
let slider = document.getElementById('myRange');

function randomvalue(min, max) {
    return Math.random() * (max - min) + min;
}

function randomArrayGenerator() {
    isGenerated = true;
    isSorted = false;
    isStopped = true;
    isPaused = false;
    n = slider.value;
    lineWidth = canvas.width / n;
    for (let i = 0; i < n; i++) {
        a[i] = parseInt(randomvalue(1, canvas.height));
    }
    draw(-1, -1, -1, -1, '', '', '', '');
}

function swap(i, minindex) {
    [a[i], a[minindex]] = [a[minindex], a[i]];
}

function sortAlgorithmCaller() {
    type = document.getElementById('sort_type').value;
    if (!isStopped) {
        return;
    }
    if (isSorted || !isGenerated) {
        randomArrayGenerator();
    }

    isGenerated = false;
    isPaused = false;
    isStopped = false;

    if (type == 'bubble') {
        bubbleSort();
    } else if (type == 'selection') {
        selectionSort();
    } else if (type == 'insertion') {
        insertionSort();
    } else if (type == 'merge') {
        mergeSort();
    } else if (type == 'quick') {
        quickSort();
    }
}

function draw(aa, bb, cc, dd, color1, color2, color3, color4) {
    canvasContext.fillStyle = 'rgba(35,50,65,1)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < n; i++) {
        if (i == aa) {
            canvasContext.fillStyle = color1;
        } else if (i == bb) {
            canvasContext.fillStyle = color2;
        } else if (i == cc) {
            canvasContext.fillStyle = color3;
        } else if (i == dd) {
            canvasContext.fillStyle = color4;
        } else {
            canvasContext.fillStyle = 'white';
        }
        canvasContext.fillRect(i * lineWidth, canvas.height - a[i], lineWidth - 1, a[i]);
    }
}

function SortedAnimation() {
    let i = 0;
    canvasContext.fillStyle = 'lime';
    let animation = setInterval(() => {
        canvasContext.fillRect(i * lineWidth, canvas.height - a[i], lineWidth - 1, a[i]);
        i++;
        if (i == n) {
            clearInterval(animation);

            i = 0;
            canvasContext.fillStyle = 'white';
            animation = setInterval(() => {
                canvasContext.fillRect(i * lineWidth, canvas.height - a[i], lineWidth - 1, a[i]);
                i++;
                if (i == n) {
                    clearInterval(animation);
                }
            }, 8);
        }
    }, 8);
}

slider.oninput = function () {
    document.getElementById('slider_value').innerHTML = slider.value;
    randomArrayGenerator();
};

window.onload = function () {
    canvas = document.getElementById('maincanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = 'rgba(35,50,65,1)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    randomArrayGenerator();

    console.log('Window Loaded and Canvas ready');
};

class Stack {
    constructor() {
        this.data = [];
        this.top = -1;
    }
    push(element) {
        this.top++;
        this.data[this.top] = element;
    }
    isEmpty() {
        return this.top == -1;
    }
    pop() {
        if (this.isEmpty() === false) {
            this.top = this.top - 1;
            return this.data.pop();
        }
    }
}

function bubbleSort() {
    let i = 0,
        j = 0;
    let bubblerepeat = setInterval(() => {
        if (isStopped) {
            clearInterval(bubblerepeat);
        } else if (isPaused == false) {
            j = j + 1;
            if (j >= n - i - 1) {
                i = i + 1;
                j = 0;
            }
            draw(j, j + 1, -1, -1, 'red', 'red', '', '');
            if (j + 1 < n && i < n && a[j] > a[j + 1]) {
                swap(j, j + 1);
                draw(j, j + 1, -1, -1, 'red', 'red', '', '');
            }
            if (i >= n) {
                draw(-1, -1, -1, -1, '', '', '', '');
                isSorted = true;
                isStopped = true;
                isPaused = false;
                clearInterval(bubblerepeat);
                console.log('Bubble sort Completed');
                SortedAnimation();
            }
        }
    }, 1000 / 300);
}

function selectionSort() {
    let i = 0,
        j = 0,
        min_index = 0;
    let selectionrepeat = setInterval(() => {
        if (isStopped) {
            clearInterval(selectionrepeat);
        } else if (isPaused == false) {
            j = j + 1;
            if (j >= n) {
                swap(i, min_index);
                draw(i, j, min_index, -1, 'blue', 'red', 'green', '');
                i = i + 1;
                min_index = i;
                j = i;
            }
            if (j < n) draw(i, j, min_index, -1, 'blue', 'red', 'green', '');
            if (j < n && a[j] < a[min_index]) min_index = j;
            if (i >= n) {
                draw(-1, -1, -1, -1, '', '', '', '');
                isSorted = true;
                isStopped = true;
                isPaused = false;
                clearInterval(selectionrepeat);
                console.log('Selection sort completed : ');
                SortedAnimation();
            }
        }
    }, 1000 / 300);
}

function insertionSort() {
    let i = 0,
        j = -1;
    a[n + 1] = a[0];
    let insertionrepeat = setInterval(() => {
        if (isStopped) {
            clearInterval(insertionrepeat);
        } else if (isPaused == false) {
            if (i < n && j >= 0 && a[j] > a[n + 1]) {
                swap(j, j + 1);
                draw(j, i, -1, -1, 'red', 'yellow', '', '');
                j--;
            } else if (i < n) {
                swap(n + 1, j + 1);
                draw(j, i, -1, -1, 'red', 'yellow', '', '');
                i++;
                a[n + 1] = a[i];
                j = i - 1;
            }
            if (i >= n) {
                draw(-1, -1, -1, -1, '', '', '', '');
                isSorted = true;
                isStopped = true;
                isPaused = false;
                clearInterval(insertionrepeat);
                console.log('Insertion sort completed : ');
                SortedAnimation();
            }
        }
    }, 1000 / 100);
}

function mergeSort() {
    let curr_size = 1;
    let l = 0,
        m = 0,
        r = 1;
    let i = 0,
        j = 0,
        k = l;
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = [];
    let R = [];
    for (i = 0; i < n1; i++) L.push(a[l + i]);
    for (j = 0; j < n2; j++) R.push(a[m + 1 + j]);

    i = 0;
    j = 0;
    k = l;

    let mergerepeat = setInterval(() => {
        if (isStopped) {
            clearInterval(mergerepeat);
        } else if (isPaused == false) {
            if (i >= n1 && j >= n2) {
                if (l + 2 * curr_size < n - 1) {
                    l += 2 * curr_size;
                    m = Math.min(l + curr_size - 1, n - 1);
                    r = Math.min(l + 2 * curr_size - 1, n - 1);
                } else {
                    if (2 * curr_size <= n - 1) {
                        curr_size = 2 * curr_size;
                        l = 0;
                        m = Math.min(l + curr_size - 1, n - 1);
                        r = Math.min(l + 2 * curr_size - 1, n - 1);
                    } else {
                        draw(-1, -1, -1, -1, '', '', '', '');
                        isSorted = true;
                        isStopped = true;
                        isPaused = false;
                        clearInterval(mergerepeat);
                        console.log('Merge Sort completed');
                        SortedAnimation();
                    }
                }
                n1 = m - l + 1;
                n2 = r - m;

                for (i = 0; i < n1; i++) L[i] = a[l + i];
                for (j = 0; j < n2; j++) R[j] = a[m + 1 + j];
                i = 0;
                j = 0;
                k = l;
            } else {
                if (i < n1 && j < n2) {
                    if (L[i] < R[j]) {
                        a[k] = L[i];
                        i++;
                    } else {
                        a[k] = R[j];
                        j++;
                    }
                    k++;
                } else if (i < n1) {
                    a[k] = L[i];
                    i++;
                    k++;
                } else if (j < n2) {
                    a[k] = R[j];
                    j++;
                    k++;
                }
                draw(k, -1, -1, -1, 'purple', '', '', '');
            }
        }
    }, 1000 / 125);
}

function quickSort() {
    let l = 0;
    let h = n - 1;
    let stack = new Stack();
    stack.push(l);
    stack.push(h);
    let j = 100000;
    let x = 0;
    let i = 0;
    let partition = 0;
    let calculated = 0;

    let quickrepeat = setInterval(() => {
        if (isStopped) {
            clearInterval(quickrepeat);
        } else if (isPaused == false) {
            if (calculated == 1 && j <= h - 1) {
                if (a[j] <= x) {
                    i++;
                    swap(i, j);
                }
                draw(i, j, -1, -1, 'red', 'red', '', '');
                j = j + 1;
            } else {
                if (!stack.isEmpty() || calculated == 1) {
                    if (calculated == 0) {
                        h = stack.pop();
                        l = stack.pop();
                        x = a[h];
                        i = l - 1;
                        j = l;
                        calculated = 1;
                    } else {
                        calculated = 0;
                        swap(i + 1, h);
                        partition = i + 1;
                        let p = partition;
                        if (p - 1 > l) {
                            stack.push(l);
                            stack.push(p - 1);
                        }
                        if (p + 1 < h) {
                            stack.push(p + 1);
                            stack.push(h);
                        }
                        j = 100000;
                    }
                } else {
                    draw(-1, -1, -1, -1, '', '', '', '');
                    isSorted = true;
                    isStopped = true;
                    isPaused = false;
                    clearInterval(quickrepeat);
                    console.log('Quick Sort completed : ');
                    SortedAnimation();
                }
            }
        }
    }, 1000 / 100);
}

document.getElementById('generateButton').addEventListener('click', randomArrayGenerator);
document.getElementById('sortButton').addEventListener('click', sortAlgorithmCaller);
document.getElementById('stopButton').addEventListener('click', () => {
    isStopped = true;
    isPaused = false;
    document.getElementById('pauseButton').innerHTML = 'Pause';
    if (!isGenerated && !isSorted) randomArrayGenerator();
});
document.getElementById('pauseButton').addEventListener('click', () => {
    if (!isStopped) {
        if (isPaused) {
            document.getElementById('pauseButton').innerHTML = 'Pause';
            isPaused = false;
        } else {
            document.getElementById('pauseButton').innerHTML = 'Resume';
            isPaused = true;
        }
    }
});
