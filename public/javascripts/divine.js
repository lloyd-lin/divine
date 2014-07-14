$(document).ready(function(){
	$(".zp-index:nth-child(3n+1)").mouseleave(function () {
		$(".zp-quick").hide();
	});
	$(".zp-index:nth-child(3n+1)").mousemove(function () {
		$(".zp-quick").show();
	});
});