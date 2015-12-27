describe("Core oi", function () {

	"use strict";

	it("is available globally", function() { 
		expect(oi).not.toBe(undefined);
	}); 

	it("public methods are available", function() {
		expect(oi.init).not.toBe(undefined); 
		expect(oi.validateInput).not.toBe(undefined);
		expect(oi.validateForm).not.toBe(undefined);
	}); 

	it("private methods are unavailable", function() {
		expect(oi.setupForm).toBe(undefined); 
		expect(oi.matchValidate).toBe(undefined);
		expect(oi.setupInputWatches).toBe(undefined);
		expect(oi.getMessages).toBe(undefined);
		expect(oi.checkUrl).toBe(undefined);
		expect(oi.each).toBe(undefined);
		expect(oi.template).toBe(undefined);
	}); 

	it("browser supports validation constraints", function() {
		expect('required' in document.createElement('input')).not.toBe(undefined); 
	}); 

});