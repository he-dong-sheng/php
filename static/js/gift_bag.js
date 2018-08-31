(function() {
	var $doc = $(document.body);

	var dataObj = {
		goodsType: 1,
		selectedId: new Array(),
		selectedData: new Array(),
		selectedNum: 0,
	};
	//自适应弹窗位置
	$('.modal').css('margin-left', - $('.modal').width() / 2);

	//清空报错文字
	$doc.on('focus', 'input, textarea', function() {
		$(this).parent().find(".error").html("");
	});
    $doc.on('click','#addgood',function(){
            $("#goodsTable").find(".error").html('');
        }
    );

	//选择是否为喜地商品
	$doc.on('change', '.j_isxidigoods', function() {
		var value = $(this).val();

		dataObj.goodsType = value;
		if(1 == value) {
			$('.j_xidigoods').show();
		}else {
			$('.j_xidigoods').hide();
		}
	});

	//添加商品
	$doc.on('click', '.j_addBtn', function() {
		//对话框
		// $('#myModal').modal({backdrop: 'static'});
        dataObj.goodsType = 0;
 		var content = $('#addGoodsModal').html();

		$.iAlert({
            id: 'addgoods',
            hasTitle: true,
            title:'添加商品',
            content: content,
            align: 'right',
            // width: 800,
            domReady: function() {

            },
            callback:function() {
            	$('.j_selected').html(selectedHTML());
            }
		});

		//自适应弹窗位置
		$('.modal').css('margin-left', - $('.modal').width() / 2);
	});

	//点击弹窗取消按钮
	$doc.on('click', '#addgoods .cancel, #addgoods .close', function() {

		var selectedId = new Array();

		$('.j_add').each(function(i ,v) {

			if($(this).hasClass("j_added")) {
				selectedId.push($(this).closest(".j_addItem").data('goods_id'));
			}
		});

		dataObj.selectedData = array_diffobj(dataObj.selectedData, selectedId);
		dataObj.selectedId = array_diff(dataObj.selectedId, selectedId);

		function array_diff(a, b) {
		    for(var i=0;i<b.length;i++)
		    {
		      for(var j=0;j<a.length;j++)
		      {
		        if(a[j]==b[i]){
		          a.splice(j,1);
		          j=j-1;
		        }
		      }
		    }
		  return a;
		}

		function array_diffobj(a, b) {
		    for(var i=0;i<b.length;i++)
		    {
		      for(var j=0;j<a.length;j++)
		      {
		        if(a[j].goods_id==b[i]){
		          a.splice(j,1);
		          j=j-1;
		        }
		      }
		    }
		  return a;
		}

	});

	$doc.on('click', '.j_search', function() {

		var goodsId = $('.j_goodsId').val(),
			xidigoods = $('.j_xidigoods').val();

		var HTML = '';

		$.ajax({
			url: '/giftpackage/goodsinfo',
			type: 'get',
			dataType: 'json',
			data: {
				goodsId: goodsId,
				goodsType: dataObj.goodsType,
				xidigoods: xidigoods
			},
			success: function(resp) {

				var data = resp.data;

				var selectedId = dataObj.selectedId;

				var temp = []; //临时数组1

				var temparray = [];//临时数组2

				for (var i = 0; i < selectedId.length; i++) {

					temp[selectedId[i]] = true;//把数组B的值当成临时数组1的键并赋值为真

				};

				for (var i = 0; i < data.length; i++) {

					if (temp[data[i].goods_id]) {
						data[i].added = true;

					}else {
						data[i].added = false;
					}

					temparray.push(data[i]);//同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组

				};

				// console.log(temparray)

				$.each(temparray, function(i, v) {

					HTML += '<tr class="j_addItem"'
							+'	data-goods_id="'+temparray[i].goods_id+'"'
					 		+'	data-xidi_sku="'+temparray[i].xidi_sku+'"'
							+'	data-goods_name="'+HTMLEncode(temparray[i].goods_name)+'"'
							+'	data-goods_type="'+temparray[i].goods_type+'"'
							+'	data-goods_price="'+temparray[i].goods_price+'"'
							+'>'
			                +'    <td>'+ temparray[i].goods_id +'</td>'
			                +'    <td>'+ (temparray[i].goods_type == 1&&temparray[i].xidi_sku ? temparray[i].xidi_sku : '--') +'</td>'
			                +'    <td>'+ temparray[i].goods_name +'</td>'
			                +'    <td>'+ (temparray[i].goods_type == 1 ? '喜地商品' : '非喜地商品') +'</td>'
			                +'    <td>'+temparray[i].goods_price +'</td>'
			                +'    <td><a href="javascript:;" class="btn j_add">'+(temparray[i].added ? '已添加' : '添加')+'</a></td>'
			                +'</tr>';

				});

				$('.j_tbody').html(HTML);

				if(HTML === '') {
					$('.j_noResult').show();
				}

				//自适应弹窗位置
				$('.modal').css('margin-left', - $('.modal').width() / 2);
			}
		})

	});

	//点击添加按钮
	$doc.on('click', '.j_add', function() {
		var	$this = $(this);
		var addItemData = $this.closest('.j_addItem').data();
		var goods_id = $this.closest(".j_addItem").data('goods_id');

		if($this.html() == '已添加') {return false;}
		$this.html('已添加');

		$this.addClass("j_added");

		dataObj.selectedData.push(addItemData);

		dataObj.selectedId.push(goods_id);
	});

	//点击删除按钮
	$doc.on('click', '.j_del', function() {
		var	$this = $(this);

		var goods_id = $this.closest(".j_delItem").data('goods_id');

		for(var i=0; i<dataObj.selectedData.length; i++) {

			if(dataObj.selectedData[i].goods_id === goods_id){

				//删除数组元素
				dataObj.selectedData.splice(i, 1);
			}

		}

		//删除数组元素
		dataObj.selectedId.remove(goods_id);


		$('.j_selectedNum').html(dataObj.selectedData.length);

		$this.closest('.j_delItem').remove();

		if($('.j_del').length === 0) {
			$('.j_selectedBox').hide();
		}
	});

	//点击提交按钮
	$doc.on('click', '.j_submit', function() {

		var static = true;

		var $bagName = $('#giftBagName'),
			$packageNote = $('#packageNote');

		if($.trim($bagName.val()) === '') {
			$bagName.parent().find(".error").html('礼品包名称不能为空');
			static = false;
		}else if(DataLength($.trim($bagName.val())) > 40) {
			$bagName.parent().find(".error").html('礼品包名称不能超过40个字符');
			static = false;
		}

		if($.trim($packageNote.val()) === '') {
			$packageNote.parent().find(".error").html('备注不能为空');
			static = false;
		}else if(DataLength($.trim($packageNote.val())) > 400) {
			$packageNote.parent().find(".error").html('备注不能超过400个字符');
			static = false;
		}
        if(!($("#selNum").length>0)||parseInt($("#selNum").html())<1){
            $("#goodsTable").find(".error").html('请添加商品');
            static = false;
        }
		if(static){
        $("#subBtn").attr("disabled",true);
        var data={
                               giftBagName:$.trim($("#giftBagName").val()),
                               packageNote:$.trim($('#packageNote').val()),
                               packageGoods:[],
                          };
        $("#goodsTable .j_delItem .goodsId").each(function(){
        var _this=$(this);
        var goodsId=$.trim(_this.html());
        data.packageGoods.push(goodsId,
                            );
                        });
        $.post("/giftpackage/add",data,function(resp){
            document.write(resp);
        });
       }
	});

	//已选商品
	function selectedHTML() {

		var data = dataObj.selectedData;
		var HTML = '';

		$.each(data, function(i, v) {

			HTML += '<tr class="j_delItem" data-goods_id="'+data[i].goods_id+'">\
			           	<td class="goodsId">'+ data[i].goods_id +'</td>\
	                    <td>'+ (data[i].goods_type == 1&&data[i].xidi_sku ? data[i].xidi_sku : '--') +'</td>\
	                    <td>'+ data[i].goods_name +'</td>\
	                    <td>'+ (data[i].goods_type == 1 ? '喜地商品' : '非喜地商品') +'</td>\
	                    <td><a href="javascript:;" class="btn j_del">删除</a></td>\
			        </tr>';
		});

		if(HTML != '') {
			$('.j_selectedBox').show();
			$('.j_selectedNum').html(dataObj.selectedData.length);
			$('.j_selected').html(HTML);
		}

	}

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

	//删除数组元素
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};

	//HTML转义
	function HTMLEncode(html) {
		var temp = document.createElement("div");
		(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
		var output = temp.innerHTML;
		temp = null;
		return output;
	};

})();

