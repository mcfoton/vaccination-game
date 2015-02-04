/**
 *
 * @param graph
 * @constructor
 */
function AI (graph) {

    var ai = this;
    var first_move = true;

    this.move = function() {
        if (first_move) {
            first_move = false;
            return moveTo(getFirstPosition());
        } else {
            var possible_moves = graph.getAILinkedNodes();
            if (possible_moves.length > 0) {
                var random_key = Math.floor(Math.random() * possible_moves.length);
                return moveTo(possible_moves[random_key]);
            } else {
                Game.gameOver();
            }
        }
    };

    function moveTo(node) {
        node.owner = 'ai';
       /* node.ir = node._ir;
        node.iv = true;
        node.r = Math.max(graph.getNodeRadius(), node.ir * 1.3);*/
        return node;
    }

    function getFirstPosition() {
        var possible_moves = [];
        var i, j, k, l;

        for (i = 0, l = graph.nodes.length; i < l; i++) {
            if (graph.nodes[i].owner != '') {
                // This node is owned
                continue;
            }
            var linked = graph.getLinkedNodes(graph.nodes[i]);
            k = linked.length;
            var count = k;

            for (j = 0; j < k; j++) {
                if (graph.nodes[i] === graph.nodes[j]) {
                    // It is backward link
                    continue;
                }
                count++;
            }
            possible_moves[count] = graph.nodes[i];
        }

        return possible_moves[possible_moves.length - 1];  // Maximum index is the best move;
    }
}