// logic func -- begin

var str = squel.select();
var array = [];
$(".js-table-in-pad").each(function(index, el) {
	array.push($(this).attr('id'));
});

function init() {
	makeTable($(".js-table-in-list"));
	makeTable($(".js-table-in-pad"));
	makePad($(".js-main-pad"));
	// all table draggable

};

function makeTable(tables) {
	tables.attr('draggable', 'true');
	tables.bind('dragstart', handleDragStart);
};

function makePad(pad) {
	pad.bind('dragenter', handleDragenter);
	pad.bind('dragover', handleDragover);
	pad.bind('drop', handleDragDrop);
	return false;
};
function handleDragStart(e){
	console.log("dragstart");
	e.stopPropagation();
	e.originalEvent.dataTransfer.effectAllowed = 'move';
	e.originalEvent.dataTransfer.setData("tableId", this.id);
	e.originalEvent.dataTransfer.setData("mouseXY", JSON.stringify({"x" : e.originalEvent.offsetX, "y" : e.originalEvent.offsetY}));
	return true;
};
function handleDragenter(e){
	e.preventDefault();
	e.stopPropagation();
	return false;
};
function handleDragover(e){
	e.preventDefault();
	e.stopPropagation();
	return false;
};
function handleDragDrop(e) {
	console.log("dragdrop");
	e.stopPropagation();
	var pad = $(".js-main-pad");
	var id = e.originalEvent.dataTransfer.getData("tableId");
	var newDom = $("#"+id);
	if( array.indexOf(newDom.attr("id").substr(10)) < 0 ){
		array.push(newDom.attr("id").substr(10));
		if(id.match(/^list-/)){
			newDom = newDom.clone(true);
			newDom.attr("id",newDom.attr("id").replace("list-","pad-"));
			newDom.removeClass("table-in-list js-table-in-list");
			newDom.addClass("table-in-pad js-table-in-pad");
	  	newDom.on("click",handleClickCheckBox);
		}
		newDom.css({
			position : "absolute",
			left : e.originalEvent.offsetX - JSON.parse(e.originalEvent.dataTransfer.getData("mouseXY")).x + "px",
			top : e.originalEvent.offsetY - JSON.parse(e.originalEvent.dataTransfer.getData("mouseXY")).y + "px"
			});
		pad.append(newDom);
		var sql_output = $(".sql-output code");
		str.from(newDom.children('div').html());
		sql_output.html(str.toString()+" ;");
		$('code').each(function(i, block) {
		  hljs.highlightBlock(block);
		});
	}else{
		if(newDom.attr("id").match(/^pad-/)){
			newDom.css({
			position : "absolute",
			left : e.originalEvent.offsetX - JSON.parse(e.originalEvent.dataTransfer.getData("mouseXY")).x + "px",
			top : e.originalEvent.offsetY - JSON.parse(e.originalEvent.dataTransfer.getData("mouseXY")).y + "px"
			});
		}
	}
	
	return false;
};

function handleClickCheckBox(e){
	if( e.target.type == "checkbox" && e.target.nextSibling ){
		var sql_output = $(".sql-output code");
		var target = e.target;
		var ss = $(target).next().html();
		str.field(ss);
		console.log(str);
		sql_output.html(str.toString()+" ;");
	  $('code').each(function(i, block) {
		  hljs.highlightBlock(block);
		});
	}
};
// logic func -- end

window.onload = init;


