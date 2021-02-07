let data = { value: null };

let width = Math.min(window.innerWidth, 1200);
let height = 610;
let nodeRadius = 20;
let LinkStroke = 4;
let animationDuration = 500;
let padding = 22;

let treemap = d3.tree().size([width, height]);
let g = d3.select('.Canvas').append('svg').append('g');

function freezeButtons() {
    document.getElementById('InsertButton').disabled = true;
    document.getElementById('DeleteButton').disabled = true;
}

function unfreezeButtons() {
    document.getElementById('InsertButton').disabled = false;
    document.getElementById('DeleteButton').disabled = false;
}

function update(oldData, newData, parentValue, childValue) {
    /*
        find the co-ordinates of old tree;
        fint the co-ordinates of new updated tree;
        put tree on old co-ordinates
        animate nodes and links to the new co-ordinates
    */

    let oldTree = treemap(d3.hierarchy(oldData, (d) => d.children));
    let newTree = treemap(d3.hierarchy(newData, (d) => d.children));

    let oldTreeArray = oldTree.descendants();
    let newTreeArray = newTree.descendants();

    for (let i = 0; i < newTreeArray.length; i++) {
        let oldPos = null;
        for (let j = 0; j < oldTreeArray.length; j++) {
            if (newTreeArray[i].data.value == childValue) {
                if (oldTreeArray[j].data.value == parentValue) oldPos = oldTreeArray[j];
            } else {
                if (oldTreeArray[j].data.value == newTreeArray[i].data.value) oldPos = oldTreeArray[j];
            }
        }
        newTreeArray[i].oldX = (oldPos.x || 0) + padding;
        newTreeArray[i].oldY = (oldPos.y || 0) + padding;
        newTreeArray[i].x += padding;
        newTreeArray[i].y += padding;
    }

    d3.select('svg g').remove();
    d3.select('svg').append('g');

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
            .select('svg g')
            .selectAll('g.link')
            .data(allLinks)
            .enter()
            .append('g')
            .append('line')
            .attr('id', (d) => `${lineId}linkS${d.parent.data.value}D${d.child.data.value}`)
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
        .select('svg g')
        .selectAll('g.node')
        .data(newTree)
        .enter()
        .append('g')
        .attr('class', (d) => (d.data.value != null ? 'node' : 'null-node'));
    nodes
        .append('circle')
        .attr('id', (d) => `circle${d.data.value}`)
        .attr('r', nodeRadius)
        .attr('cx', (d) => d.oldX)
        .attr('cy', (d) => d.oldY)
        .attr('value', (d) => d.data.value);
    nodes
        .append('text')
        .attr('dx', (d) => d.oldX - 4)
        .attr('dy', (d) => d.oldY + 6)
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

function addNode() {
    let val = document.getElementById('InsertNodeField').value;
    if (val == '') return;
    if (isNaN(val)) {
        alert('Only integers values are allowed');
        return;
    }
    val = parseInt(val);
    document.getElementById('InsertNodeField').value = '';
    freezeButtons();

    if (data.value == null) {
        data = {
            value: val,
            children: [{ value: null }, { value: null }],
        };
        let treeLayout = treemap(d3.hierarchy(data, (d) => d.children));
        treeLayout.x += padding;
        treeLayout.y += padding;
        let nodes = d3
            .select('svg g')
            .selectAll('g.node')
            .data(treeLayout)
            .enter()
            .append('g')
            .attr('class', (d) => (d.data.value != null ? 'node' : 'null-node'));
        nodes
            .append('circle')
            .attr('id', (d) => `circle${d.data.value}`)
            .attr('r', '20px')
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('value', (d) => d.data.value);
        nodes
            .append('text')
            .attr('dx', (d) => d.x - 4)
            .attr('dy', (d) => d.y + 6)
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .text((d) => d.data.value);

        unfreezeButtons();
        return;
    }

    let oldData = $.extend(true, {}, data);
    let newData = $.extend(true, {}, data);
    let temp = newData;
    let parent = null;
    let InsertNodeInterval = setInterval(() => {
        let node = document.getElementById('circle' + temp.value);
        node.style.fill = 'red';
        node.style.fillOpacity = 0.6;
        node.style.stroke = 'red';

        parent = temp;
        if (temp.value == val) {
            alert('Value already exists in tree');
            unfreezeButtons();
            clearInterval(InsertNodeInterval);
        } else {
            if (temp.value > val) {
                temp = temp.children[0];
            } else {
                temp = temp.children[1];
            }

            if (temp.value == null) {
                clearInterval(InsertNodeInterval);
                setTimeout(() => {
                    let newChild = {
                        value: val,
                        children: [{ value: null }, { value: null }],
                    };
                    if (parent.value < val) parent.children[1] = newChild;
                    else parent.children[0] = newChild;

                    update(oldData, newData, parent.value, val);
                    unfreezeButtons();
                }, 1000);
            } else {
                $(`#linkS${parent.value}D${temp.value}`).addClass('LinkAnimation');
            }
        }
    }, 1000);
}

function deleteNode(newData, val) {
    if (newData.value == null) return newData;

    if (val < newData.value) {
        newData.children[0] = deleteNode(newData.children[0], val);
    } else if (val > newData.value) {
        newData.children[1] = deleteNode(newData.children[1], val);
    } else {
        if (newData.children[0].value == null) {
            let temp = newData.children[1];
            return temp;
        } else if (newData.children[1].value == null) {
            let temp = newData.children[0];
            return temp;
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
}

function deletionAnimation() {
    let val = document.getElementById('DeleteNodeField').value;
    if (val == '') return;
    if (isNaN(val)) {
        alert('Only integers can be Inserted');
        return;
    }
    val = parseInt(val);
    document.getElementById('DeleteNodeField').value = '';
    freezeButtons();

    let oldData = $.extend(true, {}, data);
    let newData = $.extend(true, {}, data);
    let temp = newData;
    let parent = null;
    let DeleteNodeInterval = setInterval(() => {
        if (temp.value == null) {
            alert('Value is not present in tree');
            update(oldData, newData, -1, -1);
            unfreezeButtons();
            clearInterval(DeleteNodeInterval);
        } else {
            let node = document.getElementById('circle' + temp.value);
            node.style.fill = 'red';
            node.style.fillOpacity = 0.6;
            node.style.stroke = 'red';
            parent = temp;
            if (temp.value == val) {
                clearInterval(DeleteNodeInterval);
                setTimeout(() => {
                    newData = deleteNode(newData, val);

                    update(oldData, newData, -1, -1);
                    unfreezeButtons();
                }, 1000);
            } else {
                if (temp.value > val) {
                    temp = temp.children[0];
                } else {
                    temp = temp.children[1];
                }

                let link = document.getElementById(`linkS${parent.value}D${temp.value}`);
                $(link).addClass('LinkAnimation');
            }
        }
    }, 1000);
}

document.getElementById('InsertButton').addEventListener('click', addNode);
document.getElementById('DeleteButton').addEventListener('click', deletionAnimation);

$(document).ready(function () {
    $('#InsertNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#InsertButton').click();
    });
    $('#DeleteNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#DeleteButton').click();
    });
});
