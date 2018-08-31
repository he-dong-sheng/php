/**
 * Created by lxh on 2018/8/20.
 */

//时间控件
jQuery(document).ready(function () {
    $("#sdate").datetimepicker({
        format: 'yyyy-mm-dd',
        minuteStep:1,
        language: 'zh-CN',
        //pickerPosition:'bottom-right',
        autoclose:true,
        minView:2,
        // startDate:'2014-01-01',
    })
    $("#edate").datetimepicker({
        format: 'yyyy-mm-dd',
        minuteStep:1,
        minView:2,
        language: 'zh-CN',
        autoclose:true,
        // startDate:'2014-01-01',
    })
});
//设置分销订单号
$('.setDistriSn').on('click', function () {
    var content = '<div style="margin:0 0 10px 10px;">分销订单号：<input type="input" name="distriSn" ><input type="hidden" name="infoId" value="'+$(this).attr('data-id')+'"></div>';
    if ($(this).attr('data-url')) {
        content += '<input type="hidden" value="1" name="isUrl">';
    }
    $.iConfirm({
        id: 'setDistriSn',
        hasTitle: true,
        title:'设置分销订单号',
        content: content,
        form: {
            action: '/info/setsn',
            method: 'GET',
        }
    });
    $('#setDistriSn form').validator({
        msgClass: 'n-bottom',
        fields:{
            'distriSn': {
                rule: 'required;remote(get:/info/checkDistriSn)',
                msg: {
                    required: '请填写分销订单号',
                }
            }
        }
    })
});
//设置已发货
$('.setDeliver').on('click', function () {
    var content = $('#setDeliver').html();
    content += '<input type="hidden" name="infoId" value="'+$(this).attr('data-id')+'">';
    if ($(this).attr('data-url')) {
        content += '<input type="hidden" value="1" name="isUrl">';
    }
    $.iConfirm({
        id: 'setDelivered',
        hasTitle: true,
        title:'设置已发货',
        content: content,
        form: {
            action: '/info/setDelivered',
            method: 'GET',
        }
    });
    $('#setDelivered form').validator({
        msgClass: 'n-bottom',
        fields:{
            'orderSn': {
                rule: 'required;length(~30, true);remote(get:/info/checkDelivered)',
                msg: {
                    required: '运单号不能为空',
                    length: '运单号不能超过30位'
                }
            }
        }
    })
});
//客服备注
$('.mark').on('click', function () {
    var content = $('#mark').html();
    content += '<input type="hidden" name="infoId" value="'+$(this).attr('data-id')+'">';
    $.iConfirm({
        id: 'mark',
        hasTitle: true,
        title:'添加客服备注',
        content: content,
        form: {
            action: '/info/mark',
            method: 'POST',
        }
    });
    $('#mark form').validator({
        msgClass: 'n-bottom',
        fields:{
            'mark': {
                rule: 'length(~400, true);',
                msg: {
                    length: '不能超过200个汉字'
                }
            }
        }
    })
});

    //修改收货信息 setAddredd
    $('.setAddredd').on('click', function () {
        var content = $('#address').html();

        var province = '',
            city = '',
            zone = '',
            provinceId = '',
            cityId = '',
            zoneId = '';

        $.iAlert({
            id: 'address',
            hasTitle: true,
            title:'修改收货信息',
            content: content,
            align: 'left',
            // width: 800,
            domReady: function() {

                province = $('.j_addrData').data('province'),
                city =  $('.j_addrData').data('city'),
                zone =  $('.j_addrData').data('county'),
                province_id = $('.j_addrData').data('province_id'),
                city_id = $('.j_addrData').data('city_id'),
                county_id = $('.j_addrData').data('county_id');

                addr.init({
                    // 设置省份
                    province: province_id || '',
                    // 设置城市
                    city: city_id || '',
                    // 设置区县，城市下可能没有区县
                    county: county_id || '',
                    // showChoosed: '.j_showAddrChoosed',
                    // 每次地址选择变更执行的回调
                    // 参数addrData，当前地址数据
                    callback: function(addrData){
                        province = addr.data[addrData.province],
                        city = addr.data[addrData.city],
                        zone = addr.data[addrData.county];

                        provinceId = addrData.province;
                        cityId = addrData.city;
                        zoneId = addrData.county;
                    }
                });

               $('.j_provinceTitle').text($('.j_addrData').data('province'));
               $('.j_cityTitle').text($('.j_addrData').data('city'));
               $('.j_countyTitle').text($('.j_addrData').data('county'));
            },
            callback:function() {
                $.ajax({
                    url: '/info/address',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        province: province,
                        city: city,
                        zone: zone,
                        provinceId,
                        cityId,
                        zoneId,
                        address: $('.j_address').val(),
                        name: $('.j_userName').val(),
                        mobile: $('.j_mobile').val(),
                        infoId: $('.j_id').val(),
                    },
                    success: function(resp) {
                        if(!resp.code) {
                            $.iWarning({
                                hasTitle: false,
                                content: '<p class="msg">操作成功！</p>',
                                btnClass: 'hide',
                                domReady: function(ele) {
                                    setTimeout(function(){
                                        ele.modal('hide');
                                        window.location.reload();
                                    }, 2000);
                                }
                            })
                       }else {
                            if(resp.msg){
                                $.iWarning({
                                    hasTitle: false,
                                    content: '<p class="msg">' + resp.msg + '</p>',
                                    btnClass: 'hide',
                                })
                            }else{
                                $.iWarning({
                                    hasTitle: false,
                                    content: '<p class="msg">操作失敗！</p>',
                                    btnClass: 'hide',
                                })
                            }
                       }
                    }
                });
            }
        });


        $('#address form').validator({
            msgClass: 'n-bottom',
            fields:{}
        })
    });
//全选
$('.selectAll').on('click', function () {
    if (this.checked){
        $(".infoId").each(function(){
            $(this).prop("checked", true);
        });
    } else {
        $(".infoId").each(function() {
            $(this).prop("checked", false);
        });
    }
});
$('.importAll').prop('disabled', true);
//是否可点
$('[type=checkbox]').on('click', function () {
    var groupCheckbox=$(".infoId");
    var disable = true;
    for(i=0;i<groupCheckbox.length;i++){
        if(groupCheckbox[i].checked){
            disable = false;
            break;
        }
    }
    if (disable) {
        $('.importAll').prop('disabled', true);
    } else {
        $('.importAll').prop('disabled', false);
    }
});
//下载
$('.importAll').on('click', function () {
    //如果都没选中,不能下载
    $('.importForm').submit();
});
jQuery(document).ready(function () {
    //详情异步加载物流信息
    var sn = $('.delievryInfo').attr('data-sn');
    if (sn != null && sn != undefined && sn !=""){
        var url = '/info/checkDistriSn?distriSn=' + sn;
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function(data){
                var html = '';
                $.each(data.data.list, function (k, v) {
                    html += '<div>' + v.time + v.process + '</div>'
                });
                $('.delievryInfo').html(html);
            }
        });
    }
});
