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
            var gn = params.game_type == 'vip' ? 'инфекцию' : params.game_name;
            if (ai_delay == 0) {
               Messages.push(move.name + " подхватывает " + gn + "!", 'infect');
            } else {
                Messages.push(move.name + " подхватывает " + gn + "!", 'infect');
            }
            if (graph.getAILinkedNodes().length == 0) {
                Game.gameOver();
            }
        } else {
            Messages.push("Вакцинируйте своих друзей! Ходов до заражения: " + ai_delay, 'info');
        }

        player_move = true;
    }

    function gameOver() {
        sendScore();
        $('.results-score').html('Очки: ' + getScore());
        $('.results-container').fadeIn();
        $('.overlay').fadeIn();
    }

    function getScore() {
        var l = graph.nodes.length;
        var normal = graph.getOwnerNodes('').length / l;
        var healed = graph.getOwnerNodes('player').length / l;

        var max_score = 10000;
        return Math.round(max_score * normal + max_score * healed / 2);
    }

    function sendScore() {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        var csrftoken = getCookie('csrftoken');
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        $.ajax({
            type: 'POST',
            url: '/results',
            // TODO: encrypt this
            data: {
                score: getScore(),
                game_type: params.game_type,
                game_difficulty: params.game_difficulty
            },
            success: function(data) {
                console.log(data);
                makeResultsTable(data);
            }
        });
    }

    function makeResultsTable(data) {
        var container = $('#results-table');
        var table = $('<table cellpadding="0" cellspacing="0"><thead><tr><td></td><td></td><td></td></tr></thead><tbody></tbody></table>');
        var tbody = table.find('tbody');
        for (var i = 0, l = data.near_users.length; i < l; i++) {
            var tr = $('<tr><td class="place">' + data.near_users[i].place + '</td>' +
                       '<td class="name">' + data.near_users[i].name + '</td>' +
                       '<td class="score">' + data.near_users[i].score + '</td></tr>');
            if (i % 2 == 0) {
                tr.addClass('even');
            }
            if (data.near_users[i].place == data.user_place) {
                tr.addClass('user');
            }
            var td_name = tr.find('td.name');
            if (data.near_users[i].place == 1) {
                td_name.prepend('<img src="' + static_url + 'img/gold-cup.png">')
            }
            if (data.near_users[i].place == 2) {
                td_name.prepend('<img src="' + static_url + 'img/silver-cup.png">')
            }
            if (data.near_users[i].place == 3) {
                td_name.prepend('<img src="' + static_url + 'img/bronze-cup.png">')
            }
            tbody.append(tr);
        }
        container.html(table);
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