jQuery(function($, undefined) {
    $('#term').terminal(function(command, term) {
        if (!Game.isTermDisplayed){
            $('#term').val("");
        }
        debugger;
        if(command === "q"){
            Game.isTermDisplayed = false;
            Game.engine.unlock();
            $("#term").hide();
        } else if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    term.echo(new String(result));
                }
            } catch(e) {
                term.error(new String(e));
            }
        } else {
            term.echo('');
        }
    }, {
        greetings: 'Javascript Interpreter',
        name: 'js_demo',
        height: 200,
        prompt: 'js> '
    });
        //.keypress(function(e){
        //    if (e.keyCode === 27){
        //        Game.isTermDisplayed = false;
        //        Game.engine.unlock();
        //        $("#term").hide();
        //        //console.log(e.keyCode);
        //        return;
        //    }
        //});
});