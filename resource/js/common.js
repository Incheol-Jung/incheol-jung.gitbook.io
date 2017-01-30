(function(document, window, $) {
    'use strict';
    var $document = $(document),
        $window = $(window);

    var util = {},
        globalUi = {};

    util.stringToElement = function(string) {
        var template = document.createElement('template');
        template.innerHTML = string;
        return template.content.firstChild;
    };

    globalUi.contentsHashList = {
        init: function() {
            var _this = this,
                postContent = document.getElementById('postContent'),
                contentsTable = document.getElementById('contentsTableWrap'),
                wrap = this.createWrap(),
                headingList,
                depth = [],
                beforeItem,
                beforeDepth;

            if (!contentsTable) {
                return false;
            }

            headingList = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

            headingList.forEach(function(element, key) {
                var data = {
                        'id': element.id,
                        'title': element.innerHTML
                    },
                    nowDepth = parseInt(element.nodeName.toLowerCase().replace('h', '')),
                    item = _this.createItem(data),
                    insertTarget = null;

                if (depth.length > 0) {
                    while (insertTarget === null && depth.length > 0) {
                        beforeDepth = depth.pop();
                        if (beforeDepth < nowDepth) {
                            if (beforeItem.getElementsByTagName('ul').length <= 0) {
                                beforeItem.appendChild(util.stringToElement('<ul></ul>'));
                            }
                            insertTarget = beforeItem.getElementsByTagName('ul')[0];
                            depth.push(beforeDepth);
                        } else {
                            beforeItem = beforeItem.parentElement.closest('li');
                        }
                    }
                }

                if (!insertTarget) {
                    insertTarget = wrap;
                }

                depth.push(nowDepth);
                insertTarget.appendChild(item);
                beforeItem = item;
            });

            contentsTable.appendChild(wrap);

        },
        createItem: function(data) {
            return util.stringToElement(`<li><a href="#${data.id}" class="js-scroll_btn">${data.title}</a></li>`);
        },
        createWrap: function(data) {
            return util.stringToElement('<ul class="contents_table" id="contentsTable"></ul>');
        }
    };

    globalUi.slideToggle = function() {
        var buttonClass = '.js-slide_toggle',
            duration = 500;

        $document.on('click', buttonClass, function() {
            var $target = $($(this).data('target'));

            if (this.classList.contains('is-active')) {
                this.classList.remove('is-active')
                $target.slideUp({
                    duration: duration,
                    complete: function() {
                        this.style.display = '';
                    }
                });
            } else {
                this.classList.add('is-active')
                $target.slideDown(duration);
            }
        });
    };


    globalUi.scrollMove = function(e) {
        var buttonClass = '.js-scroll_btn',
            duration = 500;

        $document.on('click', buttonClass, function(e) {
            var $target = $($(this).attr('href')),
                targetOffset = $target.offset().top - 20;

            e.preventDefault();

            $('body, html').animate({
                scrollTop: targetOffset
            }, duration);
        });
    };


    document.addEventListener("DOMContentLoaded", function(event) {

        globalUi.contentsHashList.init();
        globalUi.slideToggle();
        globalUi.scrollMove();

    });

    $window.scroll(function() {
        var viewportTop = $window.scrollTop();
        if (viewportTop) {
            var viewportBottom = viewportTop + $window.height();
            var footerTop = $('#footer').offset().top;
            if ((footerTop <= viewportBottom) && (footerTop >= viewportTop)) {
                // footer is visible: static above footer
                $('#back-to-top').addClass('static').show();
            } else {
                // footer is invisible: fixed on bottom-right of viewport
                $('#back-to-top').removeClass('static').show();
            }
        } else {
            // already top: hide
            $('#back-to-top').hide();
        }
    });



})(document, window, jQuery);