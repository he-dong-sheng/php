(function() {
	var $doc = $(document.body);

	//自适应弹窗位置
	$('.modal').css('margin-left', - $('.modal').width() / 2);

	//富文本编辑器
	var E = window.wangEditor;
    var editor = new E('#editor');
    // 自定义菜单配置
    editor.customConfig.menus = [];

	editor.customConfig.onchange = function (html) {
        // html 即变化之后的内容
        $('#editor').parent().find(".error").html('');
    };
    // 自定义处理粘贴的文本内容
    editor.customConfig.pasteTextHandle = function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        return content.replace(/(<\/?a.*?>)/g, '');
    };
    editor.create();


	//================================================================================================
	//===================================上传图片start================================================
	//================================================================================================

	// 鼠标悬浮【上传图片】按钮，将上传组件的表单覆盖在其上方
	$doc.on('mouseenter', '.j_uploadBtn', function(){
	    $(this).css('position', 'relative');
	    $(this).append($('#imageUpload'));
	    $('#imageUpload').show();
	    $('#imageUpload').css({
	        width:'100%',
	        height:'100%'
	    });
	});

	// 鼠标离开【上传图片】按钮，将上传组件的表单从其上方转移
	$doc.on('mouseleave', '.j_uploadBtn', function(){
	    $('body').append($('#imageUpload'));
	    $('#imageUpload').hide();
	    $('#imageUpload').css({
	        width:'auto',
	        height:'auto'
	    });
	});

	// 点击上传图片时，获得当前上传部件的容器
	$doc.on('click', '.j_uploadBtn' , function(e) {

	    var $that = $(this);

	    window.currentUpload = $that.parents('.j_uploadBox');
	});

	// 当选择需要上传的图片后，触发上传表单的 submit 事件
	$('#picture').on('change', function(e){

	    // 仅支持 JPG,PNG,JPEG 格式。
	    var img = checkImg($(this));
	    if(!img){return img;}

	    $('#imageUpload').submit();
	});

	// 回调函数，上传完成后，要清空之前的 file值，否则再次上传同一张图片有问题
	window.uploadComplete = function(data) {

	    // 清空 file 字段的值
	    $('#picture').val('');

	    if(!data.code){
	        // 将新上传的图片的url赋值给input作为待上传的字段
	        window.currentUpload.find('.j_uploadInput').val(data.data.images);

	        // 将新上传的图片显示输出
	        window.currentUpload.find('.j_imgShow img').attr('src', data.data.images).show();
	        window.currentUpload.find(".j_imgShow .desc").hide();

	        //清空报错
	        window.currentUpload.find(".error").html('');

	    }else{

	        $.iWarning({
                hasTitle: false,
                content: '<p class="msg">'+data.msg+'</p>',
                btnClass: 'hide'
            });
	    }
	};
	//================================================================================================
	//===================================上传图片end=====================================================
	//================================================================================================


	//页面初始化
	$('.j_imgShow img').each(function() {
		if($(this).attr('src') !== '') {
			$(this).css('display', 'inline');
			$(this).parent().find(".desc").css('display', 'none');
		}
	})

	//选择是否为喜地商品
	$doc.on('change', '.j_goodsType', function() {
		var value = $(this).val();
		if(2 == value) {
			$('.j_goodNum').prop('disabled', true);
			$('.j_goodNum').val('');
		}else {
			$('.j_goodNum').prop('disabled', false);
		}
	});

	//新增商品展示图模块
	$doc.on('click', '.j_addBtn', function() {
		var $this = $(this),
			len = 1;

		var HTML = '<div class="uploadItem j_uploadBox j_uploadItem">\
                        <div class="imgShow j_imgShow">\
                            <img src="../../public/media/image/100.jpg">\
                            <span class="desc">图片显示区域</span>\
                        </div>\
                        <div class="upload-ctrl">\
                            <div class="btn j_uploadBtn">选择图片\
                                <input type="hidden" name="" class="j_uploadInput">\
                            </div>\
                            <div class="btn j_delBtn">删除</div>\
                            <p class="error"></p>\
                        </div>\
                    </div>';

		$this.parent().find('.j_showImgwrap').append(HTML);

		len = $('.j_uploadItem').length;

        if(len >= 30) {
        	$('.j_addBtn').hide();
        }
	});

	//删除商品展示模块
	$doc.on('click', '.j_delBtn', function() {

		var $this = $(this);

		$this.closest('.j_uploadItem').remove();

		var len = $('.j_uploadItem').length;

        if(len < 30) {
        	$('.j_addBtn').show();
        }
	});

	//提交
	$doc.on('click', '.j_submit', function() {

		var static = true;

		var $goodNum = $('.j_goodNum'),
			$goodsName = $('.j_goodsName'),
			$goodsPrice = $('.j_goodsPrice'),
			$editor = $('#editor');

		var showImg = [],
			goodsDec = editor.txt.html();

		var url = $('#submitUrl').val();

			//商品货号
            if($goodNum.length) {
    			if( DataLength($goodNum.val()) > 30) {
    				$goodNum.parent().find(".error").html('商品货号不能超过30个字符');
    				static = false;
    			}else if ($.trim($goodNum.val()) === '') {
    				$goodNum.parent().find(".error").html('商品货号不能为空');
    				static = false;
    			}
    			if ($goodNum.prop('disabled') === true) {
    				$goodNum.parent().find(".error").html('');
    				static = true;
    			}
            }

			//商品名称
			if( DataLength($goodsName.val()) > 56) {
				$goodsName.parent().find(".error").html('商品名称不能超过56个字符');
				static = false;
			}else if ($.trim($goodsName.val()) === '') {
				$goodsName.parent().find(".error").html('商品名称不能为空');
				static = false;
			}

			//商品价格
			if($.trim($goodsPrice.val()) === '') {
				$goodsPrice.parent().find(".error").html('商品价格不能为空');
				static = false;
			}else if($goodsPrice.val() <= 0) {
				$goodsPrice.parent().find(".error").html('商品价格不能小于等于0');
				static = false;
			}else if ($goodsPrice.val() >= 100000) {
				$goodsPrice.parent().find(".error").html('商品价格不能大于等于100000');
				static = false;
			}else if(!sInt( $goodsPrice.val() )) {
				$goodsPrice.parent().find(".error").html('请输入大于0，小于100000的数字');
				static = false;
			}else if($goodsPrice.val().toString().lastIndexOf(".") != -1 && $goodsPrice.val().toString().split(".")[1].length > 2) {
				$goodsPrice.parent().find(".error").html('最多两位小数');
				static = false;
			}

			//富文本编辑器字数
			if (editor.txt.text() === '') {
				$editor.parent().find(".error").html('商品描述不能为空');
				static = false;
			}else if(DataLength(editor.txt.text()) > 1000 ) {
				$editor.parent().find(".error").html('商品描述不能超过1000个字符');
				static = false;
			}

			//图片校验
			$('.j_uploadInput').each(function(i, v) {
				if(v.value === '') {
					static = false;
					$(this).parent().parent().find(".error").html('图片不能为空')
				}
			});

			if($('.j_mainImg').attr("src") == '') {
				$('.j_mainImg').closest(".j_uploadBox").find(".error").html('商品主图不能为空');
				static = false;
			}
			if($('.j_itemImg').length == 1 && $('.j_itemImg').attr("src") == '') {
				$('.j_itemImg').closest(".j_uploadBox").find(".error").html('最少上传一张商品展示图');
				static = false;
			}

			//商品展示图数据
			$('.j_uploadItem .j_uploadInput').each(function(i, v) {
				showImg[i] = v.value;
			});

			if(static) {
				$.ajax({
					url: url,
					type: 'post',
					dataType: 'json',
					data: {
						type: $('input[name="type"]:checked').val(),
						xidiSku: $('.j_goodNum').val(),
						goodsId: $('.j_id').val(),
						goodsName: $('.j_goodsName').val(),
						goodsPrice: $('.j_goodsPrice').val(),
						mainImg: $('input[name="mainImg"]').val(),
						showImg: showImg,
						goodsDec: goodsDec
					},
					success: function(resp) {

						if(!resp.code) {
							$.iWarning({
								hasTitle: false,
				                content: '<p class="msg">'+resp.msg+'</p>',
				                btnClass: 'hide',
				                domReady: function(ele) {
				                	setTimeout(function() {
				                		ele.modal('hide');
				                		window.location.href = "/goods/index";
				                	}, 2000);
				                }
				            })
						}else {
							$.iWarning({
								hasTitle: false,
				                content: '<p class="msg">'+resp.msg+'</p>',
				                btnClass: 'hide',
				                domReady: function(ele) {
				                }
				            })
						}

					}
				});
			};

		// $.autoHide('删除失败');
		// $.iWarning({content:'提交失败'})
	});

	//清空报错文字
	$doc.on('focus', 'input', function() {
		$(this).parent().find(".error").html("");
	});

})();


//判断是否为正数
function sInt(value) {
	var patrn = /^([1-9]\d*|0)(\.\d*[0-9])?$/;
	if (!patrn.exec(value)) {
		return false;
	}
	else {
		return true;
	}
};

/**
 * 获取字符串的长度（中文记2个字符，英文记1个字符）
 * @param {string} fData 字符串
 */
function DataLength(fData)
{
    var intLength = 0;

    if(fData === undefined) {
        return false;
    }

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
 * 检测图片属性
 * @param  {[type]}   obj      [传入一个对象]
 * @param  {Function} callback [回调，暂时没有使用]
 * @param  {[type]}   size     [图片的体积大小，可以为5M,20K,等]
 * @return {[type]}            [description]
 */
function checkImg (obj, callback, size)
{
    var sizeByte ; //把 size 转换为 byte
    var file = obj[0].files[0];

    if($.browser.isIE && $.browser.version < 10){}

    else{

      var type = /image\/(png|jpg|jpeg)/

      if(!type.test(file.type)){
        // jQuery.bsAlert('仅支持 JPG,PNG,JPEG 格式。');
        $.iWarning({
            hasTitle: false,
            hasFooter: false,
            content: '<p class="msg">图片仅支持JPG,PNG,JPEG格式</p>',
            btnClass: 'hide'
        });
        return false;
      }
    }

    return true;
}

(function($){
    var ua = navigator.userAgent,
        match = /(Trident).*rv:([\d.]+)/i.exec(ua) ||
                /(MSIE) ([\d.]+)/i.exec(ua) ||
                /(Firefox)\/([\d.]+)/i.exec(ua) ||
                /(Opera).*version\/([\d.]+)/i.exec(ua) ||
                /(OPR)\/([\d.]+)/i.exec(ua) ||
                /(Chrome)\/([\d.]+) safari\/([\d.]+)/i.exec(ua) ||
                /apple(Webkit).*version\/([\d.]+) safari/i.exec(ua) ||
                [],
        name = match[1] || '',
        nameLower = name.toLowerCase(),
        version = match[2] || '';

    if(nameLower !== 'chrome' && nameLower === 'webkit')
    {
        name = 'Safari';
    }
    else if(nameLower === 'opr')
    {
        name = 'Opera'; // Opera自14.0版本后就使用了Webkit内核，UA字符串中的Opera也因此变更为OPR
    }
    else if(nameLower === 'trident' || nameLower === 'msie')
    {
        name = 'IE'; // IE浏览器从11.0版本开始，在UA中不再包含“MSIE 10.0”类似的信息，与之替代的是：Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
    }

    name = name.toLowerCase();

    $.browser = {
        name: name,   // 浏览器名称（如 'ie', 'firefox', 'safari', 'chrome', 'opera'）
        version: version,         // 浏览器版本（如 '45.0.2454.101'）
        isIE: name === 'ie',
        isLessIE9: !document.getSelection  // IE6~8不支持document.getSelection属性
    };

    // make a console function for ie
    if($.browser.isLessIE9) {
        window.console = {};
        window.console.log = function(){
            return 'ie sucks';
        };
    }
})(jQuery);
