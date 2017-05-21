;
(function() {
    'use strict';
    // iPad and iPod detection
    var isiPad = function() {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function() {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Main Menu Superfish
    var mainMenu = function() {

        $('#lviv-primary-menu').superfish({
            delay: 0,
            animation: {
                opacity: 'show'
            },
            speed: 'fast',
            cssArrows: true,
            disableHI: true
        });

    };



    //Date Picker

    $('#date-start, #date-end').datepicker();

    [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function(el) {
        new SelectFx(el);
    });

    // Parallax
    var parallax = function() {
        if (!isiPad() || !isiPhone()) {
            $(window).stellar();
        }
    };


    // Offcanvas and cloning of the main menu
    var offcanvas = function() {

        var $clone = $('#lviv-menu-wrap').clone();
        $clone.attr({
            'id': 'offcanvas-menu'
        });
        $clone.find('> ul').attr({
            'class': '',
            'id': ''
        });

        $('#lviv-page').prepend($clone);
        $('#lviv-page').prepend($clone);

        // click the burger
        $('.js-lviv-nav-toggle').on('click', function() {

            if ($('body').hasClass('lviv-offcanvas')) {
                $('body').removeClass('lviv-offcanvas');
            } else {
                $('body').addClass('lviv-offcanvas');
            }
            // event.preventDefault();

        });

        $('#offcanvas-menu').css('height', $(window).height());

        $(window).resize(function() {
            var w = $(window);


            $('#offcanvas-menu').css('height', w.height());

            if (w.width() > 769) {
                if ($('body').hasClass('lviv-offcanvas')) {
                    $('body').removeClass('lviv-offcanvas');
                }
            }
        });
    };


    // Click outside of the Mobile Menu
    var mobileMenuOutsideClick = function() {
        $(document).click(function(e) {
            var container = $("#offcanvas-menu, .js-lviv-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('lviv-offcanvas')) {
                    $('body').removeClass('lviv-offcanvas');
                }
            }
        });
    };


    // Animations
    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint(function(direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function() {

                    $('body .animate-box.item-animate').each(function(k) {
                        var el = $(this);
                        setTimeout(function() {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 50, 'easeInOutExpo');
                    });
                }, 100);
            }
        }, {
            offset: '85%'
        });
    };

    var stickyBanner = function() {
        var $stickyElement = $('.sticky-banner');
        var sticky;
        if ($stickyElement.length) {
            sticky = new Waypoint.Sticky({
                element: $stickyElement[0],
                offset: 0
            });
        }
    };

    // Highlight the current MenuItem
    var changeMenuItemColor = function() {
        var href = (window.location.href + '').slice(-9, -5);
        var menuItems = document.querySelectorAll('#lviv-primary-menu>li');
        for (var i = 0; i < menuItems.length; i++) {
            var foo = menuItems[i].innerText.toLowerCase();
            if (href.includes("ndex")) {
                menuItems[i].classList.add("active");
                break;
            }
            if (foo.includes(href)) {
                menuItems[i].classList.add("active");
                break;
            }
        }
    };

    // Document on load.
    $(function() {
        mainMenu();
        changeMenuItemColor();
        parallax();
        offcanvas();
        mobileMenuOutsideClick();
        contentWayPoint();
        stickyBanner();
    });


}());
