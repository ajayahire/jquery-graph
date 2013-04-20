/*!
 * jQuery Graph 1.0
 *
 * Copyright 2013, Ajay Ahire (meetajayahire@gmail.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function($) {
  /* Global Settings for Interface
	-----------------------------------------------------------*/
	var bar_details={
		"startX":10, 
		"startY":10, 
		"width":500, 
		"height":230, 
		"strokeStyle":"#333", 
		"font":"10 Verdana", 
		"fillStyle":"#e4182f", 
		"grid":true, 
		"details":true, 
		"maxVal":0, 
		"bar":50, 
		"barWidth":30
	};
	var pi_details={
		"centerX": 150,
		"centerY": 120,
		"start": 0,
		"end": 2 * Math.PI,
		"radius": 70,
		"color": "#999",
		"shade": "#aaa",
		"font": "12px Verdana",
		"font_color": "#666"
	};
	var color_array=Array("#e4182f", "#ffe558", "#0909ff", "#37ff39", "#6800a3", "#f09506", "#f250dd", "#166105", "#2fe0c1", "#225274", "#fa682d", "#ded2ac", "#8b7c00", "#6b6a66", "#eeeeee");
	var methods={
		draw_oval: function(context, setting) {
			if(setting) {$.extend(pi_details, setting);}
			context.save();
			context.translate(pi_details.centerX, pi_details.centerY);
			context.scale(2, 1);
			context.beginPath();
			context.moveTo(0, 0);
			context.arc(0, 0, pi_details.radius, pi_details.start, pi_details.end, false);
			context.closePath();
			context.restore();
			context.fillStyle = pi_details.color;
			context.fill();
		},
		draw_3d_oval: function (context, setting) {
			if(setting) {$.extend(pi_details, setting);}
			$(this).avisGraph("draw_oval", context, setting);
			$(this).avisGraph("draw_oval", context, {"centerY":pi_details.centerY-15, "color":pi_details.shade});
		},
		draw_pi_chart: function (area, setting) {
			var context=$(this).get(0).getContext('2d');
			if(setting) {$.extend(pi_details, setting);}
			var start=0;
			$(this).avisGraph("draw_3d_oval", context, setting);
			if(typeof area == "number") draw_oval(context, {"centerY":pi_details.centerY-15, "start":start, "end":area * 0.02 * Math.PI, "color":color_array[0]});
			else {
				for(i=0;i<area.length;i++) {
					if(i!=0) start += area[i-1].level * 0.02 * Math.PI;
					$(this).avisGraph("draw_oval", context, {"centerY":pi_details.centerY, "start":start, "end":start + area[i].level * 0.02 * Math.PI, "color":color_array[i]});
					context.fillStyle=color_array[i];
					context.fillRect(10,pi_details.centerY+pi_details.radius+(i*15)+20,10,10);
					context.font=pi_details.font;
					context.fillStyle=pi_details.font_color;
					context.fillText(area[i].title+" ("+area[i].level+"%)", 30, pi_details.centerY+pi_details.radius+(i*15)+30);
				}
			}
			pi_details=pi_details_res;
		},
		draw_bar_chart: function (map, setting) {
			var context=$(this).get(0).getContext('2d');
			if(setting) {$.extend(bar_details, setting);setting=bar_details;}
			else $.extend(setting, bar_details);
			var startX=setting.startX;
			var startY=setting.startY;
			var width=setting.width;
			var height=setting.height;

			context.strokeStyle=setting.strokeStyle;
			context.lineWidth = 1;
			context.fillStyle=setting.fillStyle;
			startX=startX+20;
			if(setting.details) {
				context.beginPath();
				context.moveTo(startX,startX);
				context.lineTo(startX,height+startY);
				context.closePath();
				context.stroke(); 
				
				context.beginPath();
				context.moveTo(startX,height+startY);
				context.lineTo(startX+width,height+startY);
				context.closePath();
				context.stroke(); 
			}
			if(setting.maxVal==0) {
				var maxVal=(Math.max.apply(Math,map.map(function(o){return o.level;})));
				var interval=height/(maxVal+10);
				var state=(height-20)/10;
				setting.maxVal=maxVal;
			}
			else {
				var maxVal=setting.maxVal;
				var interval=height/(setting.maxVal+10);
				var state=(height-20)/10;
			}
			context.save();
			context.translate(startX, startY+height);
			context.textAlign = "right";
			if(setting.details) for(i=0;i<10;i++) {
				context.strokeText(Math.floor(i*state/interval), -5, -i*state);
				
				if(i!=0 && setting.grid) {
					context.strokeStyle="#eee";
					context.beginPath();
					context.moveTo(2,-i*state);
					context.lineTo(width,-i*state);
					context.closePath();
					context.stroke();
				
					context.strokeStyle="#333";
					context.beginPath();
					context.moveTo(-2,-i*state);
					context.lineTo(2,-i*state);
					context.closePath();
					context.stroke();
				}
				
			}
			context.restore();
			for(i=0;i<map.length;i++) {
				if(setting.details) {
					context.save();
					context.strokeStyle="#333";
					context.translate(startX+(i*setting.bar)+10, startY+height+10);
					context.rotate(Math.PI/4);
					context.textAlign = "left";
					context.strokeText(map[i].title, 10, 0);
					context.restore();
				}
				
				context.save();
				context.strokeStyle="#999";
				context.translate(startX, startY+height);
				context.fillRect((i*setting.bar)+10, -map[i].level*interval, setting.barWidth, map[i].level*interval-1);
				context.strokeRect((i*setting.bar)+10, -map[i].level*interval, setting.barWidth, map[i].level*interval-2);
				context.restore();
			}
		}};
		$.fn.avisGraph = function( method ) {
			if ( methods[method] ) {
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else {
				$.error('Method '+method+' does not exist on jQuery.avisGraph');
			}    
		};
		var pi_details_res={
			"centerX": 150,
			"centerY": 120,
			"start": 0,
			"end": 2 * Math.PI,
			"radius": 70,
			"color": "#999",
			"shade": "#aaa",
			"font": "12px Verdana",
			"font_color": "#666"
		};
})( jQuery );
