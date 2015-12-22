/**
* @fileOverview oi - A tiny form validation library for custom error messages
* @author Matt Begent
* @version 0.1.1
*/

var oi = (function(document, undefined) {

    'use strict';

    var opts = {};

    var oiId = 'data-oi-id';

    /**
    * Init oi
    * @memberOf oi
    * @param {args} options for oi
    */
    function init(args) {

        if(!args) {
            args = {};
        }

        opts = {
            formSelector: args.formSelector || document.getElementsByTagName('form'),
            errorHTML: args.errorHTML || '<span class="form__error-message" data-oi-id="{{id}}" role="alert">{{message}}</span>',
            errorPosition: args.errorPosition || 'afterend',
            interactedClass: args.interactedClass || 'field--interacted',
            error: args.error,
            watchInputs: ((args.watchInputs === undefined) ? true : args.watchInputs)
        };

        if ('required' in document.createElement('input')) { // test for validation support - is there a better test?

            // setup forms
            for (var i = 0; i < opts.formSelector.length; i++) {
                setupForm(opts.formSelector[i]);

                if(opts.watchInputs) {
                    setupInputWatches(opts.formSelector[i]);
                }
            }

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
            if (!this.checkValidity()) {
                e.preventDefault();
                getMessages(this);
            }
        }, true);

    }

    /**
    * Validates an individual input
    * @memberOf oi
    * @param {currentInput} input to validate
    */
    function validateInput(currentInput) {

        var ariaInvalid = 'aria-invalid';
        if(!currentInput.checkValidity()) {
            currentInput.setAttribute(ariaInvalid, 'true');
            setMessage(currentInput);
        } else {
            currentInput.setAttribute(ariaInvalid, 'false');
            var errorMessage = document.querySelector('[' + oiId + '="' + currentInput.id + '"]');
            if(errorMessage) {
                errorMessage.parentNode.removeChild(errorMessage); // maybe don't remove?
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
        for (var i = 0; i < fields.length; i++) {

            fields[i].addEventListener('change', function(e) {
                validateInput(e.target);
                e.target.classList.add(opts.interactedClass); // add class to signal interaction
            }, true);

        }

    }

    /**
    * Get all messages for the current context
    * @memberOf oi
    * @param {context} the context to get messages for
    */
    function getMessages(context) {

        var invalidSelector = 'input:invalid, select:invalid, textarea:invalid';
        var invalidInputs = context.querySelectorAll(invalidSelector);
        for (var i = 0; i < invalidInputs.length; i++) {
            setMessage(invalidInputs[i]);
            invalidInputs[i].classList.add(opts.interactedClass);
        }
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

        var inputValidity = input.validity;
        var msgPrefix = 'data-msg';
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

        if(opts.error) {
            opts.error(input);
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
