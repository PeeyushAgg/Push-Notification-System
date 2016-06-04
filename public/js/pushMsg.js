
$(document).ready(function() {
makeTemplates();

var msg_details = {}

	getDetails.getDetails({},function(r){
		console.log(r);
		clientData = r;

		render('.dropdownContainer', 'dropdown', clientData);

		bind('.selected', function(){
			$('.clientContainer').removeClass('hide');

		});

		bind('.client', function(){
			var name = $(this).text().trim();
			$('.selected').val(name);
			$('.clientContainer').addClass('hide');
			//console.log(name);
			//console.log(clientData)
			//console.log(msg_details)
          msg_details.data = JSLINQ(clientData.data).
                      Where(function(x){ return (x.name == name.trim())
                      }).items[0];
                      console.log(msg_details);

		});



	});

bind('.btnSave', function(){
	//r.data = $('.input').val();
	//console.log
	msg_details.data.text = $('.input').val();
	msg_details.data.url = $('.url').val();
    console.log(msg_details)
	msgSend.postMsg(msg_details, function(err){
		console.log(err);
	})
})

});

var msgSend = new function() {
  this.postMsg = function(x, callback) {
      execute('postMsg', x, callback, callback);

    }
}

var getDetails = new function() {
  this.getDetails = function(x, callback) {
      execute('getDetails', {
      	options: this.options,
      	query: x.query
      },
      function(r){
      	x.data = r;
      	callback(x);
      }, callback);
    }
}
