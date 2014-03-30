/*
 * BootstrapSlider - v.2.3.2
 * https://github.com/trollwinner
 */
(function( $ ) {
    $.fn.bootstrapSlider = function(options) {
        return this.each(function() {
            var defaultOptions = {
                speed : 150,
                offsetCount : 1,
                delay : false,
                autoPlayStopOnHover : true,
                hideNav : false,
                responsive : true,
                paginationUl : false,
                loop : true,
                next : $('.next'),
                prev : $('.prev'),
                slide : $('.slide'),
                easing : 'swing'
            };
            options = $.extend( defaultOptions, options );
            
            var slide = $(this).find(options.slide);
            var prev = $(this).find(options.prev);
            var next = $(this).find(options.next);
            var slideParent = slide.parent();
            var slideParentWrapper = null;
            var childrenCount = slide.children().length;
            var unit = '%';
            var temp = 0;
            var bufferLeft = 0;
            var childrenPerLoop = 0;
            var multiplier = 3;
            if (slideParent.parent()[0] !== $(this)[0]) {
                slideParentWrapper = slideParent.parent();
            }
            if (options.hideNav) {
                prev.css({'visibility': 'hidden'});
                next.css({'visibility': 'hidden'});
            }
            if (!options.loop) {
                multiplier = 1;
            }

            if (slide.children(':first-child').outerWidth(true) * childrenCount > slideParent.width()) {

                slide.children().each(function () {
                    temp += $(this).outerWidth(true);
                    if (temp <= slideParent.width()) {
                        childrenPerLoop++;
                    }
                });

                var childCss = {};
                if (childrenPerLoop == 0) {
                    childrenPerLoop = 1;
                    childCss['float'] = 'left';
                }
                var oneChildIinPx = (slide.parent().width()) / childrenPerLoop;
                var slideWidthInPx = childrenCount * multiplier * oneChildIinPx;
                var slideWidthIinPc = 100 / (slide.parent().width() / slideWidthInPx);
                var oneChildWidthInPc = 100 / (slideWidthInPx / oneChildIinPx);
                var slideCssWidth, oneChildWidth, oneChildOffset = 0;

                if (options.responsive) {
                    slideCssWidth = slideWidthIinPc;
                    oneChildWidth = oneChildWidthInPc;
                    oneChildOffset = (slideWidthIinPc / multiplier) / childrenCount;
                } else {
                    unit = 'px';
                    slideCssWidth = slideWidthInPx;
                    oneChildWidth = oneChildIinPx;
                    oneChildOffset = oneChildIinPx;
                }
                childCss['width'] = oneChildWidth + unit;

                if (options.loop) {
                    bufferLeft = -(slideCssWidth / multiplier);
                    $(slide.children()).clone().appendTo(slide).addClass('clone').clone().prependTo(slide).addClass('clone');
                } else {
                    bufferLeft = 0;
                }

                //adding css
                if (slideParentWrapper != null) {
                    slideParentWrapper.css({
                        'overflow': 'hidden'
                    });
                }
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

                //pagination
                if (options.paginationUl) {
                    var pagination = $(this).find(options.paginationUl);
                    if (options.loop) {
                        loopPaginationCreate();
                        loopPaginationClickDelegate();
                    } else {
                        notLoopPaginationCreate();
                        notLoopPaginationClickDelegate();
                    }
                }

                next.on('click', function() { work(-1);});
                prev.on('click', function() { work(1); });

                //auto play
                if (options.delay) {
                    var blocked = false;
                    window.onblur = function () {
                        blocked = true;
                    };
                    window.onfocus = function () {
                        blocked = false;
                    };
                    if (options.autoPlayStopOnHover) {
                        $(this).hover(function () {
                            blocked = true;
                        }, function () {
                            blocked = false;
                        });
                    }
                    setInterval(function () {
                        if (!blocked) {
                            next.click();
                        }
                    }, options.delay);
                }
            }
            else {
                prev.css({'visibility': 'hidden'});
                next.css({'visibility': 'hidden'});
            }
            return true;

            function loopPaginationCreate() {
                var paginationHtml = '';
                var array = [];
                var x = Math.ceil(childrenCount / options.offsetCount);
                temp = childrenCount;
                for (var i = 1; i <= x; i++) {
                    array[i] = temp;
                    temp = temp - options.offsetCount;
                }
                array = array.reverse();
                for (i = 1; i <= x; i++) {
                    paginationHtml = paginationHtml + '<li data-num="' + (array[i - 1]) + '">' + i + '</li>';
                }
                pagination.html('').append(paginationHtml);
                pagination.children('li:first-child').addClass('active');
                return true;
            }
            function loopPaginationClickDelegate() {
                pagination.children('li').on('click', function () {
                    if (slide.is(':animated')) {return false;}
                    pagination.children('li').removeClass('active');
                    $(this).addClass('active');
                    bufferLeft = -Math.abs((slideCssWidth / multiplier) + (oneChildOffset * ($(this).attr('data-num') - 1)));
                    slide.animate({
                        left: bufferLeft + unit
                    }, options.speed,
                    options.easing);
                    return true;
                });
            }
            function notLoopPaginationCreate() {
                var paginationHtml = '';
                var x = Math.ceil((childrenCount - childrenPerLoop) / options.offsetCount) + 1;
                temp = 0;
                for (var i = 1; i <= x; i++) {
                    paginationHtml = paginationHtml + '<li data-num="' + (temp) + '">' + i + '</li>';
                    temp = temp + options.offsetCount;
                    if (temp > childrenCount - childrenPerLoop ) {
                        temp = childrenCount - childrenPerLoop;
                    }
                }
                pagination.html('').append(paginationHtml);
                pagination.children('li:first-child').addClass('active');
                prev.addClass('disabled');
                return true;
            }
            function notLoopPaginationClickDelegate() {
                pagination.children('li').on('click', function () {
                    if (slide.is(':animated')) {return false;}
                    pagination.children('li').removeClass('active');
                    $(this).addClass('active');
                    bufferLeft = -oneChildOffset * $(this).attr('data-num');
                    next.removeClass('disabled');
                    prev.removeClass('disabled');
                    if ($(this).is(':last-child')) {
                        next.addClass('disabled');
                    } else if ($(this).is(':first-child')) {
                        prev.addClass('disabled');
                    }
                    slide.animate({
                        left: bufferLeft + unit
                    }, options.speed,
                    options.easing);
                    return true;
                });
            }
            function loopPaginationChange(x) {
                if (x == -1) {
                    if (pagination.children('li.active').is(':last-child')) {
                        pagination.children('li.active').removeClass('active');
                        pagination.children('li:first-child').addClass('active');
                    }
                    else {
                        pagination.children('li.active').removeClass('active').next().addClass('active');
                    }
                }
                else {
                    if (pagination.children('li.active').is(':first-child')) {
                        pagination.children('li.active').removeClass('active');
                        pagination.children('li:last-child').addClass('active');
                    }
                    else {
                        pagination.children('li.active').removeClass('active').prev().addClass('active');
                    }
                }
                return true;
            }
            function notLoopPaginationChange(x) {
                if (x == -1) {
                    if (!pagination.children('li.active').is(':last-child')) {
                        next.removeClass('disabled');
                        prev.removeClass('disabled');
                        pagination.children('li.active').removeClass('active').next().addClass('active');
                        if (pagination.children('li.active').is(':last-child')) {
                            next.addClass('disabled');
                        }
                    }
                } else {
                    if (!pagination.children('li.active').is(':first-child')) {
                        next.removeClass('disabled');
                        prev.removeClass('disabled');
                        pagination.children('li.active').removeClass('active').prev().addClass('active');
                        if (pagination.children('li.active').is(':first-child')) {
                            prev.addClass('disabled');
                        }
                    }
                }
                return true;
            }
            function loopEmulate() {
                setTimeout(function() {
                    if (bufferLeft > -childrenCount * oneChildOffset) {
                        bufferLeft = bufferLeft - childrenCount * oneChildOffset;
                        slide.css('left', bufferLeft + unit);
                    }
                    else if (bufferLeft <= (-childrenCount * oneChildOffset * 2)) {
                        bufferLeft = bufferLeft + childrenCount * oneChildOffset;
                        slide.css('left', bufferLeft + unit);
                    }
                }, options.speed + 50);
            }
            function work(x) {
                if (slide.is(':animated')) {return false;}
                if (options.loop) {
                    //if loop
                    if ((bufferLeft + x * options.offsetCount * oneChildOffset) < -childrenCount * oneChildOffset * 2) {
                        bufferLeft = -childrenCount * oneChildOffset * 2;
                    } else if ((bufferLeft + x * options.offsetCount * oneChildOffset) > -childrenCount * oneChildOffset && (bufferLeft != -childrenCount * oneChildOffset)) {
                        bufferLeft = -childrenCount * oneChildOffset;
                    }
                    else {
                        bufferLeft += x * options.offsetCount * oneChildOffset;
                    }
                    slide.animate({
                        left: (bufferLeft) + unit
                    }, options.speed, options.easing, loopEmulate());
                } else {
                    //if not loop
                    if (((bufferLeft + (x * oneChildOffset * options.offsetCount)) <= 0 && x==1) || ((bufferLeft + (x * oneChildOffset * options.offsetCount)) > childrenPerLoop * oneChildOffset - slideCssWidth && x==-1)) {
                        bufferLeft += x * oneChildOffset * options.offsetCount;
                    } else {
                        if (x==1) {
                            bufferLeft = 0;
                        } else {
                            bufferLeft = childrenPerLoop * oneChildOffset - slideCssWidth;
                        }
                    }
                    slide.animate({
                        left: (bufferLeft) + unit
                    }, options.speed, options.easing);
                }
                //pagination change
                if (options.paginationUl) {
                    if (options.loop) {
                        loopPaginationChange(x);
                    } else {
                        notLoopPaginationChange(x);
                    }
                }
                return true;
            }
        });
    };
})(jQuery);
