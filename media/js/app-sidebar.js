/**
 * Created by zhupengcheng on 2016/11/7.
 */
var isRTL = false;
var handleSidebarAndContentHeight = function () {
    var content = $('.page-content');
    var sidebar = $('.page-sidebar');
    var body = $('body');
    var height;

    if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
        var available_height = $(window).height() - $('.footer').height();
        if (content.height() <  available_height) {
            content.attr('style', 'min-height:' + available_height + 'px !important');
        }
    } else {
        if (body.hasClass('page-sidebar-fixed')) {
            height = _calculateFixedSidebarViewportHeight();
        } else {
            height = sidebar.height() + 20;
        }
        if (height >= content.height()) {
            content.attr('style', 'min-height:' + height + 'px !important');
        }
    }
}

var handleSidebarMenu = function () {
    jQuery('.page-sidebar').on('click', 'li > a', function (e) {
        if ($(this).next().hasClass('sub-menu') == false) {
            if ($('.btn-navbar').hasClass('collapsed') == false) {
                $('.btn-navbar').click();
            }
            return;
        }

        var parent = $(this).parent().parent();

        parent.children('li.open').children('a').children('.arrow').removeClass('open');
        parent.children('li.open').children('.sub-menu').slideUp(200);
        parent.children('li.open').removeClass('open');

        var sub = jQuery(this).next();
        if (sub.is(":visible")) {
            jQuery('.arrow', jQuery(this)).removeClass("open");
            jQuery(this).parent().removeClass("open");
            sub.slideUp(200, function () {
                handleSidebarAndContentHeight();
            });
        } else {
            jQuery('.arrow', jQuery(this)).addClass("open");
            jQuery(this).parent().addClass("open");
            sub.slideDown(200, function () {
                handleSidebarAndContentHeight();
            });
        }

        e.preventDefault();
    });

}

var _calculateFixedSidebarViewportHeight = function () {
    var sidebarHeight = $(window).height() - $('.header').height() + 1;
    if ($('body').hasClass("page-footer-fixed")) {
        sidebarHeight = sidebarHeight - $('.footer').height();
    }

    return sidebarHeight;
}

var handleFixedSidebar = function () {
    var menu = $('.page-sidebar-menu');

    if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
        menu.slimScroll({
            destroy: true
        });
        menu.removeAttr('style');
        $('.page-sidebar').removeAttr('style');
    }

    if ($('.page-sidebar-fixed').size() === 0) {
        handleSidebarAndContentHeight();
        return;
    }

}

var handleFixedSidebarHoverable = function () {
    if ($('body').hasClass('page-sidebar-fixed') === false) {
        return;
    }

    $('.page-sidebar').off('mouseenter').on('mouseenter', function () {
        var body = $('body');

        if ((body.hasClass('page-sidebar-closed') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
            return;
        }

        body.removeClass('page-sidebar-closed').addClass('page-sidebar-hover-on');
        $(this).addClass('page-sidebar-hovering');
        $(this).animate({
            width: sidebarWidth
        }, 400, '', function () {
            $(this).removeClass('page-sidebar-hovering');
        });
    });

    $('.page-sidebar').off('mouseleave').on('mouseleave', function () {
        var body = $('body');

        if ((body.hasClass('page-sidebar-hover-on') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
            return;
        }

        $(this).addClass('page-sidebar-hovering');
        $(this).animate({
            width: sidebarCollapsedWidth
        }, 400, '', function () {
            $('body').addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
            $(this).removeClass('page-sidebar-hovering');
        });
    });
}

var handleSidebarToggler = function () {
    // handle sidebar show/hide
    $('.page-sidebar').on('click', '.sidebar-toggler', function (e) {
        var body = $('body');
        var sidebar = $('.page-sidebar');

        if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
            body.removeClass('page-sidebar-hover-on');
            sidebar.css('width', '').hide().show();
            e.stopPropagation();
            runResponsiveHandlers();
            return;
        }

        $(".sidebar-search", sidebar).removeClass("open");

        if (body.hasClass("page-sidebar-closed")) {
            body.removeClass("page-sidebar-closed");
            if (body.hasClass('page-sidebar-fixed')) {
                sidebar.css('width', '');
            }
        } else {
            body.addClass("page-sidebar-closed");
        }
        runResponsiveHandlers();
    });

    // handle the search bar close
    $('.page-sidebar').on('click', '.sidebar-search .remove', function (e) {
        e.preventDefault();
        $('.sidebar-search').removeClass("open");
    });

    // handle the search query submit on enter press
    $('.page-sidebar').on('keypress', '.sidebar-search input', function (e) {
        if (e.which == 13) {
            window.location.href = "extra_search.html";
            return false; //<---- Add this line
        }
    });

    // handle the search submit
    $('.sidebar-search .submit').on('click', function (e) {
        e.preventDefault();

        if ($('body').hasClass("page-sidebar-closed")) {
            if ($('.sidebar-search').hasClass('open') == false) {
                if ($('.page-sidebar-fixed').size() === 1) {
                    $('.page-sidebar .sidebar-toggler').click(); //trigger sidebar toggle button
                }
                $('.sidebar-search').addClass("open");
            } else {
                window.location.href = "extra_search.html";
            }
        } else {
            window.location.href = "extra_search.html";
        }
    });
};

handleSidebarAndContentHeight();
handleSidebarMenu();
_calculateFixedSidebarViewportHeight();
handleFixedSidebar();
handleFixedSidebarHoverable();
handleSidebarToggler();