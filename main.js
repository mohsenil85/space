var tileSet = document.createElement("img");
tileSet.src = "./img/Commissions/Template.png";

var terminalOptions = {
    greetings: 'Javascript Interpreter',
    name: 'js_demo',
    height: 200,
    prompt: 'js> ',
    keypress: function(e) {
        if (e.which == 27) {
            return false;
        }
    }
};

var tileSetOptions = {
    width: 50,
    height: 35,
    layout: "tile",
    //bg: "transparent",
    tileWidth: 16,
    tileHeight: 16,
    tileSet: tileSet,
    tileMap: {
        "@": [0, 0],
        ".": [16, 0],
        "FRONT-2": [64, 0],
        "FRONT-3": [96, 0]
    }

};

var Player   = function(x, y){
    this._x = x;
    this._y = y;
    this._draw();
};

Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
};

Player.prototype.handleEvent = function (e){

    console.log(e.keyCode.toString());
    if (!Game.isTermDisplayed){

    var keyMap = {};

    keyMap[72] = 6 ; //h
    keyMap[74] = 4 ; //j
    keyMap[75] = 0 ; //k
    keyMap[76] = 2 ; //l

    keyMap[89] = 7 ; //y
    keyMap[85] = 1 ; //u
    keyMap[66] = 5 ; //b
    keyMap[78] = 3 ; //n


    //keyMap[9] = 3 ; //n
    var code = e.keyCode;

    //debugger;
    //switch...
    if(code === 27) {
        Game.isTermDisplayed = true;
        $("#term").terminal(function(command, terminal) {
            if (command === "q" ){
                debugger;
                Game.isTermDisplayed = false;
                Game.engine.unlock();
                this.
                $("#term").hide();
            } else {
                terminal.echo('you type command "' + command + '"');
            }

        },
            terminalOptions
        ).toggle();
        //$("#term textarea").val("");
        //$("#term").toggle();
        //$("#term").focus();

    } else if(!(code in keyMap)) {
        return;
    } else {
        var diff = ROT.DIRS[8][keyMap[code]];
        var newX = this._x + diff[0];
        var newY = this._y + diff[1];
        var newKey = newX + "," + newY;
        if (!(newKey in Game.map)) { return; }
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = newX;
        this._y = newY;
        this._draw();
    }

    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    }
}
Player.prototype._draw = function(){
    Game.display.draw(this._x, this._y, "@", "#ff0");
};

var Game = {
    display: null,
    player : null,
    engine : null,
    isTermDisplayed: false,

    init: function() {
        $("#term").hide();
        this.display =  new ROT.Display();
        document.getElementById("map").appendChild(Game.display.getContainer());
        this._generateMap();
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
    map : {},
    _generateMap : function(){
        var digger = new ROT.Map.Digger();
        var freeCells = [];

        var digCallback = function(x, y, value){
            if (value) { return; }
            var key = x+","+y;
            freeCells.push(key);
            this.map[key] = "."
        };
        digger.create(digCallback.bind(this));
        this._generateBoxes(freeCells);
        this._drawWholeMap();
        this._createPlayer(freeCells);
    },
    _createPlayer : function(freeCells){
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.player = new Player(x, y);
    },
    _drawWholeMap : function(){
        for (var key in this.map){
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key])
        }
    },

    _generateBoxes : function(freeCells){
        for(var i=0; i <10; i++){
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
        }
    },
    _jumpToTerm : function(){

    }


};

