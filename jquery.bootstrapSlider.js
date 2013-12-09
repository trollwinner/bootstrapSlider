//v.2.1 itglx.com
(function( $ ) {
    $.fn.bootstrapSlider = function(options) {
        return this.each(function() {
            var defaultOptions = {
                speed : 150,
                offsetCount : 1,
                delay : false,
                hideNav : false,
                responsive : true,
                paginationUl : false
            };
            options = $.extend( defaultOptions, options );
            var slide = $(this).find('.slide');
            var prev = $(this).find('.prev');
            var next = $(this).find('.next');
            var slideParent = slide.parent();
            var childrenCount = slide.children().length;
            var unit = '%';
            var offset = 0;
            var temp = 0;
            var bufferLeft = 0;
            var x = 0;

            if (options.hideNav) {
                prev.css({'visibility': 'hidden'});
                next.css({'visibility': 'hidden'});
            }
            if (slide.children(':first-child').outerWidth(true)*childrenCount > slideParent.width()) {
                slide.children().each(function () {
                    temp += $(this).outerWidth(true);
                    if (temp <= slideParent.width()) {
                        x++;
                    }
                });
                if(x==0) {x=1;}
                var oneChildIinPx = (slide.parent().width()) / x;
                var slideWidthInPx = childrenCount * 3 * oneChildIinPx;
                var slideWidthIinPc = 100 / (slide.parent().width() / slideWidthInPx);
                var oneChildWidthInPc = 100 / (slideWidthInPx / oneChildIinPx);
                var slideCssWidth, oneChildWidth, oneChildOffset = 0;
                var childCss = {};
                if(x==1) {
                    childCss['float'] = 'left';
                }
                if(options.responsive) {
                    slideCssWidth = slideWidthIinPc;
                    oneChildWidth = oneChildWidthInPc;
                    oneChildOffset = (slideWidthIinPc / 3) / childrenCount;
                } else {
                    unit = 'px';
                    slideCssWidth = slideWidthInPx;
                    oneChildWidth = oneChildIinPx;
                    oneChildOffset = oneChildIinPx;
                }
                childCss['width'] = oneChildWidth + unit;
                bufferLeft = -(slideCssWidth / 3);

                //adding css
                slideParent.css({
                    'overflow': 'hidden'
                });
                slide.css({
                    'position': 'relative',
                    'width': slideCssWidth + unit,
                    'left': bufferLeft + unit,
                    'overflow': 'hidden'
                });
                slide.children().css(childCss);

                //clone children
                $(slide.children()).clone().appendTo(slide).addClass('clone').clone().prependTo(slide).addClass('clone');

                //pagination
                if (options.paginationUl) {
                    var pagg = $(this).find(options.paginationUl);
                    var paggHtml = '';
                    var array = [];
                    temp = childrenCount;
                    for (var i = 1; i <= Math.ceil(childrenCount / options.offsetCount); i++) {
                        array[i] = temp;
                        temp = temp - options.offsetCount;
                    }
                    array = array.reverse();
                    for (i = 1; i <= Math.ceil(childrenCount / options.offsetCount); i++) {
                        paggHtml = paggHtml + '<li data-num="' + (array[i - 1]) + '">' + i + '</li>';
                    }
                    pagg.html('').append(paggHtml);
                    pagg.children('li:first-child').addClass('active');
                    pagg.children('li').on('click', function () {
                        if (slide.is(':animated')) {return false;}
                        var num = $(this).attr('data-num');
                        pagg.children('li').removeClass('active');
                        $(this).addClass('active');
                        bufferLeft = -Math.abs((slideCssWidth / 3) + (oneChildOffset * (num - 1)));
                        slide.animate({
                            left: bufferLeft + unit
                        }, options.speed);
                        return true;
                    });
                }

                //work
                function work(x) {
                    if (slide.is(':animated')) {return false;}
                    //limits
                    if ((-bufferLeft + -x * options.offsetCount * oneChildOffset) > childrenCount * oneChildOffset * 2) {
                        offset = -(childrenCount * oneChildOffset * -2);
                        bufferLeft = -Math.abs(offset);
                    } else if (-1 * (-bufferLeft + -x * options.offsetCount * oneChildOffset) > -childrenCount * oneChildOffset && bufferLeft != -childrenCount * oneChildOffset) {
                        offset = (-childrenCount * oneChildOffset);
                        bufferLeft = -Math.abs(offset);
                    }
                    else {
                        offset = options.offsetCount * oneChildOffset + (bufferLeft * x);
                        bufferLeft = -Math.abs(offset);
                    }
                    //pagination change
                    if (options.paginationUl) {
                        if (x == -1) {
                            if (pagg.children('li.active').is(':last-child')) {
                                pagg.children('li.active').removeClass('active');
                                pagg.children('li:first-child').addClass('active');
                            }
                            else {
                                pagg.children('li.active').removeClass('active').next().addClass('active');
                            }
                        }
                        else {
                            if (pagg.children('li.active').is(':first-child')) {
                                pagg.children('li.active').removeClass('active');
                                pagg.children('li:last-child').addClass('active');
                            }
                            else {
                                pagg.children('li.active').removeClass('active').prev().addClass('active');
                            }
                        }
                    }

                    slide.animate({
                        left: (x * offset) + unit
                    }, options.speed, '', slideLimit(x * offset));
                    return true;
                }

                function slideLimit(str) {
                    setTimeout(f, options.speed + 50);
                    function f() {
                        if (-str < childrenCount * oneChildOffset) {
                            bufferLeft = str + (-childrenCount * oneChildOffset);
                            slide.css('left', bufferLeft + unit);
                        }
                        if (-str >= (childrenCount * oneChildOffset * 2)) {
                            bufferLeft = (-childrenCount * oneChildOffset);
                            slide.css('left', bufferLeft + unit);
                        }
                    }
                }

                //auto play
                if (options.delay) {
                    var blocked = false;
                    window.onblur = function () {
                        blocked = true;
                    };
                    window.onfocus = function () {
                        blocked = false;
                    };
                    $(this).hover(function () {
                        blocked = true;
                    }, function () {
                        blocked = false;
                    });
                    setInterval(function () {
                        if (!blocked) {
                            next.click();
                        }
                    }, options.delay);
                }

                next.on('click', function(){work(-1);});
                prev.on('click', function(){work(1);});
            }
            else {
                prev.css({'visibility': 'hidden'});
                next.css({'visibility': 'hidden'});
            }
            return true;
        });
    };
})(jQuery);


