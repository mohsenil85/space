var tileSet = document.createElement("img");
tileSet.src = "./img/spritesheet1.png";

var tileSetOptions = {
    width: 64,
    height: 40,
    layout: "tile",
    bg: "transparent",
    tileWidth: 16,
    tileHeight: 16,
    tileSet: tileSet,
    tileMap: {
        "@": [0, 0],
        "*": [0, 16],
        ".": [0, 32]
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

    var keyMap = {};

    keyMap[72] = 6 ; //h
    keyMap[74] = 4 ; //j
    keyMap[75] = 0 ; //k
    keyMap[76] = 2 ; //l

    keyMap[89] = 7 ; //y
    keyMap[85] = 1 ; //u
    keyMap[66] = 5 ; //b
    keyMap[78] = 3 ; //n


    var code = e.keyCode;

    var term =  $("#term");
    //switch...
    if(code === 27) { //escape is pressed
        if(term.length){
            //term is showing, so hide it
            term.hide();
            term.remove();
            Game.engine.unlock();
        } else {
            //do show term
            var termDiv = document.createElement('div');
            termDiv.id = 'term';
            document.body.appendChild(termDiv);
            $(termDiv).terminal(function(command, terminal) {
                    terminal.echo('you type command "' + command + '"');
                },
            {
                greetings: 'UNIX V6.1 beta',
                name: 'js_demo',
                //height: 200,
                prompt: '$ '
            }

                );
        }
        return;

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
};
Player.prototype._draw = function(){
    Game.display.draw(this._x, this._y, "@", "#ff0");
};

var Game = {
    display: null,
    player : null,
    engine : null,
    map : {},

    init: function() {
        $("#term").hide();
        this.display =  new ROT.Display(tileSetOptions);
        document.getElementById("map").appendChild(Game.display.getContainer());
        this._generateMap();
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
    _generateMap : function(){

        var digger = new ROT.Map.Digger(64,40,{});
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
            if (this.map.hasOwnProperty(key)){
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);
                this.display.draw(x, y, this.map[key])
            }
        }
    },

    _generateBoxes : function(freeCells){
        for(var i=0; i <10; i++){
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
        }
    }
};

