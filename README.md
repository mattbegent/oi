# oi!

A tiny form validation library for custom error messages

## Getting started

1. Download oi.js and include it at the bottom of your HTML `<script src="oi.min.js"></script>`
2. Initialise oi using `oi.init();`

## Options

* **errorHTML** - the HTML for the error messages.
* **errorPosition** - the position that the error message is display relative to the field. The error message is placed using insertAdjacentHTML so valid values are beforebegin and afterend.
* **interactedClass** - the class that signals a field has been interacted with.
* **watchInputs** - a boolean for whether to display input messages on change or not.
* **error** - this function is fired when an input is invalid.

A full example:
```
oi.init({
    errorHTML: '<label class="form__error-message" for="{{id}}" data-oi-id="{{id}}" role="alert">{{message}}</label>',
    errorClass: 'form__error-message',
    errorPosition: 'afterend'
    interactedClass:'field--interacted',
    watchInputs: true,
    error: function(input) {
        alert('Error');
    }
});
```
## Messages

Custom error messages are what oi! is all about. Adding the following on inputs displays the relevent error message:

* **data-msg-required** - the message displayed when a required field has a missing value.
* **data-msg-type** - the message displayed when there is a type mismatch. For example, on an input with a type of url where the user hasn't formated the url correctly.
* **data-msg-pattern** - the message displayed when there is a pattern mistmatch.
* **data-msg-short** - the message displayed when a field  with `minlength` is too short.
* **data-msg-long** - the message displayed when a field  with `maxlength` is too long.
* **data-msg-custom** - the message displayed when a field has a custom error on it.
* **data-msg** - this is used when you only want to display one message no matter what the error type.

If you don't specify a message, the error message shown fallbacks to the error message from the browser.

An example with multiple messages:
```
 <input id="name" type="text" required="required" maxlength="20" 
 data-msg-required="This is field is required. If you wouldn't mind sir." <!-- Required message -->
 data-msg-long="This is field should be less than 20 characters. If you wouldn't mind sir." <!-- Too long message--> />
```

An example where the browser message would be shown:
```
 <input id="name" type="text" required="required" /><!-- In Chrome this would say "Please fill out this field." -->
```

## Styling Errors

oi! adds a class of `field--interacted` to fields that the users has interacted with (you can change this in the options). This allows you to style fields using `:invalid` and `:valid` pseudo-classes.
```
.field--interacted:invalid {
	background-color: #df4949;
	color: #FFF;
}

.field--interacted:valid {
	background-color: #00B233;
	color: #FFF;
}
```
You can style the error messages however you like using the class `form__error-message` (you can change this in the options).
```
.form__error-message{
	display: block;
	color: #df4949;
	-webkit-animation-duration: 500ms;
    animation-duration: 500ms;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
	-webkit-animation-name: fadeInUp;
  	animation-name: fadeInUp;
  }
```

## Methods

* **validateInput** - for validating an individual input. It takes an element as it's only argument.
* **validateForm** - for validating a whole form. It takes an element as it's only argument.

Examples:

```
oi.validateInput(document.querySelector('#password1')); // will validate an individual field
oi.validateForm(document.querySelector('#oi')); // will validate all the fields within the oi form
```

## How It Works

oi! uses the excelent HTML constraint validation api. For more detail check out the [mozilla developer page](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation).

## Browser Support

As oi! uses the HTML constraint validation api, it only supports modern browsers - IE10+, Chrome, Firefox, Opera etc. For a full list see [form validation on Can I use](http://caniuse.com/#feat=form-validation).

oi! checks for support as soon as possible, so in older browsers which don't support this feature it will simply fallback to your server side form validation:-).

## Example Form

Here is an [example form](http://mattbegent.github.io/oi/).