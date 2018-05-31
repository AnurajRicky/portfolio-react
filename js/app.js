(function ($) {
    'use strict';
    var $window = $(window);

    var support = { animations: Modernizr.cssanimations },
        container = document.getElementById('ip-container'),
        header = container.querySelector('header.ip-header'),
        loader = new PathLoader(document.getElementById('ip-loader-circle')),
        animEndEventNames = { 'WebkitAnimation': 'webkitAnimationEnd', 'OAnimation': 'oAnimationEnd', 'msAnimation': 'MSAnimationEnd', 'animation': 'animationend' },
        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

    function init() {
        var onEndInitialAnimation = function () {
            if (support.animations) {
                this.removeEventListener(animEndEventName, onEndInitialAnimation);
            }

            startLoading();
        };

        // disable scrolling
        window.addEventListener('scroll', noscroll);
        // classie.add(document.body,'no-scroll');

        // initial animation
        classie.add(container, 'loading');

        if (support.animations) {
            container.addEventListener(animEndEventName, onEndInitialAnimation);
        }
        else {
            onEndInitialAnimation();
        }
    }

    function startLoading() {
        // simulate loading something..
        var simulationFn = function (instance) {
            var progress = 0,
                interval = setInterval(function () {
                    progress = Math.min(progress + Math.random() * 0.1, 1);

                    instance.setProgress(progress);

                    // reached the end
                    if (progress === 1) {
                        classie.remove(container, 'loading');
                        classie.add(container, 'loaded');
                        
                        clearInterval(interval);
                       
                        var onEndHeaderAnimation = function (ev) {
                            if (support.animations) {
                                if (ev.target !== header) return;
                                this.removeEventListener(animEndEventName, onEndHeaderAnimation);
                            }
                            
                            classie.add(document.body, 'layout-switch');
                            window.removeEventListener('scroll', noscroll);
                            // classie.remove(document.body, 'no-scroll');
                           
                        };

                        if (support.animations) {
                            header.addEventListener(animEndEventName, onEndHeaderAnimation);
                        }
                        else {
                            onEndHeaderAnimation();
                        }
                    }
                }, 80);
        };

        loader.setProgressFn(simulationFn);
    }

    function noscroll() { 
        window.scrollTo(0, 0);      
    }

    init();


    

    if ($window.width() > 767) {
        new WOW().init();
    }

    if ($.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    }

    $window.on('scroll', function () {
        var header_sec = $('.header_sec'),
            stick = 'sticky slideInDown',
            logo_anim = 'wobble',
            logo = $('#logo');
        
        if ($window.scrollTop() > 48) {
            $(header_sec).addClass(stick);
            $(logo).removeClass(logo_anim);
        } else {
            $(header_sec).removeClass(stick);
            $(logo).addClass(logo_anim);
        }
    });

})(jQuery);