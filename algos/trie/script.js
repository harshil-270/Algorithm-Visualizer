// structure of node
// {
//     id: number <--- unique id for each node. it will be also used as id for html element of node.
//     value: character <-- this will store character stored in current node
//     endOfWord: boolean <-- show node as the end of word.
//     children: [] <--- this array will store all the children nodes and its values
//     childrenCharacter : {} <-- this will all children character.
// }

let data = { id: 0, value: 'root', endOfWord: false, children: [], childrenCharacter: {} };
let curId = 1; // current availabel id.

const width = Math.max(100, window.innerWidth - 50);
const height = Math.max(100, window.innerHeight - 200);
const nodeRadius = 20;
const LinkStroke = 4;
const animationDuration = 500;
const padding = 40;

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

// create the root node.
function init() {
    let newTree = treemap(d3.hierarchy(data, (d) => d.children));

    newTree.y += padding;

    let nodes = d3
        .select('svg g')
        .selectAll('g.node')
        .data(newTree)
        .enter()
        .append('g')
        .attr('class', () => 'node');
    nodes
        .append('circle')
        .attr('id', (d) => `circle${d.data.id}`)
        .attr('r', nodeRadius)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('value', (d) => d.data.value);
    nodes
        .append('text')
        .attr('dx', (d) => d.x)
        .attr('dy', (d) => d.y)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .text((d) => d.data.value);
}
init();

// to animate from old tree to new tree.
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
    // convert both trees from javascript objects to array
    let oldTreeArray = oldTree.descendants();
    let newTreeArray = newTree.descendants();

    for (let i = 0; i < newTreeArray.length; i++) {
        let oldPosition = {};
        // go over old tree's data and find node's old position.
        for (let j = 0; j < oldTreeArray.length; j++) {
            if (newTreeArray[i].data.id == childId) {
                // for the node we are going to add there is no old co-oridnates availabel
                // so we are going to use the co-ordinates of parent node of newly added node.
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

    d3.select('svg g').remove();
    d3.select('svg').append('g');

    let allLinks = [];
    for (let i = 0; i < newTreeArray.length; i++) {
        if (!newTreeArray[i].children) continue;
        for (let j = 0; j < newTreeArray[i].children.length; j++) {
            allLinks.push({
                parent: newTreeArray[i],
                child: newTreeArray[i].children[j],
            });
        }
    }

    let links = d3
        .select('svg g')
        .selectAll('g.link')
        .data(allLinks)
        .enter()
        .append('g')
        .append('line')
        .attr('id', (d) => `link${d.parent.data.id}D${d.child.id}`)
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

    let nodes = d3
        .select('svg g')
        .selectAll('g.node')
        .data(newTree)
        .enter()
        .append('g')
        .attr('id', (d) => `node${d.data.id}`)
        .attr('class', (d) => (d.data.endOfWord ? 'endOfWordNode' : 'node'));
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
        .attr('fill', 'white')
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
    let str = document.getElementById('InsertNodeField').value;
    if (str == '') return;
    document.getElementById('InsertNodeField').value = '';

    freezeButtons();

    str = str.toLowerCase();

    let oldData = $.extend(true, {}, data);
    let newData = $.extend(true, {}, data);
    let node = newData;

    for (let i = 0; i < str.length; i++) {
        if (str[i] in node.childrenCharacter && node.childrenCharacter[str[i]] == true) {
            for (let j = 0; j < node.children.length; j++) {
                if (node.children[j].value == str[i]) {
                    node = node.children[j];
                    break;
                }
            }
            if (i == str.length - 1) {
                node.endOfWord = true;
                update(newData, newData, -1, -1);
            }
        } else {
            node.childrenCharacter[str[i]] = true;
            node.children.push({
                id: curId,
                value: str[i],
                endOfWord: i == str.length - 1,
                children: [],
                childrenCharacter: {},
            });
            curId++;
            update(oldData, newData, node.id, node.children[node.children.length - 1].id);
            oldData = $.extend(true, {}, newData);
            node = node.children[node.children.length - 1];
        }
        let nodeEle = document.getElementById(`node${node.id}`);
        let originalClass = '';
        if (nodeEle) {
            originalClass = nodeEle.className.baseVal;
            nodeEle.className.baseVal = 'highlightedNode';
        }
        await sleep(700);
        if (nodeEle) {
            nodeEle.className.baseVal = originalClass;
        }
    }
    unfreezeButtons();
};

const deleteNodeUtil = async () => {
    if (data.children.length == 0) {
        alert('Trie is empty');
        return;
    }
    let str = document.getElementById('DeleteNodeField').value;
    if (str == '') return;
    str = str.toLowerCase();

    document.getElementById('DeleteNodeField').value = '';

    freezeButtons();

    let newData = $.extend(true, {}, data);

    const deleteNode = async (parent, node, str, depth) => {
        let nodeEle = document.getElementById(`node${node.id}`);
        let originalClass = '';
        if (nodeEle) {
            originalClass = nodeEle.className.baseVal;
            nodeEle.className.baseVal = 'highlightedNode';
        }
        await sleep(700);
        if (nodeEle) {
            nodeEle.className.baseVal = originalClass;
        }

        // If last character of key is being processed
        if (depth == str.length) {
            if (node.endOfWord == false) {
                alert('Word not found in trie');
                return false;
            }
            // This node is no more end of word after
            // removal of given key
            node.endOfWord = false;

            // If given is not prefix of any other word
            // check if current node has some children or not.
            if (node.children.length == 0) {
                let oldData = $.extend(true, {}, newData);
                delete parent.childrenCharacter[str[depth - 1]];
                let charIndex = 0;
                for (let i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].value == str[depth - 1]) {
                        charIndex = i;
                    }
                }
                parent.children.splice(charIndex, 1);
                update(oldData, newData, -1, -1);
            } else {
                update(newData, newData, -1, -1);
            }
            return true;
        }

        // If not last character, recur for the child
        // obtained using ASCII value
        if (str[depth] in node.childrenCharacter) {
            let charIndex = 0;
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].value == str[depth]) {
                    charIndex = i;
                }
            }

            let isWordFound = await deleteNode(node, node.children[charIndex], str, depth + 1);
            if (isWordFound == false) {
                return false;
            }

            // If root does not have any child (its only child got
            // deleted), and it is not end of another word.
            if (parent && node.children.length == 0 && node.endOfWord == false) {
                let nodeEle = document.getElementById(`node${node.id}`);
                if (nodeEle) {
                    nodeEle.className.baseVal = 'highlightedNode';
                }
                await sleep(700);

                let oldData = $.extend(true, {}, newData);
                parent.childrenCharacter[str[depth - 1]] = false;
                charIndex = 0;
                for (let i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].value == str[depth - 1]) {
                        charIndex = i;
                    }
                }
                parent.children.splice(charIndex, 1);
                update(oldData, newData, -1, -1);
            }
            return true;
        } else {
            alert('Word not found in trie');
            return false;
        }
    };

    let node = newData;
    let parent = null;
    await deleteNode(parent, node, str, 0);

    unfreezeButtons();
};

document.getElementById('InsertButton').addEventListener('click', addNode);
document.getElementById('DeleteButton').addEventListener('click', deleteNodeUtil);

$(document).ready(function () {
    // if during inserting or deleting user presses enter key then click on button.
    $('#InsertNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#InsertButton').click();
    });
    $('#DeleteNodeField').keypress(function (e) {
        if (e.keyCode == 13) $('#DeleteButton').click();
    });
});
