var Messages = (function(){

    var container, ul;

    var available_height = window.innerHeight
        - 40 // header
        - 200 // photo
        - 60 // ~name
        - 18 // status
        - 60 // ~status message
        - 15 // ul margin
        ;
    var message_height = 66;
    var maximum_messages  = Math.floor(available_height / message_height);

    (function init() {
        container = d3.select('#info .messages-container');
        container.style('max-height', maximum_messages * message_height - 6 + 'px');
        ul = d3.select('#info .messages-container ul');
    }());

    var messages = [];

    function push(message, type) {
        type = type || 'normal';
        messages.push({
            message: message,
            type: type
        });
        update();
    }

    function update() {
        console.log(messages);+
        ul.selectAll('li').data(messages).enter().insert("li",":first-child").append('div')
            .attr('class', function(d) {
                return d.type;
            })
            .html(function(d) {
                return d.message;
            });
        ul.style('margin-top', '-66px');
        ul.transition().style('margin-top', '0px');
    }


    return {
        push: function(message, type) {
            return push(message, type);
        },
        messages: messages
    }

}());