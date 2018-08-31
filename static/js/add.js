var $doc = $(document.body);

//处理时间插件顶起页面
var contentHeight = 0;
$doc.on('click', '#sdate, #edate', function() {

    if(contentHeight == 0) {
        contentHeight = $('.content').height();
    }else {
        contentHeight = $('.content').height()-240;
    }

    $('.content').css('height', contentHeight+240);
});

$('#addPage').length && (function() {

    var hasPackageId = false;//全局变量，是否有礼品包ID(是否是有效的礼品包ID)

    //时间控件
    jQuery(document).ready(function () {
        var _date = new Date();

        // $("#sdate").val(xidiDate().format('yyyy-MM-dd'));
        // $("#edate").val(xidiDate().format('yyyy-MM-dd'));

        $("#sdate").datetimepicker({
            format: 'yyyy-mm-dd',
            minuteStep:1,
            language: 'zh-CN',
            //pickerPosition:'bottom-right',
            autoclose:true,
            minView:2,
            startDate:'2014-01-01'
        }).on("click",function(){
            $("#sdate").datetimepicker("setStartDate", _date);
            //$("#sdate").datetimepicker("setStartDate",_date);
            // $("#sdate").datetimepicker("setEndDate", '2018-09-25');
        }).on('hide', function() {
            var time = xidiDate('2018-08-10').valueOf();

            if(xidiDate($("#sdate").val()).valueOf() > xidiDate($("#edate").val()).valueOf()) {
                $("#edate").val($("#sdate").val());
            }

        });
        $("#edate").datetimepicker({
            format: 'yyyy-mm-dd',
            minuteStep:1,
            minView:2,
            language: 'zh-CN',
            autoclose:true,
            startDate:'2014-01-01',
        }).on("click",function(){
            if($("#sdate").val()!==""){
                $("#edate").datetimepicker("setStartDate",$("#sdate").val());
            }else{
                $("#edate").datetimepicker("setStartDate","2014-01-01");
            }
            // $("#edate").datetimepicker("setEndDate",_date);
        });
    });

    //清空报错文字
    $doc.on('focus', 'input', function() {
        $(this).parent().find(".error").html("");
    });

    $doc.on('blur', 'input[name="packageId"]', function() {
        var  $this = $(this),
            gift_id = $.trim($('input[name="packageId"]').val());

        if(gift_id == '') {
            $this.parent().find(".error").html('礼品包ID不能为空');
            return false;
        }else {
            $this.parent().find(".error").html('');
        }

        $.ajax({
            url: '/ticket/getGift',
            type: 'get',
            dataType: 'json',
            data: {gift_id: gift_id},
            success: function(resp) {

                $('.j_goodsList').remove();

                var ele = '';

                if(!resp.code) {

                    hasPackageId = true;

                    $.each(resp.data.goods, function(i, v) {
                         ele += ' <tr>'
                              +'      <td>'+ v.goods_id+'</td>'
                              +'      <td>'+ (v.xidi_sku != '' ? v.xidi_sku : '--') +'</td>'
                              +'      <td>'+ v.goods_name +'</td>'
                              +'      <td>'+ (v.goods_type == 1? '喜地商品' : '非喜地商品') +'</td>'
                              +'  </tr>';
                    });

                    var HTML = ' <div class="p-20 m-t-10 bg1 j_goodsList">\
                                    <p>礼品包名称：<span>'+ resp.data.gift_name+'</span></p>\
                                    <table class="table table-hover table-bordered">\
                                        <thead>\
                                            <tr>\
                                                <th>商品ID</th>\
                                                <th>喜地商品货号</th>\
                                                <th>商品名称</th>\
                                                <th>商品类型</th>\
                                            </tr>\
                                        </thead>\
                                        <tbody class="j_goods">'+ele+'</tbody>\
                                    </table>\
                                </div>';

                    $this.parent().append(HTML);
                }else {

                    hasPackageId = false;

                    $this.parent().find(".error").html('礼品包ID无效');
                }
            }
        })
    });

    //提交
    $doc.on('click', '#contractSubmit', function() {

        event.preventDefault();

        var static = true;

        var $ticketName = $('input[name="ticketName"]'),
            $packageId  = $('input[name="packageId"]'),
            $publishNum = $('input[name="publishNum"]'),
            $startTime  = $('#sdate'),
            $endTime  = $('#edate');

            if($.trim($ticketName.val()) == '') {
                $ticketName.parent().find(".error").html('兑换券名称不能为空');
                static = false;
            }else if(DataLength($ticketName.val()) > 50) {
                $ticketName.parent().find(".error").html('兑换券名称不能超过50个字符');
                static = false;
            }

            if($.trim($publishNum.val()) == '') {
                $publishNum.parent().find(".error").html('发行数量不能为空');
                static = false;
            }else if(!sInt($publishNum.val())) {
                $publishNum.parent().find(".error").html('请输入大于等于1，小于10000的整数');
                static = false;
            }else if($publishNum.val() >= 10000 || $publishNum.val() <= 0) {
                $publishNum.parent().find(".error").html('请输入大于等于1，小于10000的整数');
                static = false;
            }

            //礼品包ID是否有效
            if(!hasPackageId) {
                static = false;
            }

            if($startTime.val() == '' || $endTime.val() == '') {
                $startTime.parent().find(".error").html('兑换时间不能为空');
                static = false;
            }

            //判断是否为正数
            function sInt(value) {
               var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
               if (!patrn.exec(value)) {
                    return false;
                }
               else {
                    return true;
                  }
              }

        if(static) {
            $.iAlert({
                hasTitle: false,
                content: '<p class="text-center">确定发行该兑换券吗？</p>',
                btnText: '确定',
                btnClass: 'blue',
                callback: function() {
                    $('#form1').submit();
                }
            })

        }else {
            return false;
        }
    });

})();

$('#editPage').length && (function(){

    //时间控件
    jQuery(document).ready(function () {
        var _date = new Date();

        $("#sdate").datetimepicker({
            format: 'yyyy-mm-dd',
            minuteStep:1,
            language: 'zh-CN',
            //pickerPosition:'bottom-right',
            autoclose:true,
            minView:2,
            startDate:'2014-01-01'
        }).on("click",function(){
            $("#sdate").datetimepicker("setStartDate", _date);
        }).on('hide', function() {
            var time = xidiDate('2018-08-10').valueOf();

            if(xidiDate($("#sdate").val()).valueOf() > xidiDate($("#edate").val()).valueOf()) {
                $("#edate").val($("#sdate").val());
            }
        });
        $("#edate").datetimepicker({
            format: 'yyyy-mm-dd',
            minuteStep:1,
            minView:2,
            language: 'zh-CN',
            autoclose:true,
            startDate:'2014-01-01',
        }).on("click",function(){
            if($("#sdate").val()!==""){
                $("#edate").datetimepicker("setStartDate",$("#sdate").val());
            }else{
                $("#edate").datetimepicker("setStartDate","2014-01-01");
            }
        });
    });

    //清空报错文字
    $doc.on('focus', 'input', function() {
        $(this).parent().find(".error").html("");
    });

    //提交
    $doc.on('click', '#contractSubmit', function() {

        event.preventDefault();

        var static = true;

        var $ticketName = $('input[name="ticketName"]'),
            $packageId  = $('input[name="packageId"]'),
            $publishNum = $('input[name="publishNum"]'),
            $startTime  = $('#sdate'),
            $endTime  = $('#edate');

            if($.trim($ticketName.val()) == '') {
                $ticketName.parent().find(".error").html('兑换券名称不能为空');
                static = false;
            }else if(DataLength($ticketName.val()) > 50) {
                $ticketName.parent().find(".error").html('兑换券名称不能超过50个字符');
                static = false;
            }

            if($startTime.val() == '' || $endTime.val() == '') {
                $startTime.parent().find(".error").html('兑换时间不能为空');
                static = false;
            }

            if(static) {
                $('#formEdit').submit();
            }
    });

})()

/**
 * 获取字符串的长度（中文记2个字符，英文记1个字符）
 * @param {string} fData 字符串
 */
function DataLength(fData)
{
    var intLength = 0
    for (var i = 0; i < fData.length; i++)
    {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)){
            intLength = intLength + 2;
        }
        else{
            intLength = intLength + 1;
        }
    }
    return intLength;
}

/**
 * 日期对象处理的封装
 * @param  {Date|string|number} dateStr 日期对象|日期字符串|时间戳
 * @return {Object}
 */
function xidiDate(dateStr)
{
    return new xidiDateCreate(dateStr);
}

// 返回时间
function xidiDateCreate(dateStr)
{
    var oDate;

    if(typeof dateStr === 'string') {

        oDate = new Date(dateStr.replace(/-/g, '/'));  // IE8不支持 2016-01-02 这种字符串转换

    }else if(typeof dateStr === 'number') {

        oDate = new Date(dateStr);

    }else if($.type(dateStr) === "date") {

        oDate = new Date(dateStr.getTime());  // 新建实例，避免对原对象进行覆盖

    }else {

        oDate = new Date();  // 缺省参数，默认为当前时间
    }

    this.date = oDate;
}

// 原型
xidiDateCreate.prototype = {

    /**
     * 返回Date的毫秒级快照
     * @return {Number}
     */
    valueOf: function() {
        return this.date.getTime();
    },


    /**
     * 截取日期时间的日期部分，省略时间部分
     * @return {Date}
     */
    toDatePart: function() {

        var oDate = this.date,
            newDate = new Date(oDate.getFullYear() + '/' + (oDate.getMonth() + 1) + '/' + oDate.getDate());

        return newDate;
    },


    /**
     * 日期时间格式化输出
     * @param  {string} formatStr 格式化字符串，y-年、M-月、d-日、h-时、m-分、s-秒
     * @return {string}
     */
    format: function(formatStr) {

        var oDate = this.date,
            fullYear = oDate.getFullYear(),
            year = (fullYear + '').substring(2),
            month = oDate.getMonth() + 1,
            day = oDate.getDate(),
            hours = oDate.getHours(),
            minutes = oDate.getMinutes(),
            seconds = oDate.getSeconds(),
            result,
            partObj = {
                'yyyy': fullYear,
                'yyy': fullYear,
                'yy': year,
                'y': year,
                'MM': getDoubleNum(month),
                'M': month,
                'dd': getDoubleNum(day),
                'd': day,
                'hh': getDoubleNum(hours),
                'h': hours,
                'mm': getDoubleNum(minutes),
                'm': minutes,
                'ss': getDoubleNum(seconds),
                's': seconds
            };

        // 默认格式
        if(typeof formatStr !== 'string' || formatStr === '') formatStr = 'yyyy-M-d h:m:s';

        // 循环遍历替换
        for(var name in partObj) {

            if(partObj.hasOwnProperty(name)) {

                formatStr = formatStr.replace(new RegExp(name, 'g'), partObj[name]);
            }
        }

        // 返回格式化后的结果
        return formatStr;

        // 返回两位数字
        function getDoubleNum(num)
        {
            return num < 10 ? '0' + num : num;
        }
    },


    /**
     * 按照指定时间部分加减日期
     * @param  {String} partName 时间部分，'second'-秒/'minute'-分/'hour'-时/'day'-天/'month'-月/'year'-年
     * @param  {Number} num      需要变更的数量
     * @return {Date}
     */
    cacl: function(partName, num) {

        var oDate = this.date,
            second = 1000,  // 1秒=1000毫秒
            minute = second * 60,  // 1分=60秒
            hour = minute * 60,  // 1小时=60分
            day = hour * 24,  // 1天=24小时
            timeJSON = {
                'second': second,
                'minute': minute,
                'hour': hour,
                'day': day
            },
            month, year,
            dateValue = oDate.getTime(),
            result;

        if(partName === 'month') {

            month = oDate.getMonth();
            result = oDate.setMonth(month + num);

        }else if(partName === 'year') {

            year = oDate.getFullYear();
            result = oDate.setYear(year + num);

        }else{

            result = dateValue + (timeJSON[partName] || 0) * num;
        }

        this.date = new Date(result);

        return this;
    }
};

