$(function(){
	var THRESHOLD = .55, DURATION = 400;
	var $window = $(window), $body = $("body"), $docSideNav = $(".docs-sidenav"), $link = $("#scroll-top"), $footer = $(".footer").show();
	if($(".docs-sidebar").length){
		$body.scrollspy({
			target : ".docs-sidebar"
		})
	}
	$link.on("tap click", function(){
		$("html, body").animate({
			scrollTop : 0
		}, DURATION);
		return false
	});
	$window.scroll(function(){
		if($window.scrollTop() > $window.height() * THRESHOLD){
			$link.fadeIn()
		}else{
			$link.hide()
		}
	}).resize(function(){
		var ALIGN_CLASS = "stick-bottom";
		if($body.height() < $window.height()){
			$footer.addClass(ALIGN_CLASS)
		}else{
			$footer.removeClass(ALIGN_CLASS)
		}
	}).trigger("resize").trigger("scroll");
	$docSideNav.on("click tap", "a", function(){
		$body.animate({
			scrollTop : $(this.hash).offset().top
		}, DURATION);
		return false
	});
	if(location.host === "ics.zoomeye.org"){
		$("[data-nav=project]").addClass("active")
	}else{
		$("[data-nav~=" + (location.pathname.split("/")[1] || "search") + "]").addClass("active")
	}
});
Date.prototype.format = function(template){
	var schema = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		S : this.getMilliseconds()
	}, result = template;
	for ( var key in schema){
		if(schema.hasOwnProperty(key) && new RegExp("(" + key + ")").test(template)){
			result = result.replace(RegExp.$1, RegExp.$1.length == 1 ? schema[key] : ("00" + schema[key]).substr(("" + schema[key]).length))
		}
	}
	if(/(y+)/.test(template)){
		result = result.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
	}
	return result
};
$.fx.speeds._default = 200;
(function($){
	"use strict";
	var STORAGE_VERSION = 2;
	if(localStorage && +localStorage.getItem("wtf") < STORAGE_VERSION){
		localStorage.clear()
	}
	var urlToSource = function(name){
		var url = "/static/data/suggest/" + name + ".json";
		var source = new Bloodhound({
			datumTokenizer : Bloodhound.tokenizers.obj.whitespace("v"),
			queryTokenizer : Bloodhound.tokenizers.whitespace,
			limit : 6,
			prefetch : {
				url : url,
				filter : function(list){
					return $.map(list, function(key){
						return $.isArray(key) && key.length == 2 ? {
							title : key[0],
							desc : key[1],
							v : key[0]
						} : {
							title : key,
							v : key
						}
					})
				}
			}
		});
		source.initialize();
		return source.ttAdapter()
	};
	var $input = $("[role=combobox][name=q]"), $form = $("form");
	if($input.length){
		$input.typeahead({
			hint : false,
			highlight : true,
			minLength : 1
		}, {
			name : "app",
			displayKey : "v",
			source : urlToSource("joint"),
			templates : {
				suggestion : Handlebars.compile('<p>{{title}} <span class="muted pull-right">{{desc}}</span></p>'),
				header : ""
			}
		}).on("typeahead:selected", function(event, suggestion, dataset){
			$form.submit()
		}).on("keypress keydown keyup paste change", function(){
		}).filter(".home-search .flex-text").focus()
	}
	function recommendInput(){
		var url = "/search/dork_ajax";
		var dorks = [];
		var length = 0;
		function randomInput(){
			var recommend = "";
			var random = parseInt(Math.random() * length, 10);
			if($input.val() == ""){
				recommend = dorks[random];
				$input.attr("placeholder", recommend)
			}
			setTimeout(function(){
				randomInput()
			}, 3e3)
		}
		$.get(url, {}, function(data){
			dorks = data;
			length = data.length;
			randomInput()
		})
	}
	if($("[role=combobox][name=q]").length){
		setTimeout(function(){
			recommendInput()
		}, 100)
	}
	$form.on("submit", function(){
		var val = $input.val();
		if(val == ""){
			$input.val($input.attr("placeholder"))
		}
	});
	var calFormMarginLeft = document.body.clientWidth < 767 ? false : true;
	if(calFormMarginLeft){
		var $advancedSearchForm = $(".advanced-search form").addClass("transition")
	}
	var $advancedInput = $(".advanced-input");
	var advancedInputWidth = $advancedInput.width();
	var updateFilters = function(fieldset){
		var $fieldset = $(fieldset);
		var target = document.getElementById($fieldset.data("target"));
		var process = function(){
			var filter = this.dataset.filter;
			var tokenized = this.value.match(/"[^"]*"|[^ ,]+/g) || [ this.value ];
			return tokenized.map(function(e){
				return filter + ":" + e
			})
		};
		var query = $fieldset.find("input, select").filter(function(){
			return this.value
		}).map(process).get();
		query.unshift(target.value);
		var fliters = query.join(" ");
		var inputSpan = target.parentNode;
		inputSpan.setAttribute("data-filters", fliters);
		if(calFormMarginLeft){
			if(fliters.length * 12 > advancedInputWidth){
				$advancedSearchForm.css("marginLeft", 0)
			}else{
				$advancedSearchForm.css("marginLeft", "170px")
			}
		}
	};
	var onfilterChange = function(e){
		updateFilters(e.delegateTarget)
	};
	$(".advanced-search fieldset[data-target]").on("keypress keydown keyup paste change", "input", onfilterChange).on("keyup", "input", function(e){
		if(e.keyCode === 13){
			var input = e.delegateTarget.dataset.target;
			var form = document.getElementById(input).form;
			if(form){
				$(form).submit()
			}
		}
	}).on("click change", "select", onfilterChange);
	$(".advanced-search form").submit(function(){
		var inputs = this.getElementsByTagName("input");
		if(inputs.length == 1){
			var input = inputs[0];
			input.value = input.parentNode.dataset.filters;
			this.classList.add("loading")
		}
	});
	$(".advanced-search form input").on("keypress keydown keyup paste change", function(){
		var fieldset = $("[data-target=" + this.id + "]");
		updateFilters(fieldset)
	})
})(jQuery);
$(function(){
	$(".home-search .text ").click(function(){
		$(this).select()
	});
	$(".device > li pre").each(function(){
		this.innerHTML = $.trim(this.innerHTML)
	});
	$("dd").each(function(){
		if(this.innerHTML.match(/http(s)*:\/\/[\w\.]\//)){
		}
	});
	var MAX_HEIGHT = 200;
	var toggleBanner = function(){
		var $pre = $(this);
		var selection = document.getSelection();
		if($pre.hasClass("on") && selection && selection.type === "Range")
			return false;
		$pre.toggleClass("on").css({
			height : $pre.hasClass("on") ? $pre.data("height") : MAX_HEIGHT
		})
	};
	$(".result > li").each(function(){
		var $li = $(this);
		var $pre = $li.find("pre"), preHeight = $pre.outerHeight() + 30;
		if(preHeight > MAX_HEIGHT){
			$pre.data("height", preHeight).addClass("expand").click(toggleBanner)
		}
		var port = +$li.find(".banner i").text(), ip = $.trim($li.find(".ip").text());
		var attached = false;
		var scheme = {
			http : [ 80, 81, 8081, 8080, 5060, 591, 593, 981, 2480 ],
			https : [ 443, 1311 ],
			ftp : [ 21 ]
		};
		for ( var prefix in scheme){
			if(!scheme.hasOwnProperty(prefix))
				continue;
			if(scheme[prefix].indexOf(port) > -1){
				$li.find(".original").attr("href", prefix + "://" + ip + ":" + port).show();
				attached = true;
				break
			}
		}
		if(!attached && $pre.text().match(/^HTTP\//)){
			$li.find(".original").attr("href", "http://" + ip + ":" + port).show()
		}
	});
	if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")){
		if(window.devicePixelRatio > 1){
			$("img[data-retina]").each(function(){
				this.src = $(this).data("retina")
			})
		}else{
			$("img[data-fallback]").each(function(){
				this.src = $(this).data("fallback")
			})
		}
	}
	$(".aggregation .bar-filter").each(function(){
		var max = 0;
		$(this).find("> li > span").each(function(){
			var count = +$(this).data("count");
			if(count > max){
				max = count
			}
		}).each(function(){
			var $span = $(this), count = $span.data("count");
			$span.css("width", count * 60 / max + "%")
		});
		$(this).find("> li > ul > li > span").each(function(){
			var $span = $(this), count = $span.data("count");
			$span.css("width", count * 60 / max + "%")
		})
	});
	$("body").on("click", ".aggregation .bar-filter > li > span", function(){
		var $this = $(this);
		$this.parents(".bar-filter > li").toggleClass("show-version")
	});
	$(".aggregation .bar-filter").addClass("finished").find("li ul").first().parent().addClass("show-version")
});