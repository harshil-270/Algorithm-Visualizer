// prerequisite: javascript, d3.js

// structure of node
// {
//     id: number <--- unique id for each node. it will be also used as id for html element of node.
//     value: character <-- this will store value of current node.
//     children: [] <--- this array will store left and right of node
// }

let data = { value: null, children: [] };
let curId = 1; // current availabel id.

const width = Math.max(100, window.innerWidth - 50);
const height = Math.max(100, window.innerHeight - 100);
const nodeRadius = 20;
const LinkStroke = 4;
const animationDuration = 500;
const padding = 22;

let treemap = d3.tree().size([width, height]);
let g = d3.select('.Canvas').append('svg').append('g');

// during insertion or deletion visualization process disbale the buttons
function freezeButtons() {
    document.getElementById('InsertButton').disabled = true;
    document.getElementById('DeleteButton').disabled = true;
}
function unfreezeButtons() {
    document.getElementById('InsertButton').disabled = false;
    document.getElementById('DeleteButton').disabled = false;
}
// to put delay between visualization.
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function update(oldData, newData, parentId, childId) {
    // childVakue is node we want to delete and parentValue is parent of node we want to delete
    /*
        find the co-ordinates of old tree;
        fint the co-ordinates of new updated tree;
        put tree on old co-ordinates
        animate nodes and links to the new co-ordinates
    */

    // get the old and new tree
    let oldTree = treemap(d3.hierarchy(oldData, (d) => d.children));
    let newTree = treemap(d3.hierarchy(newData, (d) => d.children));

    // convert both tres from objects to array
    let oldTreeArray = oldTree.descendants();
    let newTreeArray = newTree.descendants();

    for (let i = 0; i < newTreeArray.length; i++) {
        let oldPosition = {};
        for (let j = 0; j < oldTreeArray.length; j++) {
            if (newTreeArray[i].data.id == childId) {
                if (oldTreeArray[j].data.id == parentId) {
                    oldPosition = oldTreeArray[j];
                }
            } else {
                if (oldTreeArray[j].data.id == newTreeArray[i].data.id) {
                    oldPosition = oldTreeArray[j];
                }
            }
        }
        newTreeArray[i].oldX = oldPosition.x || 0;
        newTreeArray[i].oldY = (oldPosition.y || 0) + padding;
        newTreeArray[i].y += padding;
    }

    d3.select('.Canvas > svg g').remove();
    d3.select('.Canvas > svg').append('g');

    let allLinks = [];
    for (let i = 0; i < newTreeArray.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (newTreeArray[i].data.value != null && newTreeArray[i].children[j].data.value != null) {
                allLinks.push({
                    parent: newTreeArray[i],
                    child: newTreeArray[i].children[j],
                });
            }
        }
    }

    for (let i = 0; i < 2; i++) {
        let lineId = '';
        if (!i) lineId = 'Under';
        let links = d3
            .select('.Canvas > svg g')
            .selectAll('g.link')
            .data(allLinks)
            .enter()
            .append('g')
            .append('line')
            .attr('id', (d) => `${lineId}link_Source_${d.parent.data.id}_Dest_${d.child.data.id}`)
            .attr('stroke-width', LinkStroke)
            .attr('stroke', 'black')
            .attr('x1', (d) => d.parent.oldX)
            .attr('y1', (d) => d.parent.oldY)
            .attr('x2', (d) => d.child.oldX)
            .attr('y2', (d) => d.child.oldY);

        links
            .transition()
            .duration(animationDuration)
            .attr('x1', (d) => d.parent.x)
            .attr('y1', (d) => d.parent.y)
            .attr('x2', (d) => d.child.x)
            .attr('y2', (d) => d.child.y);
    }

    let nodes = d3
        .select('.Canvas > svg g')
        .selectAll('g.node')
        .data(newTree)
        .enter()
        .append('g')
        .attr('id', (d) => `node${d.data.id}`)
        .attr('class', (d) => (d.data.value != null ? 'node' : 'null-node'));
    nodes
        .append('circle')
        .attr('id', (d) => `circle${d.data.id}`)
        .attr('r', nodeRadius)
        .attr('cx', (d) => d.oldX)
        .attr('cy', (d) => d.oldY)
        .attr('value', (d) => d.data.value);
    nodes
        .append('text')
        .attr('dx', (d) => d.oldX)
        .attr('dy', (d) => d.oldY)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .text((d) => d.data.value);

    nodes
        .transition()
        .duration(animationDuration)
        .attr('transform', function (d) {
            if (d.data.value != null) return `translate(${parseInt(d.x - d.oldX)}, ${parseInt(d.y - d.oldY)})`;
            else return 'translate(0,0)';
        });

    data = newData;
}

const addNode = async () => {
    let val = document.getElementById('InsertNodeField').value;
    if (val == '') return;
    if (isNaN(val)) {
        alert('Only integers values are allowed');
        return;
    }
    val = parseInt(val);
    document.getElementById('InsertNodeField').value = '';
    freezeButtons();

    let oldData = $.extend(true, {}, data);
    let newData = $.extend(true, {}, data);
    let node = newData;
    let parent = null;
    if (data.value == null) {
        data = {
            id: curId,
            value: val,
            children: [{ value: null }, { value: null }],
        };
        update(oldData, data, -1, -1);
        curId++;
    } else {
        while (true) {
            let nodeEle = document.getElementById(`node${node.id}`);
            if (nodeEle) nodeEle.className.baseVal = 'highlightedNode';

            parent = node;
            if (node.value == val) {
                alert('Value already exists in tree');
                update(oldData, oldData, -1, -1);
                break;
            } else {
                if (node.value > val) {
                    node = node.children[0];
                } else {
                    node = node.children[1];
                }

                if (node.value == null) {
                    await sleep(300);
                    let newChild = {
                        id: curId,
                        value: val,
                        children: [{ value: null }, { value: null }],
                    };

                    if (parent.value < val) parent.children[1] = newChild;
                    else parent.children[0] = newChild;
                    update(oldData, newData, parent.id, curId);

                    curId++;
                    break;
                } else {
                    document.getElementById(`link_Source_${parent.id}_Dest_${node.id}`).className.baseVal = 'LinkAnimation';
                }
            }
            await sleep(750);
        }
    }
    unfreezeButtons();
};

const deleteNodeRecur = (newData, val) => {
    if (newData.value == null) return newData;

    if (val < newData.value) {
        newData.children[0] = deleteNodeRecur(newData.children[0], val);
    } else if (val > newData.value) {
        newData.children[1] = deleteNodeRecur(newData.children[1], val);
    } else {
        if (newData.children[0].value == null) {
            return newData.children[1];
        } else if (newData.children[1].value == null) {
            return newData.children[0];
        }

        // Both children Exist
        let successorParent = newData;
        let successor = newData.children[1];
        while (successor.children[0].value != null) {
            successorParent = successor;
            successor = successor.children[0];
        }
        if (successorParent.value != newData.value) successorParent.children[0] = successor.children[1];
        else successorParent.children[1] = successor.children[1];
        newData.value = successor.value;
        return newData;
    }
    return newData;
};

const deleteNode = async () => {
    let val = document.getElementById('DeleteNodeField').value;
    if (val == '') return;
    if (isNaN(val)) {
        alert('Only integer values are allowed');
        return;
    }
    val = parseInt(val);
    document.getElementById('DeleteNodeField').value = '';
    freezeButtons();

    let oldData = $.extend(true, {}, data);
    let newData = $.extend(true, {}, data);
    let node = newData;
    let parent = null;
    while (true) {
        if (node.value == null) {
            alert('Value is not present in tree');
            update(oldData, newData, -1, -1);
            break;
        } else {
            let nodeEle = document.getElementById(`node${node.id}`);
            if (nodeEle) nodeEle.className.baseVal = 'highlightedNode';

            parent = node;

            if (node.value == val) {
                await sleep(500);
                newData = deleteNodeRecur(newData, val);
                update(oldData, newData, -1, -1);
                break;
            } else {
                if (node.value > val) {
                    node = node.children[0];
                } else {
                    node = node.children[1];
                }
                let linkElement = document.getElementById(`link_Source_${parent.id}_Dest_${node.id}`);
                if (linkElement) linkElement.className.baseVal = 'LinkAnimation';
            }
        }
        await sleep(750);
    }
    unfreezeButtons();
};

document.getElementById('InsertButton').addEventListener('click', addNode);
document.getElementById('DeleteButton').addEventListener('click', deleteNode);

$(document).ready(function () {
    // if during inserting or deleting user presses enter key then click on button.
    $('#InsertNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#InsertButton').click();
    });
    $('#DeleteNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#DeleteButton').click();
    });
});



async function init() {
    let list = [15, 7,25, 4,10,20,30 ,2,6,8,13,18,22,28,35];
    for (let i = 0; i < list.length; i++) {
        document.getElementById('InsertNodeField').value = list[i];
        await addNode();
    }
}
// init();