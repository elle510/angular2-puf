/**
 * 
 */

(function( $ ) {
	"use strict";
	
	$.fn.googlePlayMenu = function(url, options) {
        var div = this;
        
		$.ajax({
			type: "POST",
			url: url,
			success: function(data) {
//				console.log(data[0]);
				console.log(div[0]);
				div[0].innerHTML = createMenu(data);
				
				$("li.category").click(function() {
			      if (!$(this).hasClass("hidden")) {
			        $(this).siblings().addClass("hidden");
			        $(this).addClass("current");
			        var index = $(this).index();
			        var offset = (-1 * $(this).height()) * index;
			        $(this).animate({ "top": offset  }, 400 );        
			        $("#" + $(this).data("target")).fadeIn( 500 );
			      }
			    });
				    
			    $(".back-btn").click(function() {
			      $(".menu li").removeClass().css({ "top": "auto" });
			      $(".sub-menu").hide();
			    });
				    
			},
			error: function(request, status, error) {
				//  Function( jqXHR jqXHR, String textStatus, String errorThrown )
				alert(error);
			}
		});
		
    };
    
    // data 는 배열
    function createMenu(data) {
    	var div;
    	var startDiv = "<div class='menu'>";
    	var endDiv = "</div>";
    	var menu = "<ul>";
    	var subMenu = "";
    	var backBtn = "<div class='back-btn'><i class='icon-angle-left'></i></div>";
    	
    	var json = $.parseJSON(data);
    	$.each(json, function( index, value ) {
//    		console.log( index + ": " + value.label );
    		menu += "<li class='category' data-target='"+value.id+"'><i class='"+value.icon+"'></i>"+value.label+"</li>";
    		if(value.children) {
    			subMenu += "<div id='"+value.id+"' class='sub-menu'><ul>";
    			$.each(value.children, function(childIndex, childValue) {
    				subMenu += "<li>"+childValue.label+"</li>";
    			});
    			subMenu += "</ul></div>";
    		}
    	});
    	menu += "</ul>";
    	div = startDiv+menu+subMenu+backBtn+endDiv;
    	return div;
    }
    
    // 예제
    $.fn.openPopup = function() {
        // Open popup code.
    	console.log(this);
    	console.log($(this));
    };
 
    $.fn.closePopup = function() {
        // Close popup code.
    };
 
})( jQuery );