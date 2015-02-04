var Game = (function(){

    var player_move = true;
    var ai, graph;
    var ai_delay = 3;

    function setAI(_ai) {
        ai = _ai;
    }

    function setGraph(_graph) {
        graph = _graph;
    }

    function isPlayerMove() {
        return player_move;
    }

    function movePlayerTo(node) {
        player_move = false;
        node.owner = 'player';
        graph.removeLinks(node);
        force.links(graph.links);
        svg.selectAll(".link").data(graph.links)
            .enter().append("line")
            .attr("class", "link");
        svg.selectAll(".link").data(graph.links).exit().remove();
        force.start();
        tick();
        ai_delay--;
        if (ai_delay <= 0) {
            var move = ai.move();
            if (ai_delay == 0) {
               Messages.push("Ваш друг " + move.name + " заболевает ОРВИ!", 'infect');
            } else {
                Messages.push(move.name + " заражается ОРВИ!", 'infect');
            }
        } else {
            Messages.push("Вакцинируйте своих друзей! Ходов до заражения: " + ai_delay, 'info');
        }

        player_move = true;
    }

    function gameOver() {
        alert('Game over!');
    }


    return {
        isPlayerMove: function() {
            return isPlayerMove();
        },
        movePlayerTo: function(node) {
            return movePlayerTo(node);
        },
        setAI: function(ai) {
            return setAI(ai);
        },
        setGraph: function(graph) {
            return setGraph(graph);
        },
        gameOver: function() {
            return gameOver();
        }
    }

}());