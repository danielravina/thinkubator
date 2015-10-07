var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main =
{

};

Main.onLoad = function()
{
	this.enableKeys();
	widgetAPI.sendReadyEvent();
	this.init_stuff();
	this.init_sockets()
	this.populate_main_image()
	this.start_slide_show()
};

Main.init_stuff = function(){
	this.$main_image = $("#main-img");
  this.$thumbnails = $("#thumbnails");
  this.socket = io("http://192.168.168.38:3000");
  this.thumbs = [];
  this.interval = null;
  this.slide_show_active = null;
  this.current_index_show = 0;
};


Main.init_sockets = function(callback) {
  var self = this;
	this.socket.on("pictures_ready",function(data){
    for(i in data.pictures) {
      var picture = data.pictures[i]
      if(self.thumbs.indexOf(picture) < 0) {
        self.thumbs.push(picture)
      }
    }
    // self.clear_if_removed(data);
    self.populate_thumbnails();
  });
};

Main.clear_if_removed = function(data) {
  // console.log(this.thumbs)
  console.log(data.pictures.length, this.thumbs.length)
  if(data.pictures.length < this.thumbs.length) {
      console.log("removed!")
      // for(i in this.thumbs) {
      //   var thumb = this.thumb[i];
      //   if (data.pictures.indexOf(thumb) < 0) {
      //     console.log(thumb)
      //     this.thumbs.splice(1, i);
      //     $('#th-'+i).remove()
      //   }

      // }
    }
};
Main.start_slide_show = function() {
	var self = this;
	this.slide_show_active = true
  interval = setInterval(function(){
    self.populate_main_image()
  },3000)

};

Main.stop_slide_show = function() {
	this.slide_show_active = false;
	 clearInterval(interval);
};

Main.populate_thumbnails = function() {
  for(i in this.thumbs) {
    var thumb = this.thumbs[i]
    if($("#th-"+ i).length === 0){
      this.$thumbnails.append(' <li><img src="'+thumb+'" class="th" id="th-'+i+'"></li> ')
    }
  }
};

Main.populate_main_image = function(){
  console.log(this.thumbs, this.current_index_show)
  this.$main_image[0].src = this.thumbs[this.current_index_show]
  this.current_index_show++;
  if(this.current_index_show >= this.thumbs.length) {
    this.current_index_show = 0;
  }
};


Main.onUnload = function()
{

};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Main.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			widgetAPI.sendReturnEvent();
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			break;
		case tvKey.KEY_UP:
			alert("UP");
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER")
			if(this.slide_show_active) {
				this.stop_slide_show()
			} else {
				this.start_slide_show()
			}
			break;
		default:
			alert("Unhandled key");
			break;
	}
};