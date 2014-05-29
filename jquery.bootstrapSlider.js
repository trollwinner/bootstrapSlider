/*
 * BootstrapSlider - v.2.5
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
                unit = '%',
                multiplier = 1,
                oneChildOffset, slideCssWidth, childrenPerLoop, bufferLeft, temp = 0,
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
                                if (options.loop) {
                                    next.click();
                                } else {
                                    if (!next.hasClass('disabled')) {
                                        next.click();
                                    } else {
                                        prev.addClass('disabled');
                                        next.removeClass('disabled');
                                        bufferLeft = 0;
                                        slide.animate({
                                            left: bufferLeft + unit
                                        }, options.speed, options.easing);
                                        if (options.paginationUl) {
                                            options.paginationUl.children('.active').toggleClass('active');
                                            options.paginationUl.children(':first').toggleClass('active');
                                        }
                                    }
                                }
                            }
                        }, options.delay);
                    }

                    this.workPrepare();
                },
                workPrepare: function () {
                    if (letsWork) {
                        prev.removeClass('disabled');
                        next.removeClass('disabled');

                        // clone children for loop effect
                        if (options.loop) {
                            multiplier = 3;
                            $(slide.children()).clone().appendTo(slide).addClass('clone').clone().prependTo(slide).addClass('clone');
                        }
                        temp = 0;
                        childrenPerLoop = 0;
                        slide.children().each(function () {
                            temp += $(this).outerWidth(true);
                            if (temp <= slideParent.width()) {
                                childrenPerLoop++;
                            }
                        });

                        var childCss = {};
                        if (childrenPerLoop === 0) {
                            childrenPerLoop = 1;
                            childCss['float'] = 'left';
                        }
                        var oneChildIinPx = (slide.parent().width()) / childrenPerLoop;
                        var slideWidthInPx = childrenCount * multiplier * oneChildIinPx;
                        var slideWidthIinPc = 100 / (slide.parent().width() / slideWidthInPx);
                        var oneChildWidthInPc = 100 / (slideWidthInPx / oneChildIinPx);
                        var oneChildWidth = 0;

                        if (options.unit === 'px') {
                            unit = 'px';
                            slideCssWidth = slideWidthInPx;
                            oneChildWidth = oneChildIinPx;
                            oneChildOffset = oneChildIinPx;
                        } else {
                            slideCssWidth = slideWidthIinPc;
                            oneChildWidth = oneChildWidthInPc;
                            oneChildOffset = (slideWidthIinPc / multiplier) / childrenCount;
                        }
                        childCss['width'] = oneChildWidth + unit;

                        if (options.loop) {
                            bufferLeft = -(slideCssWidth / multiplier);
                        } else {
                            bufferLeft = 0;
                        }

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
                            'width': slideCssWidth + unit,
                            'left': bufferLeft + unit,
                            'overflow': 'hidden'
                        });
                        slide.children().css(childCss);

                        //pagination
                        if (options.paginationUl) {
                            pagination = $this.find(options.paginationUl);
                            if (options.loop) {
                                this.loopPaginationCreate();
                                this.loopPaginationClickDelegate();
                            } else {
                                this.notLoopPaginationCreate();
                                this.notLoopPaginationClickDelegate();
                            }
                        }

                        next.on('click', $.proxy(function() {this.work(-1)}, this));
                        prev.on('click', $.proxy(function() {this.work(1)}, this));
                    }
                    else {
                        prev.addClass('disabled').unbind('click');
                        next.addClass('disabled').unbind('click');
                    }
                    return true;
                },
                loopPaginationCreate: function () {
                    var paginationHtml = '',
                        j = 1,
                        liClass = pagination.attr('class');

                    if (liClass) {
                        liClass = 'class="' + liClass.split(' ')[0] + '-item"';
                    } else {
                        liClass = ''
                    }
                    for (var i = 1; i <= childrenCount; i = i + options.offsetCount) {
                        paginationHtml = paginationHtml + '<li '+liClass+' data-num="' + i + '">' + (j++) + '</li>';
                    }
                    pagination.html('').append(paginationHtml);
                    pagination.children('li:first-child').addClass('active');
                    return true;
                } ,
                loopPaginationClickDelegate: function () {
                    pagination.children('li').on('click', function () {
                        if (slide.is(':animated')) {return false;}
                        pagination.children('li').removeClass('active');
                        $(this).addClass('active');
                        bufferLeft = -Math.abs((slideCssWidth / multiplier) + (oneChildOffset * ($(this).attr('data-num') - 1)));
                        slide.animate({
                            left: bufferLeft + unit
                        }, options.speed, options.easing);
                        return true;
                    });
                },
                notLoopPaginationCreate: function () {
                    var paginationHtml = '';
                    var liClass = pagination.attr('class');
                    if (liClass) {
                        liClass = 'class="' + liClass.split(' ')[0] + '-item"';
                    } else {
                        liClass = ''
                    }
                    var x = Math.ceil((childrenCount - childrenPerLoop) / options.offsetCount) + 1;
                    temp = 0;
                    for (var i = 1; i <= x; i++) {
                        paginationHtml = paginationHtml + '<li '+liClass+' data-num="' + (temp) + '">' + i + '</li>';
                        temp = temp + options.offsetCount;
                        if (temp > childrenCount - childrenPerLoop ) {
                            temp = childrenCount - childrenPerLoop;
                        }
                    }
                    pagination.html('').append(paginationHtml);
                    pagination.children('li:first-child').addClass('active');
                    prev.addClass('disabled');
                    return true;
                },
                notLoopPaginationClickDelegate: function () {
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
                        }, options.speed, options.easing);
                        return true;
                    });
                },
                loopPaginationChange: function (x) {
                    if (x === -1) {
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
                },
                notLoopPaginationChange: function (x) {
                    if (x === -1) {
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
                },
                loopEmulate: function () {
                    slide.promise().done(function() {
                        if (bufferLeft > -childrenCount * oneChildOffset) {
                            bufferLeft = bufferLeft - childrenCount * oneChildOffset;
                            slide.css('left', bufferLeft + unit);
                        }
                        else if (bufferLeft <= (-childrenCount * oneChildOffset * 2)) {
                            bufferLeft = bufferLeft + childrenCount * oneChildOffset;
                            slide.css('left', bufferLeft + unit);
                        }
                    });
                },
                work: function (x) {
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
                                left: (bufferLeft) + unit
                            }, options.speed, options.easing,
                            $.proxy(function() {this.loopEmulate()}, this)
                        );
                    } else {
                        //if not loop
                        if (((bufferLeft + (x * oneChildOffset * options.offsetCount)) <= 0 && x===1) || ((bufferLeft + (x * oneChildOffset * options.offsetCount)) > childrenPerLoop * oneChildOffset - slideCssWidth && x===-1)) {
                            bufferLeft += x * oneChildOffset * options.offsetCount;
                        } else {
                            if (x===1) {
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
                            this.loopPaginationChange(x);
                        } else {
                            this.notLoopPaginationChange(x);
                        }
                    }
                    return true;
                }
            };
            return bootstrapSlider.init();
        };
        return this.each(function() {bootstrapSlider(this)});
    };
})(jQuery);
