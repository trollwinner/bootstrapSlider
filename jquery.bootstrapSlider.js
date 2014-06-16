/*
 * BootstrapSlider - v.2.6.0
 * https://github.com/trollwinner
 */
;(function($) {
    $.fn.bootstrapSlider = function(options) {
        var defaultOptions = {
            speed : 150,
            offsetCount : 1,
            delay : false,
            autoPlayStopOnHover : true,
            loop : true,
            repeat: true,
            hideNav : false,
            resize : true,
            unit : '%',
            easing : 'swing',
            paginationUl : false,
            next : $('.next'),
            prev : $('.prev'),
            slide : $('.slide')
        };
        options = $.extend(defaultOptions, options);
        var bootstrapSlider = function(element) {
            var $this = $(element),
                slide = $this.find(options.slide),
                prev = $this.find(options.prev),
                next = $this.find(options.next),
                slideParent = slide.parent(),
                slideParentWrapper = null,
                childrenCount = slide.children().length,
                multiplier = 1,
                oneChildOffset, slideCssWidth, childrenPerLoop, bufferLeft = 0,
                pagination = null,
                letsWork = (slide.children(':first-child').outerWidth(true) * childrenCount > slideParent.width());
            var bootstrapSlider = {
                init: function() {
                    if (slideParent.parent()[0] !== $this[0]) {
                        slideParentWrapper = slideParent.parent();
                    }

                    // hide navs
                    if (options.hideNav) {
                        prev.addClass('hidden');
                        next.addClass('hidden');
                    }

                    // recall calculating if resize option is true
                    if (options.resize) {
                        $(window).resize($.proxy(function () {
                            slide.promise().done($.proxy(function() {
                                // reset styles and state
                                slide.children('.clone').remove();
                                slide.children().css('width', '');
                                slide.css({
                                    'width': '',
                                    left: 0
                                });
                                letsWork = (slide.children(':first-child').outerWidth(true) * childrenCount > slideParent.width());
                                this.workPrepare();
                            }, this));
                        }, this));
                    }

                    //auto play
                    if (options.delay && letsWork) {
                        var blocked = false;
                        window.onblur = function () {
                            blocked = true;
                        };
                        window.onfocus = function () {
                            blocked = false;
                        };
                        if (options.autoPlayStopOnHover) {
                            $this.hover(function () {
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

                    this.workPrepare();
                },
                workPrepare: function () {
                    if (!letsWork) {
                        prev.addClass('disabled').unbind('click');
                        next.addClass('disabled').unbind('click');
                        return true;
                    }

                    prev.removeClass('disabled');
                    next.removeClass('disabled');

                    // clone children for loop effect
                    if (options.loop) {
                        multiplier = 3;
                        $(slide.children()).clone().addClass('clone').appendTo(slide).clone().prependTo(slide);
                    }
                    childrenPerLoop = Math.floor(slideParent.width() / slide.children(':first-child').outerWidth(true));

                    var childCss = {};
                    if (childrenPerLoop === 0) {
                        childrenPerLoop = 1;
                        childCss['float'] = 'left';
                    }
                    var oneChildIinPx = (slide.parent().width()) / childrenPerLoop,
                        slideWidthInPx = childrenCount * multiplier * oneChildIinPx,
                        slideWidthIinPc = 100 / (slide.parent().width() / slideWidthInPx),
                        oneChildWidthInPc = 100 / (slideWidthInPx / oneChildIinPx),
                        oneChildWidth = 0;

                    if (options.unit === 'px') {
                        slideCssWidth = slideWidthInPx;
                        oneChildWidth = oneChildIinPx;
                        oneChildOffset = oneChildIinPx;
                    } else {
                        slideCssWidth = slideWidthIinPc;
                        oneChildWidth = oneChildWidthInPc;
                        oneChildOffset = (slideWidthIinPc / multiplier) / childrenCount;
                    }
                    childCss['width'] = oneChildWidth + options.unit;

                    bufferLeft = options.loop ? -(slideCssWidth / multiplier) : 0;

                    //adding css
                    if (slideParentWrapper !== null) {
                        slideParentWrapper.css({
                            'overflow': 'hidden'
                        });
                    }
                    slideParent.css({
                        'overflow': 'hidden'
                    });
                    slide.css({
                        'position': 'relative',
                        'width': slideCssWidth + options.unit,
                        'left': bufferLeft + options.unit,
                        'overflow': 'hidden'
                    });
                    slide.children().css(childCss);

                    //pagination
                    if (options.paginationUl) {
                        pagination = $this.find(options.paginationUl);
                        this.paginationCreate();
                        this.paginationClickDelegate();
                    }

                    next.on('click', $.proxy(function() {this.buttonClick(-1)}, this));
                    prev.on('click', $.proxy(function() {this.buttonClick(1)}, this));

                    return true;
                },
                paginationCreate: function () {
                    var paginationHtml = '',
                        temp = 0,
                        liClass = pagination.attr('class');
                    liClass = liClass ? 'class="' + liClass.split(' ')[0] + '-item"' : '';
                    if (options.loop) {
                        for (var i = 1, x = 1 ; i <= childrenCount; i += options.offsetCount) {
                            paginationHtml = paginationHtml + '<li '+liClass+' data-num="' + ((slideCssWidth / multiplier) + (oneChildOffset * (i-1))) + '">' + (x++) + '</li>';
                        }
                    } else {
                        for (i = 1, x = Math.ceil((childrenCount - childrenPerLoop) / options.offsetCount) + 1; i <= x; i++) {
                            paginationHtml = paginationHtml + '<li '+liClass+' data-num="' + oneChildOffset * temp + '">' + i + '</li>';
                            temp += options.offsetCount;
                            if (temp > (childrenCount - childrenPerLoop) ) {
                                temp = childrenCount - childrenPerLoop;
                            }
                        }
                    }
                    pagination.html('').append(paginationHtml).children('li:first-child').addClass('active');

                    return true;
                },
                paginationClickDelegate: function () {
                    pagination.children('li').on('click', function () {
                        if (slide.is(':animated')) {
                            return false;
                        }
                        pagination.children('li').removeClass('active');
                        $(this).addClass('active');

                        bufferLeft = -$(this).attr('data-num');
                        slide.animate({
                            left: bufferLeft + options.unit
                        }, options.speed, options.easing);
                        return true;
                    });
                    return true;
                },
                paginationChange: function (x) {

                    var states = {
                        '-1': {
                            'prefix' : ':last-child',
                            'method' : 'next'
                        },
                        '1': {
                            'prefix' : ':first-child',
                            'method' : 'prev'
                        }
                    };
                    if (pagination.children('li.active').is(states[x]['prefix'])) {
                        pagination.children('li.active').removeClass('active');
                        pagination.children(states[-x]['prefix']).addClass('active');
                    }
                    else {
                        pagination.children('li.active').removeClass('active')[states[x]['method']]().addClass('active');
                    }
                    return true;
                },
                loopEmulate: function () {
                    slide.promise().done(function() {
                        if (bufferLeft > -childrenCount * oneChildOffset) {
                            bufferLeft = bufferLeft - childrenCount * oneChildOffset;
                            slide.css('left', bufferLeft + options.unit);
                        }
                        else if (bufferLeft <= (-childrenCount * oneChildOffset * 2)) {
                            bufferLeft = bufferLeft + childrenCount * oneChildOffset;
                            slide.css('left', bufferLeft + options.unit);
                        }
                    });
                },
                buttonClick: function (x) {
                    if (slide.is(':animated')) {return false;}
                    if (options.loop) {
                        //if loop
                        if ((bufferLeft + x * options.offsetCount * oneChildOffset) < -childrenCount * oneChildOffset * 2) {
                            bufferLeft = -childrenCount * oneChildOffset * 2;
                        } else if ((bufferLeft + x * options.offsetCount * oneChildOffset) > -childrenCount * oneChildOffset && (bufferLeft !== -childrenCount * oneChildOffset)) {
                            bufferLeft = -childrenCount * oneChildOffset;
                        }
                        else {
                            bufferLeft += x * options.offsetCount * oneChildOffset;
                        }
                        slide.animate({
                                left: (bufferLeft) + options.unit
                            }, options.speed, options.easing,
                            $.proxy(function() {this.loopEmulate()}, this)
                        );
                    } else {
                        //if not loop
                        if (((bufferLeft + (x * oneChildOffset * options.offsetCount)) <= 0 && x===1)
                            || ((bufferLeft + (x * oneChildOffset * options.offsetCount)) > childrenPerLoop * oneChildOffset - slideCssWidth && x===-1)
                            ) {
                            bufferLeft += x * oneChildOffset * options.offsetCount;
                        } else if (bufferLeft === 0) {
                            bufferLeft = childrenPerLoop * oneChildOffset - slideCssWidth;
                        }
                        else if (bufferLeft === childrenPerLoop * oneChildOffset - slideCssWidth) {
                            bufferLeft = 0;
                        } else {
                            bufferLeft = (x===1) ? 0 : childrenPerLoop * oneChildOffset - slideCssWidth;
                        }
                        slide.animate({
                            left: (bufferLeft) + options.unit
                        }, options.speed, options.easing);
                    }
                    //pagination change
                    if (options.paginationUl) {
                        this.paginationChange(x);
                    }
                    return true;
                }
            };
            return bootstrapSlider.init();
        };
        return this.each(function() {bootstrapSlider(this)});
    };
})(jQuery);
