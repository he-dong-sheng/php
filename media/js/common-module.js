var $ = jQuery;
$.extend({
    iSelect: function (ele, opts) {
        var ele = $(ele),
            autoGet = function (selectEle) {
                // 如果默认有值
                var val = selectEle.data('value');
                if (val) {
                    selectEle.find('option').each(function () {
                        if ($(this).val() == val) {
                            $(this).prop('selected', true);
                        } else {
                            $(this).prop('selected', false);
                        }
                    });
                    selectEle.trigger('change');
                }
            };
        if (ele.find('select').length) {
            // 绑定事件
            ele.find('select').off('change').on('change', function () {
                var val = $(this).val(),
                    all = ele.find('select'),
                    index = ele.find('select').index($(this)),
                    next = all.slice(index + 1);
                // init
                next.each(function () {
                    $(this).html($(this).find('option').eq(0))
                });
                // 如果选择默认，则返回
                if (val == 0) return;

                //next all
                // next ele get data
                var nextOne = next.eq(0);
                if (nextOne.length) {
                    var url = nextOne.data('url');
                    if (url) {
                        var config = $.extend(true, {}, {
                            data: 'data',
                            msg: 'msg',
                            args: 'args',
                            dataObj: {
                                value: 'value',
                                text: 'text'
                            }
                        }, opts);
                        var argObj = {};
                        argObj[config.args] = val;
                        $.getJSON(url, argObj, function (resp) {
                            var opsHtml = '';
                            if (resp.code == 0) {
                                if (resp[config.data].length > 0) {
                                    for (var x in resp[config.data]) {
                                        var item = resp[config.data][x];
                                        opsHtml += '<option value="' + item[config.dataObj.value] + '">' + $.iSafeChars(item[config.dataObj.text]) + '</option>'
                                    }
                                    nextOne.append(opsHtml);
                                    autoGet(nextOne);
                                } else {
                                    // alert('返回数据为空')
                                    console.log('返回数据为空');
                                }

                            } else {
                                // alert(resp[config.msg]);
                                console.log(resp[config.msg]);
                            }
                        })
                    } else {
                        alert('请求接口未填写')
                    }
                }

            });


            // 初始化
            autoGet(ele.find('select').eq(0));

        } else {
            alert('找不到select元素');
        }
    },
    iTip: function (ele, opts) {
        var ele = $(ele),
            optObj = $.extend(true, {}, {
                animation: false,
                trigger: 'manual',
                template: '<div class="tooltip i-tip-box" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            }, opts);
        ele.tooltip(optObj);
        var eleTimer,
            boxTimer;
        ele.on('mouseenter', function () {
            clearTimeout(boxTimer);
            ele.tooltip('show');
        });
        ele.on('mouseleave', function () {
            eleTimer = setTimeout(function () {
                ele.tooltip('hide');
            }, 300)
        });
        $(document).on('mouseenter', '.i-tip-box', function () {
            clearTimeout(eleTimer);
            $(this).prev('.i-tip').tooltip('show');
        });
        $(document).on('mouseleave', '.i-tip-box', function () {
            var _t = $(this);
            boxTimer = setTimeout(function () {
                _t.prev('.i-tip').tooltip('hide');
            }, 300)
        });
    },
    iPopover: function (ele, opts) {
        var ele = $(ele),
            optObj = $.extend(true, {}, {
                animation: false,
                trigger: 'manual',
                title: '',
                template: '<div class="popover i-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            }, opts);
        ele.popover(optObj);
        $('html').off('click').on('click', function (e) {
            var tgt = $(e.target).closest('.i-popover');
            if (tgt.length) {
                $('.i-popover').not(tgt).remove()
            } else {
                $('.i-popover').remove()
            }
        });
        ele.on('click', function (e) {
            e.stopPropagation();
            var tgt = ele.next('.i-popover');
            $('.i-popover').not(tgt).remove();
            if (tgt.length) {
                ele.popover('hide');
            } else {
                ele.popover('show');
            }
        })

    },
    iWarning: function (opts) {
        // 参数
        var optsObj = $.extend(true, {}, {
            id: 'iWarning',
            title: '警告',
            content: '<p>这是一条警告</p>',
            btnText: '确定',
            btnClass: '',
            hasTitle: true,
            domReady: null,
            callback: $.noop
        }, opts);

        // 模版
        var ele = $('.i-warning');
        if (ele.length == 0) {
            var html = '<div class="modal hide fade i-warning">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" title="关闭"></button>\
                            <h4></h4>\
                        </div>\
                        <div class="modal-body text-center"></div>\
                        <div class="modal-footer">\
                            <button class="btn" data-dismiss="modal">确定</button>\
                        </div>\
                    </div>';
            $(html).appendTo('body');
            ele = $('.i-warning');
        }

        // id
        ele.attr('id', optsObj.id);
        // 标题
        if(optsObj.hasTitle) {
            ele.find('.modal-header h4').html(optsObj.title);
        }else {
            ele.find('.modal-header h4').html('');
        };
        //内容
        ele.find('.modal-body').html(optsObj.content);
        //按钮
        ele.find('.modal-footer .btn')
            .removeClass(optsObj.btnClass).addClass(optsObj.btnClass)
            .text(optsObj.btnText);
        // callback
        if (typeof optsObj.callback == 'function') {
            ele.find('.modal-footer .btn').off('click').on('click', function (e) {
                typeof optsObj.callback == 'function' && optsObj.callback(e, ele);
                ele.modal('hide');
            })
        }

        //弹窗加载完毕执行的函数
        typeof optsObj.domReady == 'function' && optsObj.domReady(ele);

        // init
        ele.modal()
    },
    iAlert: function (opts) {
        // 参数
        var optsObj = $.extend(true, {}, {
            id: 'iAlert',
            hasTitle: true,
            hasFooter: true,
            title: '提示',
            content: '<p>这是一条提示</p>',
            btnText: '确定',
            align: 'center',
            btnClass: 'blue',
            domReady: null,
            callback: $.noop
        }, opts);

        // 模版
        var ele = $('.i-alert');
        if (ele.length == 0) {
            var html = '<div class="modal hide fade i-alert">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" title="关闭"></button>\
                            <h4></h4>\
                        </div>\
                        <div class="modal-body text-center" style="text-align:'+optsObj.align+'"></div>\
                        <div class="modal-footer  '+(optsObj.hasFooter? 'show': 'hide')+'">\
                            <a class="btn cancel" href="javascript:;" data-dismiss="modal">取消</a>\
                            <a class="btn" href="javascript:;" role="yes"></a>\
                        </div>\
                    </div>';
            $(html).appendTo('body');
            ele = $('.i-alert');
        }

        // id
        ele.attr('id', optsObj.id);
        // 标题
        if (optsObj.hasTitle) {
            ele.find('.modal-header').hasClass('no-title') && ele.find('.modal-header').removeClass('no-title');
            ele.find('.modal-header h4').html(optsObj.title);
        } else {
             ele.find('.modal-header h4').html('');
        }
        //内容
        ele.find('.modal-body').html(optsObj.content);
        //按钮
        ele.find('.modal-footer [role="yes"]')
            .removeClass(optsObj.btnClass).addClass(optsObj.btnClass)
            .text(optsObj.btnText);
        // callback
        if (typeof optsObj.callback == 'function') {
            ele.find('.modal-footer [role="yes"]').off('click').on('click', function (e) {
                typeof optsObj.callback == 'function' && optsObj.callback(e, ele);
                ele.modal('hide');
            })
        }

        //弹窗加载完毕执行的函数
        typeof optsObj.domReady == 'function' && optsObj.domReady(ele);

        // init
        ele.modal()

    },
    iConfirm: function (opts) {
        // 参数
        var optsObj = $.extend(true, {}, {
            id: 'iConfirm',
            classes: '',
            title: '提示',
            hasTitle: true,
            content: '<p>这是一个带表单的弹窗</p>',
            btnText: '确定',
            btnClass: 'blue',
            align: 'right',
            form: {
                action: '',
                method: 'GET'
            },
            domReady: null,
            width: null,
            callback: $.noop
        }, opts);

        // 模版
        var ele = $('.i-confirm');
        if (ele.length == 0) {
            var html = '<div class="modal hide fade i-confirm" style="width:'+(optsObj.width? optsObj.width:560)+'px;">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" title="关闭"></button>\
                                <h4></h4>\
                            </div>\
                            <form>\
                                <div class="modal-body"></div>\
                                <div class="modal-footer" style="text-align:'+optsObj.align+'">\
                                    <button class="btn" data-dismiss="modal">取消</button>\
                                    <button class="btn" type="submit" role="yes"></button>\
                                </div>\
                            </form>\
                        </div>';

            $(html).appendTo('body');
            ele = $('.i-confirm');
        }

        // form
        ele.find('form').length && ele.find('form').attr('action',optsObj.form.action).attr('method',optsObj.form.method);


        // id
        ele.attr('id', optsObj.id);

        // classes
        ele.removeClass(optsObj.classes).addClass(optsObj.classes);

        // 标题
        if (optsObj.hasTitle) {
            ele.find('.modal-header').hasClass('no-title') && ele.find('.modal-header').removeClass('no-title');
            ele.find('.modal-header h4').html(optsObj.title);
        } else {
            ele.find('.modal-header').hasClass('no-title') || ele.find('.modal-header').addClass('no-title');
        }

        //内容
        ele.find('.modal-body').html(optsObj.content);


        //按钮
        ele.find('.modal-footer [role="yes"]')
            .removeClass(optsObj.btnClass).addClass(optsObj.btnClass)
            .text(optsObj.btnText);
        // callback
        ele.find('.modal-footer [role="yes"]').off('click').on('click', function (e) {
            typeof optsObj.callback == 'function' && optsObj.callback(e, ele);
        });

        //弹窗加载完毕执行的函数
        typeof optsObj.domReady == 'function' && optsObj.domReady();
        // init
        ele.modal()
    },
    hasPermission: function (opts) {
        var optsObj = $.extend(true, {}, {
            ele: '', // 触发元素
            url: '', // 请求地址
            errorMsg: '', // 报错信息
            callback: $.noop // 成功的回调函数
        }, opts);

        optsObj.ele.on('click', function (e) {
            e.preventDefault();
            $.getJSON(optsObj.url, function (resp) {
                if (resp.code == 0) {
                    optsObj.callback(optsObj.ele);
                } else {
                    $.iWarning({
                        content: optsObj.errorMsg
                    })
                }
            })

        })


    },
    iStrlen: function (ele) {
        var ele = $(ele),
            max = ele.data('max'),
            getStrLength = function (sStr) {
                var aMatch = sStr.match(/[^\x00-\x80]/g);
                return (sStr.length + (!aMatch ? 0 : aMatch.length));
            };
        // ui
        var ui = '<div class="words-monitor"><span class="current"></span>/<span class="max"></span></div>';
        ele.after($(ui));
        //初始化
        ele.siblings('.words-monitor').find('.current').text(getStrLength(ele.val()) || 0);
        ele.siblings('.words-monitor').find('.max').text(max);


        // 事件
        ele.off('change blur focus input').on('change blur focus input', function () {
            var val = $(this).val(),
                length = getStrLength(val),
                current = $(this).siblings('.words-monitor').find('.current');

            current.text(length);

            if (length <= max) {
                current.hasClass('text-danger') && current.removeClass('text-danger')
            } else {
                current.hasClass('text-danger') || current.addClass('text-danger')
            }

        })

    },
    colorTimeline: function (ele) {
        var ele = $(ele),
            url = ele.data('url'),
            box = '<div class="timeline"></div>',
            startTpl,
            tplFun = function (obj) {
                var tpl = '<div><div class="content"><p class="clf"><span class="type">' + obj.name + "：" + '</span><span class="time">' +
                    obj.time + '</span></p><div class="msg">' + obj.content + '</div></div></div>';
                /*
                 *
                 * type:1、系统信息框黑色  black
                 * 2、代表商/自主招商信息框绿色 azure
                 * 3、招商督导信息框粉色 red
                 * */
                if (obj.type == 1) {
                    return $(tpl).addClass('black')
                } else if (obj.type == 2) {
                    return $(tpl).addClass('azure')
                } else if (obj.type == 3) {
                    return $(tpl).addClass('red')
                } else {
                    alert('can\'t find key [type]');
                }
            },
            addEndStyle = function () {
                var endEle = $('.timeline .end');
                if (endEle.length) {
                    var style = document.createElement("style");
                    var height = 'height:' + (endEle.outerHeight() / 2 - 8) + 'px';
                    style.type = 'text/css';
                    style.innerText = '.timeline:before{' + height + '}';
                    document.head.appendChild(style);
                }
            };

        $.getJSON(url, function (resp) {
            if (resp.code == 0) {
                if (resp.data.length > 0) {
                    var arr = resp.data,
                        html = $(box);
                    // 只有开始
                    if (arr.length == 1) {
                        startTpl = '<div class="start"><p>' +
                            '<span class="time">' + arr[0]['time'] + '</span>' +
                            '<span class="msg">' + arr[0]['content'] + '</span></p></div>';
                        html.append(startTpl);
                    } else {
                        for (var x in arr) {
                            if (x == 0) {
                                // 开始
                                startTpl = '<div class="start"><p>' +
                                    '<span class="time">' + arr[x]['time'] + '</span>' +
                                    '<span class="msg">' + arr[x]['content'] + '</span></p></div>';
                                html.append(startTpl);
                            } else if (x == arr.length - 1) {
                                // 结束
                                tplFun(arr[x]).addClass('end').prependTo(html)
                            } else {
                                tplFun(arr[x]).prependTo(html)
                            }
                        }

                    }
                    // 插入
                    ele.append(html);
                    // end 样式
                    addEndStyle();


                } else {
                    console.log('数据为空');
                }
            } else {
                alert(resp.msg);
            }
        })


    },
    symmetricalTimeline: function (ele) {
        var ele = $(ele),
            url = ele.data('url'),
            box = '<div class="timeline"></div>',
            startTpl,
            tplFun = function (obj, x) {
                var tpl = '<div><div class="content"><p class="clf"><span class="type">' + obj.name + "：" + '</span><span class="time">' +
                    obj.time + '</span></p><div class="msg">' + obj.content + '</div></div></div>';
                if (x % 2 == 0) {
                    return $(tpl).addClass('right')
                } else {
                    return $(tpl).addClass('left')
                }
            },
            addEndStyle = function () {
                var endEle = $('.timeline .end');
                if (endEle.length) {
                    var style = document.createElement("style");
                    var height = 'height:' + (endEle.outerHeight() / 2 - 8) + 'px';
                    style.type = 'text/css';
                    style.innerText = '.timeline:before{' + height + '}';
                    document.head.appendChild(style);
                }
            };

        $.getJSON(url, function (resp) {
            if (resp.code == 0) {
                var arr = resp.data,
                    html = $(box);
                // 只有开始
                startTpl = '<div class="start"><p>' +
                    '<span class="time">' + resp.translateTime + '</span>' +
                    '<span class="msg">' + resp.translateContent + '</span></p></div>';
                html.append(startTpl);
                for (var x in arr) {
                    if (x == arr.length - 1) {
                        // 结束
                        tplFun(arr[x], x).addClass('end').prependTo(html)
                    } else {
                        tplFun(arr[x], x).prependTo(html)
                    }
                }
                // 插入
                ele.append(html);
                // end 样式
                addEndStyle();
            } else {
                alert(resp.msg);
            }
        })


    },
    iSafeChars: function (str) {
        str = String(str);
        str || (str = '');
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#039;');
        return str;
    },
    iReverseChars: function (str) {
        str = String(str);
        str || (str = '');
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, '"');
        str = str.replace(/&#039;/g, "'");
        return str;
    }
});


//初始化配置表单验证插件

$.validator.config({
    msgIcon: ''
});

