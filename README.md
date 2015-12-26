# oi!

A tiny form validation library for custom error messages

## Project aims

* Make it easy to style custom error messages instead of the rubbish browser default styling.
* Use HTML constraint validation API to validate forms.
* Be accessible.
* Be as lightweight as possible.
* Be a simple lightweight alternative to jQuery validate.
* Be framework agnostic.

## Getting started

1. Download oi.js and include it at the bottom of your HTML `<script src="oi.min.js"></script>`
2. Initialise oi using `oi.init();`

## Options

* **formSelector** - the elements that oi should be enabled for. By default it's all forms on the page, document.getElementsByTagName('form'). Must be a nodelist.
* **errorHTML** - the HTML for the error messages. This must contain data-oi-id, as this is used to associate with id of the input which has the error.
* **errorPosition** - the position that the error message is display relative to the field. The error message is placed using insertAdjacentHTML so valid values are beforebegin and afterend.
* **interactedClass** - the class that signals a field has been interacted with.
* **watchInputs** - a boolean for whether to display input messages on change or not.
* **onInvalid** - this function is fired when an input is invalid.
* **onValid** - this function is fired when an input is valid.

A full example:
```
oi.init({
    formSelector: document.getElementsByTagName('form'),
    errorHTML: '<span class="oi-message" data-oi-id="{{id}}" role="alert">{{message}}</span>',
    errorClass: 'oi-message',
    errorPosition: 'afterend'
    interactedClass:'oi-has-interacted',
    watchInputs: true,
    onInvalid: function(input) {
        alert('Error!');
    },
    onValid: function(input) {
        alert('Valid!');
    }
});
```
## Messages

Custom error messages are what oi! is all about. Adding the following on inputs displays the relevant error message:

* **data-msg-required** - the message displayed when a required field has a missing value.
* **data-msg-type** - the message displayed when there is a type mismatch. For example, on an input with a type of URL where the user hasn't formatted the URL correctly.
* **data-msg-pattern** or **data-msg-regex** - the message displayed when there is a pattern mismatch.
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

oi! adds a class of `oi-has-interacted` to fields that the users has interacted with (you can change this in the options). This allows you to style fields using `:invalid` and `:valid` pseudo-classes.
```
.oi-has-interacted:invalid {
	background-color: #df4949;
}

.oi-has-interacted:valid {
	background-color: #00B233;
}
```
You can style the error messages however you like using the class `oi-message` (you can change this in the options).
```
.oi-message {
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

oi! uses the excellent HTML constraint validation API. For more detail check out the [Mozilla developer page](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation).

## Browser Support

As oi! uses the HTML constraint validation API, it only supports modern browsers - IE10+, Chrome, Firefox, Opera etc. For a full list see [form validation on Can I use](http://caniuse.com/#feat=form-validation).

oi! checks for support as soon as possible, so in older browsers which don't support this feature it will simply fallback to your server side form validation:-).

## Example Form

Here is an [example form](http://mattbegent.github.io/oi/).
