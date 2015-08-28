$(function() {
    var sub = $('.game-settings .sub');
    var mode = $('#mode');
    var logo = $('.vac-c');
    var main_container = $('.game-settings .main .container');

    $('#start-game').click(function(event){
        event.preventDefault();
        if ($(this).attr('href') == '#') {
            sub.slideToggle(400);
        } else {
            window.location.hash = '#mode';
            show_mode();
        }
    });
    $('.game-settings .without').click(function(event){
        event.preventDefault();
        window.location.hash = '#mode';
        show_mode();
    });

    function show_mode() {
        main_container.css({
            minHeight: main_container.height()
        });
        if (sub.is(':visible')) {
            sub.slideToggle(400, function(){
                animate();
            });
        } else {
            animate();
        }
    }

    function animate() {
        $('#preview').fadeOut(350);
        logo.animate({
            marginTop: '155px'
        }, 200, function(){
            logo.animate({
                marginTop: '20px'
            }, 500, function(){
                logo.css({
                    margin: '0 auto',
                    padding: '20px 0',
                    position: 'static'
                });
                mode.slideToggle(300);
            });
        });
    }

    if (window.location.hash == '#mode') {
        logo.css({
            margin: '0 auto',
            padding: '20px 0',
            position: 'static'
        });
        mode.show();
    } else {
        $('#preview').show();
    }
    $('.game-settings .main').fadeIn();



    var game_type_name = $('.game-type-name');
    var input_game_type = $('#settings-form').find('input[name="game-type"]');
    game_type_name.hover(function(){
        if ($(this).parent().hasClass('chosen')) {
            return;
        }
        if (! $(this).data('animating')) {
            $(this).parent().find('.baw').fadeOut(400);
        }
    }, function(){
        if ($(this).parent().hasClass('chosen')) {
            return;
        }
        if (! $(this).data('animating')) {
            var that = $(this);
            that.data('animating', 'true');
            $(this).parent().find('.baw').fadeIn(600, function(){
                that.data('animating', '');
            });
        }
    });

    var current_type = 'urti';
    var current_difficulty = 1;



    var type_animating = false;
    var difficulty_animating = false;

    function update_description() {
        var wrapper = $('.game-difficulty-descriptions .wrapper');
        var curr_desc_selector = $('.game-difficulty-descriptions .current');
        var next_desc_selector = $('.game-difficulty-descriptions .next');
        var el = $('#difficulty-description-' + current_type + '-' + current_difficulty);
        var new_desc = el.html();

        if (! difficulty_animating) {
            difficulty_animating = true;
            next_desc_selector.html(new_desc);
            wrapper.animate({
                marginLeft: '-450px'
            }, 300, function(){
                curr_desc_selector.html(new_desc);
                wrapper.css({
                    marginLeft: 0
                });
                difficulty_animating = false;
            })
        }
    }

    function update_type() {
        var wrapper = $('.game-type-descriptions .wrapper');
        var curr_desc_selector = $('.game-type-descriptions .current');
        var next_desc_selector = $('.game-type-descriptions .next');
        var el = $('#type-description-' + current_type);
        var new_desc = el.html();

        if (! type_animating) {
            type_animating = true;
            next_desc_selector.html(new_desc);
            wrapper.animate({
                marginLeft: '-450px'
            }, 300, function(){
                curr_desc_selector.html(new_desc);
                wrapper.css({
                    marginLeft: 0
                });
                type_animating = false;
            })
        }
    }

    var game_difficulty_name = $('.game-difficulty-item');
    var input_game_difficulty = $('#settings-form').find('input[name="game-difficulty"]');
    var virus_name = $('#virus-name');

    game_type_name.click(function(){
        if ($(this).parent().hasClass('chosen')) {
            return;
        }
        current_type = $(this).parent().data('type');
        input_game_type.val(current_type);

        if (current_type == 'named') {
            virus_name.slideDown(300);
        } else {
            virus_name.slideUp(300);
        }

        $('.game-type-item.chosen').find('.baw').fadeIn(600);
        $('.game-type-item').removeClass('chosen');
        game_type_name.data('animating', '');
        $(this).parent().addClass('chosen');
        update_type();
        update_description();
    });

    game_difficulty_name.click(function(){
        if ($(this).hasClass('chosen')) {
            return;
        }
        game_difficulty_name.removeClass('chosen');
        $(this).addClass('chosen');

        current_difficulty = $(this).data('difficulty');
        input_game_difficulty.val(current_difficulty);
        update_description();
    });

    $('form#settings-form').submit(function(event) {
        if (current_type == 'named' && $.trim(virus_name.val()) == '') {
            event.preventDefault();
            virus_name.focus();
            virus_name.addClass('error');
        }
    });
    virus_name.keyup(function(){
        if ($.trim($(this).val()) != '') {
            $(this).removeClass('error');
        }
    });
});