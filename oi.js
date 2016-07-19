/**
* @fileOverview oi - A tiny form validation library for custom error messages
* @author Matt Begent
* @version 0.2.0
*/

var oi = (function(document, undefined) {

    'use strict';

    var opts = {};

    var oiId = 'data-oi-id';

    var ariaInvalid = 'aria-invalid';

    var msgPrefix = 'data-msg';

    /**
    * Init oi
    * @memberOf oi
    * @param {args} options for oi
    */
    function init(args) {

        args = args || {};

        opts = {
            formSelector: args.formSelector || document.getElementsByTagName('form'),
            errorHTML: args.errorHTML || '<span class="oi-message" ' + oiId + '="{{id}}" role="alert">{{message}}</span>',
            errorPosition: args.errorPosition || 'afterend',
            interactedClass: args.interactedClass || 'oi-has-interacted',
            onInvalid: args.onInvalid,
            onValid: args.onValid,
            watchInputs: ((args.watchInputs === undefined) ? true : args.watchInputs)
        };

        if ('required' in document.createElement('input')) { // test for validation support - is there a better test?

            // setup forms
            each(opts.formSelector, function(item) {
                setupForm(item);
                if(opts.watchInputs) {
                    setupInputWatches(item);
                }
            });

        }

    }

    /**
    * Sets up a form for validation
    * @memberOf oi
    * @param {form} form to set up
    */
    function setupForm(form) {

        form.noValidate = true;
        form.addEventListener('submit', function(e) {
            var self = this;
            if (!self.checkValidity()) {
                e.preventDefault();
                getMessages(self);
            }
        }, true);

    }

    /**
    * Validates an individual input
    * @memberOf oi
    * @param {currentInput} input to validate
    */
    function validateInput(currentInput) {

        matchValidate(currentInput); // if values need to be compared
        if(currentInput.getAttribute('type') === 'url') { // check urls because of protocol
            checkUrl(currentInput);
        }
        if(!currentInput.checkValidity()) {
            setMessage(currentInput);
        } else {
            currentInput.setAttribute(ariaInvalid, 'false');
            var errorMessage = document.querySelector('[' + oiId + '="' + currentInput.id + '"]');
            if(errorMessage) {
                errorMessage.parentNode.removeChild(errorMessage); // maybe don't remove?
            }
            if(opts.onValid) {
                opts.onValid(currentInput);
            }
        }

        currentInput.classList.add(opts.interactedClass);

    }

    /**
    * Compares two fields
    * @memberOf oi
    * @param {currentInput} input to check against
    */
    function matchValidate(currentInput) {

        var sourceInput;
        var copyInput;
        var shouldMatch = false;

        if(currentInput.hasAttribute('data-has-match')) { // source of match
            sourceInput = currentInput;
            copyInput = document.getElementById(currentInput.getAttribute('data-has-match'));
            shouldMatch = true;
        }

        if(currentInput.hasAttribute('data-match')) { // copy of match
            sourceInput = document.getElementById(currentInput.getAttribute('data-match'));
            copyInput = currentInput;
            shouldMatch = true;
        }

        if(shouldMatch && sourceInput && copyInput) {
            if(sourceInput.value !== copyInput.value) {
                copyInput.setCustomValidity(copyInput.getAttribute(msgPrefix + '-match'));
                setMessage(copyInput);
            } else {
                copyInput.setCustomValidity('');
            }
        }
    }

    /**
    * Sets up input watches
    * @memberOf oi
    * @param {context} context of input watches
    */
    function setupInputWatches(context) {

        var fields = (context || document).querySelectorAll('input, select, textarea');
        each(fields, function(item) {
            item.addEventListener('change', function(e) {
                var currentField = e.target;
                validateInput(currentField);
            }, true);

        });

    }

    /**
    * Get all messages for the current context
    * @memberOf oi
    * @param {context} the context to get messages for
    */
    function getMessages(context) {

        // check all invalid inputs and add messages
        var invalidInputs = context.querySelectorAll('input:invalid, select:invalid, textarea:invalid');
        each(invalidInputs, function(item) {
            validateInput(item);
        });

        if(invalidInputs.length > 0) {
            invalidInputs[0].focus(); // focus on the first
        }

    }

    /**
    * Set the message for a given input
    * @memberOf oi
    * @param {input} input to set message for
    */
    function setMessage(input) {

        input.setAttribute(ariaInvalid, 'true');
        var inputValidity = input.validity;
        var message =  ((inputValidity.valueMissing) ? input.getAttribute(msgPrefix + '-required') : false) ||
        ((inputValidity.typeMismatch) ? input.getAttribute(msgPrefix + '-type') : false) ||
        ((inputValidity.patternMismatch) ? input.getAttribute(msgPrefix + '-pattern') : false) ||
        ((inputValidity.patternMismatch) ? input.getAttribute(msgPrefix + '-regex') : false) || // improve
        ((inputValidity.tooShort) ? input.getAttribute(msgPrefix + '-short') : false) ||
        ((inputValidity.tooLong) ? input.getAttribute(msgPrefix + '-long') : false) ||
        ((inputValidity.customError) ? input.getAttribute(msgPrefix + '-custom') : false) ||
        input.getAttribute(msgPrefix) ||
        input.validationMessage; // fallback to the browser default message

        var errorMessage = document.querySelector('[' + oiId + '="' + input.id + '"]');
        if(!errorMessage) {
            input.insertAdjacentHTML(opts.errorPosition, template(opts.errorHTML, { id: input.id, message: message }));
        } else {
            errorMessage.textContent = message;
        }

        if(opts.onInvalid) {
            opts.onInvalid(input);
        }

    }

    /**
    * Checks that url contains a protocol because Chrome etc expects one
    * @memberOf oi
    * @param {input} input to check
    */
    function checkUrl(input) {

        var inputValue = input.value;
        if (inputValue && inputValue.search(/^http[s]?\:\/\//) === -1){
            inputValue = "http://" + inputValue;
        }
        input.value = inputValue;

    }

    /**
    * Simple each utility
    * @memberOf oi
    * @param {value} value to loop through
    * @param {cb} callback on each item
    */
    function each(value, cb) {

        for (var i = 0, len = value.length; i < len; i++) {
            cb(value[i]);
        }

    }

    /**
    * Simple template
    * @memberOf oi
    * @param {templateString} the string to template
    * @param {data} data to replace
    */
    function template(templateString, data) {

        for(var property in data) {
            templateString = templateString.replace(new RegExp('{{'+property+'}}','g'), data[property]);
        }
        return templateString;

    }

    // public api
    return {
        init: init,
        validateInput: validateInput,
        validateForm: getMessages
    };

})(document);
