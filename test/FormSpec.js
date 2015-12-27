describe("Form oi", function () {
	
	"use strict";

	it("invalid forms are prevented from submitting", function() { 
		var fixture = '<form action="/" type="post" id="form"><input id="input1" type="text" required="required" /><input id="input2" type="text" required="required" /><button type="submit" id="button">Submit</button></form>';
		document.body.insertAdjacentHTML('afterbegin', fixture);

		oi.init();
		var button = document.getElementById('button');
		button.click();

		expect(form.noValidate).toBe(true);  
		expect(document.querySelectorAll('.oi-message').length).toBe(2);  
	}); 

});