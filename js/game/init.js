var graph = new Graph();
Game.setGraph(graph);

var width = graph.getWidth(),
    height = graph.getHeight();

var force = d3.layout.force()
    .size([width, height])
    .charge(-180)
    .gravity(0.03)
    .linkDistance(function(){return Math.random() * 30 + 105;})
    .on("tick", tick);

var drag = force.drag().on('drag', function(d){
}).on("dragstart", function(d){
    console.log('d started');
    d3.event.sourceEvent.stopPropagation(); // silence other listeners
});


Messages.push('Вакцинируйте своих друзей! Ходов до заражения: 3', 'info');

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", function(){
        var distance = 200;
        var mouse = d3.mouse(this);
        var near = [];
        var x, y, d;
        for (var i = 0, l = graph.nodes.length; i < l; i++) {
            //if (graph.nodes[i].owner == '') {
            x = graph.nodes[i].x - mouse[0];
            y = graph.nodes[i].y - mouse[1];
            d = Math.sqrt(x * x + y * y);
            if (d < distance) {
                graph.nodes[i].iv = true;
                graph.nodes[i].ir = graph.nodes[i]._ir - Math.max(0, d / distance * graph.nodes[i]._ir);


                graph.nodes[i].r = Math.max(graph.getNodeRadius(), graph.nodes[i].ir * 1.3);
                //d3.select(node[i]).attr('style', '');
            } else {
                graph.nodes[i].iv = false;
                graph.nodes[i].ir = graph.nodes[i]._ir;
                graph.nodes[i].r = graph.getNodeRadius();
            }
            //}
        }
        force.resume();
        tick2();

    });

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    image = svg.selectAll(".image");

force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

link = link.data(graph.links)
    .enter().append("line")
    .attr("class", "link");

node = node.data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", graph.getNodeRadius());

image = image.data(graph.nodes)
    .enter().append('image')
    .attr('xlink:href', function(d){ return d.i;})
    .attr('class', 'image')
    .attr('style', 'display: none')
    .attr('clip-path', 'url(#clip)')
    .on('click', function(d){
        if (Game.isPlayerMove() && d.owner == '') {
            Game.movePlayerTo(d);
        }
        tick();
    })
    .on('mouseover', function(d){
        d3.select('#info .friend').style('display', 'block');
        d3.select('#info .name').html(d.first_name + '<br>' + d.last_name);
        d3.select('#info .photo').html('<img src="' + d.big_photo + '">');
        if (d.owner == 'ai') {
            d3.select('.friend .status .red').style('width', '100%');
            d3.select('.friend .status .green').style('width', '0%');
            d3.select('.status-message').html('Статус: заражен' + d.sex);
        } else if (d.owner == 'player') {
            d3.select('.friend .status .red').style('width', '0%');
            d3.select('.friend .status .green').style('width', '100%');
            d3.select('.status-message').html('Статус: вакцинирован' + d.sex);
        } else {
            var ai_cells = graph.getAILinkedNodes();
            var l = ai_cells.length;
            var percentage = 0;
            for (var i = 0; i < l; i++) {
                if (ai_cells[i] === d) {
                    percentage = Math.round(1 / l * 100);
                }
            }

            d3.select('.friend .status .red').style('width', percentage + '%');
            d3.select('.friend .status .green').style('width', 100 - percentage + '%');
            d3.select('.status-message').html('Статус: здоров' + d.sex + '.<br>Вероятность заражения: ' + percentage + '%')
        }
    }).on('mouseout', function(d){
        d3.select('#name').html('');
        d3.select('#photo').html('');
        d3.select('#status').html('');
    });

function collide(node) {
    var r = node.r + node.r * 1.3,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var delta = 5;
            var x = node.x - quad.point.x + delta,
                y = node.y - quad.point.y + delta,
                l = Math.sqrt(x * x + y * y),
                r = node.r + quad.point.r + delta;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

function tick() {
    var q = d3.geom.quadtree(graph.nodes),
        i = 0,
        n = graph.nodes.length;

    while (++i < n) q.visit(collide(graph.nodes[i]));
    node.attr("cx", function(d) {
        return d.x = Math.max(d.r, Math.min(width - d.r, d.x));
    }).attr("cy", function(d) {
        return d.y = Math.max(d.r, Math.min(height - d.r, d.y));
    }).attr('class',function(d) {
        return 'node ' + d.owner;
    });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr('class',function(d) {
            if (d.source.owner == d.target.owner) {
                return 'link ' + d.target.owner;
            }
            /*if (d.source.owner == 'player' || d.target.owner == 'player') {
             return '';
             }*/
            return 'link';
        });
    image.attr("x", function(d) {
        return d.x - d.ir;
    }).attr("y", function(d) {
        return d.y -  d.ir;
    }).attr('width',function(d) {
        return d.ir * 2;
    }).attr('height',function(d) {
        return d.ir * 2;
    });
    var l = graph.nodes.length;
    var normal = Math.round(graph.getOwnerNodes('').length / l * 100);
    var healed = Math.round(graph.getOwnerNodes('player').length / l * 100);
    var infected = Math.round(graph.getOwnerNodes('ai').length / l * 100);
    if (normal + healed + infected < 100) {
        normal = 100 - healed - infected;
    }
    d3.selectAll('.stats .stat.normal').html(normal != 0 ? normal + '%' : '').style('width', normal + '%');
    d3.selectAll('.stats .stat.healed').html(healed != 0 ? healed + '%' : '').style('width', healed + '%');
    d3.selectAll('.stats .stat.infected').html(infected != 0 ? infected + '%' : '').style('width', infected + '%');
}

function tick2() {
    node.attr('r', function(d){
        return d.r;
    });
    image.attr('style', function(d) {
        if (! d.iv) {
            return 'display: none';
        } else {
            return '';
        }
    });
    image.attr("x", function(d) {
        return d.x - d.ir;
    }).attr("y", function(d) {
        return d.y -  d.ir;
    }).attr('width',function(d) {
        return d.ir * 2;
    }).attr('height',function(d) {
        return d.ir * 2;
    });
}
tick();

var ai = new AI(graph);
Game.setAI(ai);