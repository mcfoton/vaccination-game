/**
 *
 * @param svg_width
 * @param svg_height
 * @param node_radius
 * @param delta
 * @constructor
 */
function Graph (svg_width, svg_height, node_radius, delta) {

    svg_width = svg_width || window.innerWidth - 200; // -right bar
    svg_height = svg_height || window.innerHeight - 40; // -header
    node_radius = node_radius || 8;
    delta = delta || 32;

    var graph = this;
    this.nodes = [];
    this.links = [];

    this.getWidth = function() {
        return svg_width;
    };

    this.getHeight = function() {
        return svg_height;
    };

    this.getNodeRadius = function() {
        return node_radius;
    };

    this.getRealNodeRadius = function() {
        return node_radius + delta;
    };

    this.getLinkedNodes = function(node) {
        var linked_nodes = [];
        var i, l;

        for (i = 0, l = graph.links.length; i < l; i++) {
            if (graph.links[i].source === node) {
                linked_nodes.push(graph.links[i].target);
            }
            if (graph.links[i].target === node) {
                linked_nodes.push(graph.links[i].source);
            }
        }

        return linked_nodes;
    };

    this.removeLinks = function(node) {
        var links = [];
        var i, l;

        for (i = 0, l = graph.links.length; i < l; i++) {
            if (! node.hasOwnProperty('old_links')) {
                node.old_links = [];
            }
            if (graph.links[i].source === node) {
                node.old_links.push(graph.links[i]);
                continue;
            }
            if (graph.links[i].target === node) {
                node.old_links.push(graph.links[i]);
                continue;
            }
            links.push(graph.links[i]);
        }

        graph.links = links;
    };

    this.getOwnerNodes = function(owner){
        return graph.nodes.filter(function(element){
            return element.owner == owner;
        });
    };

    this.getAINodes = function() {
        return graph.getOwnerNodes('ai');
    };

    this.getPlayerNodes = function() {
        return graph.getOwnerNodes('player');
    };

    this.getOwnerLinkedNodes = function(owner) {
        var owner_nodes = graph.getOwnerNodes(owner);
        var i, j, k, l, m, n;
        var linked_nodes = [];

        for (i = 0, l = owner_nodes.length; i < l; i++) {
            var linked = graph.getLinkedNodes(owner_nodes[i]);
            for (j = 0, k = linked.length; j < k; j++) {
                if (linked[j].owner != '') {
                    // This node is owned
                    continue;
                }
                // Check for duplicates
                var duplicate_found = false;
                for (m = 0, n = linked_nodes.length; m < n; m++) {
                    if (linked_nodes[m] === linked[j]) {
                        duplicate_found = true;
                        break;
                    }
                }
                if (! duplicate_found) {
                    linked_nodes.push(linked[j]);
                }
            }
        }

        return linked_nodes;
    };

    this.getAILinkedNodes = function() {
        return graph.getOwnerLinkedNodes('ai');
    };

    function generateNodes() {
        graph.nodes = [];
        var node_count = Math.floor((svg_height * svg_width) / (graph.getRealNodeRadius() * 4) * 0.009);  // the last number is a magic number
        var i, x, y;

        for (i = 0; i < node_count; i++) {

            // Find position of the node
            do {
                var position_found = true;
                x = Math.random() * (svg_width - 2 * graph.getRealNodeRadius()) + graph.getRealNodeRadius();
                y = Math.random() * (svg_height - 2 * graph.getRealNodeRadius()) + graph.getRealNodeRadius();

                for (var j = 0; j < graph.nodes.length; j++) {
                    if (Math.abs(graph.nodes[j].x - x) < 2 * graph.getRealNodeRadius() && Math.abs(graph.nodes[j].y - y) < 2 * graph.getRealNodeRadius()) {
                        console.log('Regenerating node', graph.nodes.length, '-', x, y, graph.nodes[j].x, graph.nodes[j].y);
                        position_found = false;
                        break;
                    }
                }
            } while (! position_found);

            var n = {
                x: x,
                y: y,
                r: graph.getNodeRadius(),
                ir: graph.getRealNodeRadius(),  // Node image radius. This value will be changed later
                _ir: graph.getRealNodeRadius(),  // Node image radius. This must not be changed
                iv: true,  // Node image visibility
                owner: '',  // Owner of the node (e.g.: player, ai, empty)
            };
            if (params.use_dummy_data) {
                var data = params.dummy_data;
                var random_key = Math.floor(Math.random() * data.length);
                n.i = static_url + 'img/dummy_data_photo.png';
                n.big_photo = static_url + 'img/dummy_data_big_photo.png';
                n.name = data[random_key];
                n.first_name = '';
                n.last_name = '';
                n.sex = ''
            } else {
                data = params.data;
                if (data.length > 0) {
                    n.i = data[0].photo;
                    n.big_photo = data[0].big_photo;
                    n.name = data[0].first_name + ' ' + data[0].last_name;
                    n.first_name = data[0].first_name;
                    n.last_name = data[0].last_name;
                    n.sex = data[0].sex == 1 ? 'a' : '';
                    data.shift();
                } else {
                    random_key = Math.floor(Math.random() * params.dummy_data.length);
                    n.i = static_url + 'img/dummy_data_photo.png';
                    n.big_photo = static_url + 'img/dummy_data_big_photo.png';
                    n.name = params.dummy_data[random_key];
                    n.first_name = '';
                    n.last_name = '';
                    n.sex = ''
                }
            }
            graph.nodes.push(n);
        }
    }

    function generateLinks() {
        graph.links = [];
        var link_chances = [1, 0.95, 0.7, 0.5];  // Chances to generate links on any node. 100% chance to generate the first link, 95% - to generate the second link, etc.
        var i, l, j, x, y, x1, y1;

        for (i = 0, l = graph.nodes.length; i < l; i++) {
            var near = [];
            var near_radius = graph.getRealNodeRadius() * 5; // Magic number
            x = graph.nodes[i].x;
            y = graph.nodes[i].y;

            // Find near nodes
            for (j = 0; j < l; j++) {
                if (j == i) {
                    // It is the same node
                    continue;
                }
                x1 = graph.nodes[j].x;
                y1 = graph.nodes[j].y;
                if (Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2) < Math.pow(near_radius, 2)) {
                    // If the node in the radius
                    near.push(j);
                }
            }

            var nl = near.length;

            if (nl > 0) {
                for (j = 0; j < nl; j++) {
                    if (link_chances[j] == undefined) {
                        break;
                    }
                    if (Math.random() < link_chances[j]) {
                        // Creating link
                        graph.links.push({
                            source: graph.nodes[i],
                            target: graph.nodes[near[j]]
                        })
                    }
                }
            } else {
                console.log("Node", i, 'should be deleted coz of no neighbors', x, y);
            }
        }
    }

    function removeDuplicateLinks() {
        var i, j, l, links = [];

        for (i = 0, l = graph.links.length; i < l; i++) {
            if (graph.links[i] == null) {
                // Already deleted
                continue;
            }
            for (j = i; j < l; j++) {
                if (j == i) {
                    // It is the same link
                    continue;
                }
                if (graph.links[j] == null) {
                    // Already deleted
                    continue;
                }
                if (graph.links[i].source === graph.links[j].source && graph.links[i].target === graph.links[j].target) {
                    graph.links[j] = null;
                    continue;
                }
                if (graph.links[i].target === graph.links[j].source && graph.links[i].source === graph.links[j].target) {
                    graph.links[j] = null;
                    continue;
                }
            }
        }

        for (i = 0, l = graph.links.length; i < l; i++) {
            if (graph.links[i] != null) {
                links.push(graph.links[i]);
            }
        }

        graph.links = links;
    }

    function checkIntegrity() {
        return true;
    }

    (function generateGraph() {
        var count = 1;
        do {
            generateNodes();
            generateLinks();
            removeDuplicateLinks();
            console.log('Creating graph', count++);
        } while (! checkIntegrity());
    }());

}

