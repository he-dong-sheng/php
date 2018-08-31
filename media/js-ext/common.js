/**
 * Created by jizhang on 14-9-18.
 */
jQuery.extend({
    bsConfirm: function(msg, callback, title) {
        var ele = jQuery('#BsCBox');
        if (ele.length == 0) {
            var _html = '<div id="BsCBox" class="modal hide fade in portlet box yellow">\
                            <div class="modal-header portlet-title">\
                                <h3></h3>\
                            </div>\
                            <div class="modal-body portlet-body" style="text-align: center"></div>\
                            <div class="modal-footer">\
                                <button class="btn btn-large black pull-left" style="width: 180px;">确认</button>\
                                <button data-dismiss="modal" class="btn btn-large" style="width: 180px;">取消</button>\
                            </div>\
                        </form>\
                    </div>';
            var ele = jQuery(_html);
            ele.appendTo('body');
        }
        var _eleHeader = ele.find('.modal-header');
        var _eleBody = ele.find('.modal-body');
        var _eleOkButton = ele.find('.modal-footer').find('.black');

        _eleHeader.find('h3').html('');
        _eleHeader.css("border-bottom", "1px solid #eee");
        if (typeof title != 'undefined' && jQuery.trim(title) != "") {
            _eleHeader.find('h3').html(title);
        } else {
            //_eleHeader.css("border-bottom", "none");
            _eleHeader.find('h3').html('<i class="icon-question-sign"></i> 确认');
        }
        if (typeof msg == 'undefined' || jQuery.trim(msg) == "") {
            msg = "请确认操作";
        }
        _eleBody.html(msg);
        _eleBody.css("padding", "30px 15px");
        _eleOkButton.unbind('click');
        if (typeof callback == 'function') {
            _eleOkButton.click(function(){
                callback();
                ele.modal('hide');
            });
        }
        ele.modal();
    },

    bsAlert: function(msg, callback, title, btnTxt) {
        if (typeof btnTxt == 'undefined') {
            btnTxt = "确定";
        }
        var ele = jQuery('#BsABox');
        if (ele.length == 0) {
            var _html = '<div id="BsABox" class="modal hide fade in portlet box yellow">\
                            <div class="modal-header portlet-title">\
                                <h3></h3>\
                            </div>\
                            <div class="modal-body portlet-body" style="text-align: center"></div>\
                            <div class="modal-footer" style="text-align: center">\
                                <button data-dismiss="modal" class="btn btn-large black" style="width: 180px;">'+btnTxt+'</button>\
                            </div>\
                        </form>\
                    </div>';
            var ele = jQuery(_html);
            ele.appendTo('body');
        }
        var _eleHeader = ele.find('.modal-header');
        var _eleBody = ele.find('.modal-body');

        _eleHeader.find('h3').html('');
        _eleHeader.css("border-bottom", "1px solid #eee");
        if (typeof title != 'undefined' && jQuery.trim(title) != "") {
            _eleHeader.find('h3').html(title);
        } else {
            //_eleHeader.css("border-bottom", "none");
            _eleHeader.find('h3').html('<i class="icon-bell"></i> 提示');
        }
        if (typeof msg == 'undefined' || jQuery.trim(msg) == "") {
            msg = "通知";
        }
        _eleBody.html(msg);
        _eleBody.css("padding", "30px 15px");
        ele.on('hidden', function(){});
        if (typeof callback == 'function') {
            ele.on('hidden', function(){
                callback();
                ele.modal('hide');
            });
        }
        ele.modal();
    },

    /**
     * /
     * @param  {[String]}   msg       [提示内容]
     * @param  {[boolean]}  autoClose [弹窗是否自动消失]
     * @param  {Function}   callback  [回调函数]
     * @param  {[num]}      time      [秒数]
     * @param  {[String]}   btnTxt    [按钮内容]
     */
    autoHide: function(msg, autoClose, callback, time, btnTxt) {

        var option = {
                msg: msg || '通知',
                callback: callback,
                time: time || 2000,
                btnTxt: btnTxt,
                autoClose: true
            };

        if(autoClose === false){option.autoClose = false};

        var ele = jQuery('#autoHide');
        if (ele.length == 0) {
            var _html = '<div id="autoHide" style="width: 500px;margin-left: -250px;" class="modal hide fade in portlet box yellow">\
                            <div class="modal-header portlet-title">\
                                <button type="button" class="close"></button>\
                            </div>\
                            <div class="modal-body portlet-body" style="text-align: center"></div>\
                            <div class="modal-footer '+(option.btnTxt? 'show': 'hide')+'" style="text-align: center">\
                                <button class="btn btn-large isok" style="width: 180px;">'+ ('确定' || option.btnTxt) +'</button>\
                            </div>\
                        </div>';
            var ele = jQuery(_html);
            ele.appendTo('body');
        }
        var _eleHeader = ele.find('.modal-header');
        var _eleBody = ele.find('.modal-body');

        _eleBody.html(option.msg);
        _eleBody.css("padding", "30px 15px");

        if(option.autoClose) {
            setTimeout(function() {
                ele.modal('hide');
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }, option.time);
        }

        ele.on('click', '.close', function(){
            ele.modal('hide');
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
        ele.on('click', '.isok', function(){
            ele.modal('hide');
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
        ele.modal({backdrop: 'static'});
    }
});
