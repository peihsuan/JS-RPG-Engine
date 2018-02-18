//convert 2dim array coordinates to 1dim array coordinates
function xy2i(x, y, width) {
    var index = y * width + x;
    return index;
}

//convert 1dim array coordinates to 2dim array coordinates
function i2xy(index, width) {
    var x = index % width;
    var y = Math.floor(index / width);
    return [x, y];
}

/** 
 * Let a component change the map
 * @param new components x
 * @param new components y
 * @param new map
 * @param the component
 */
function componentMapSwitch(x, y, map, obj) {
    // Change the components position
    if (x != null) obj.x = x;
    if (y != null) obj.y = y;
    // Find the component on the current map and remove it
    for (var i = 0; i < maps.data[maps.currentMap].objects.length; i++)
        if (maps.data[maps.currentMap].objects[i] == obj) maps.data[maps.currentMap].objects.splice(i, 1);
    
    // Add the component to the new map
    maps.data[map].objects.push(obj);
    // Activate a map transition
    myGameArea.transition = true;
}

//convert listmap to a grid
function getGrid(maplayer, width, height) {

    arr = [];
    k = 0;
    for (i = 0; i < height; i++) {
        tmp = [];
        for (j = 0; j < width; j++) {
            tmp[j] = maplayer[k];
            k++;
        }
        arr[i] = tmp;
    }

    return arr;
}

//convert mapCL to a graph
function getGraph() {
    var mapCL = maps.data[maps.currentMap].layerC;
    var mapWidth = maps.data[maps.currentMap].mapWidth;
    var mapHeight = maps.data[maps.currentMap].mapHeight;

    var arr = Array();
    for (var i = 0; i < mapWidth; i++) {
        arr.push(Array());
    }
    for (var i = 0; i < mapWidth * mapHeight; i++) {
        if (mapCL[i])
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 1;
        else
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 0;
    }
    return arr;
}

// Get shortest path using astar algorithm
function astarPath(startX, startY, endX, endY) {
    var graph = new Graph(getGraph());
    // Check if start and end are valid positions (= not outside of the graph grid)
    if (startX < 0 || startX >= graph.grid.length || startY < 0 || startY >= graph.grid[0].length) return undefined;
    if (endX < 0 || endX >= graph.grid.length || endY < 0 || endY >= graph.grid[0].length) return undefined;
    var start = graph.grid[startX][startY];
    var end = graph.grid[endX][endY];
    //console.log("Start = ["+startX+"]["+startY+"]");
    //console.log("End = ["+endX+"]["+endY+"]");
    return astar.search(graph, start, end, {
        closest: true
    });
}

function DisableScrollbar() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scoll = "no";
}

function EnableScrollbar() {
    document.documentElement.style.overflow = 'visible';
    document.body.scroll = "yes";
}

function enterFullscreen() {
    element = myGameArea.canvas;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Size the canvas to the size of the map if it fits on the screen
function resizeCanvas() {
    if (document.body.clientWidth > maps.data[maps.currentMap].width) {
        // Screen bigger than map
        myGameArea.canvas.width = maps.data[maps.currentMap].width;
    }
    // Screen fits on map
    else myGameArea.canvas.width = myGameArea.canvas.width = document.body.clientWidth;

    if (document.body.clientHeight > maps.data[maps.currentMap].height) {
        // Screen bigger than map
        myGameArea.canvas.height = maps.data[maps.currentMap].height;
    }
    // Screen fits on map
    else myGameArea.canvas.height = myGameArea.canvas.height = document.body.clientHeight;
}

/**
 * Use localStorage to save game state
 * TODO: Change to save all the game state values
 */
function saveGameState(address, value) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem(address, value);
        console.log("Stored: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

/**
 * Use localStorage to load game state
 * TODO: Change to load all the game state values & apply them
 */
function loadGameState(address) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        var value = localStorage.getItem(address);
        // Retrieve
        console.log("Retrieved: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function toggle(boolean) {
    if (boolean) return false;
    return true;
}

function blackTransition() {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, maps.data[maps.currentMap].width, maps.data[maps.currentMap].height);
}

function extraGuiRect() {
    ctx = myGameArea.context;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 0, 120, 90);
    ctx.globalAlpha = 1.0;
}

function showTime() {
    ctx = myGameArea.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.round(time / 1000), 5, 20);
}

// Init FPS and time
var start, before, now, time, fps;
start = Date.now();
before = Date.now();
fps = 0;

/**
 * Timer
 */
function timer() {
    this.init = function (delta) {
        this.start = Date.now();
        this.delta = delta;
    }
    this.check = function () {
        if (this.delta != undefined) {
            if (Date.now() - this.start >= this.delta) {
                this.delta = undefined;
                return true;
            } else return false;
        }
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function updateFPS() {
    now = Date.now();
    time = now - start;
    if (myGameArea.frameNo == 1 || everyinterval(30)) {
        fps = Math.round(1000 / (now - before));
    }
    before = now;
}

function showFPS() {
    ctx = myGameArea.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 5, 40);
}

function showPosition(target) {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("x:" + (target.x + target.offset_x) + ", y:" + (target.y + target.offset_y), 5, 60);
    ctx.fillText("Tile[" + Math.floor((target.x + target.offset_x) / maps.data[maps.currentMap].tileset.spriteWidth) + ", " + Math.floor((target.y + target.offset_y) / maps.data[maps.currentMap].tileset.spriteHeight) + "]", 5, 80);
}

// Button functions

function debugButton() {
    myGameArea.debug = toggle(myGameArea.debug);
    maps.data[maps.currentMap].drawCache();
    if (myGameArea.debug) {
        document.getElementById("debugButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("debugButton").innerHTML = "Debug On";
    } else {
        document.getElementById("debugButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("debugButton").innerHTML = "Debug Off";
    }
}

function guiButton() {
    myGameArea.showExtra = toggle(myGameArea.showExtra);
    if (myGameArea.showExtra) {
        document.getElementById("guiButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("guiButton").innerHTML = "GUI On";
    } else {
        document.getElementById("guiButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("guiButton").innerHTML = "GUI Off";
    }
}

// ##########
// Map Editor
// ##########

function layerButton(i) {
    myGameArea.currentLayer = i;
    if (i == 0) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 1) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 2) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 3) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-green");
        if (!myGameArea.debug) debugButton();
    }

}

function drawButton() {
    myGameArea.drawingOn = toggle(myGameArea.drawingOn);
    if (myGameArea.drawingOn) {
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("drawButton").innerHTML = "Drawing On";
    } else {
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("drawButton").innerHTML = "Drawing Off";
    }
}
