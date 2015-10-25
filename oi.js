/**
* @fileOverview oi - A tiny form validation library for custom error messages
* @author Matt Begent
* @version 0.1.0
*/

var oi = (function(document) {

    'use strict';

    var opts = {};

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
            errorHTML: args.errorHTML || '<label class="form__error-message" for="{{id}}" role="alert">{{message}}</label>',
            errorClass: args.errorClass || 'form__error-message',
            errorPosition: args.errorPosition || 'afterend',
            interactedClass: args.interactedClass || 'field--interacted',
            error: args.error || undefined,
            watchInputs: ((args.watchInputs === undefined) ? true : args.watchInputs)
        };

        var inputElem = document.createElement('input');
        if ('required' in inputElem) { // test for validation support - is there a better test?    

            // setup forms
            var forms = document.getElementsByTagName('form');
            for (var i = 0; i < forms.length; i++) {
                setupForm(forms[i]);

                if(opts.watchInputs) {
                    setupInputWatches(forms[i])
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

        if(!currentInput.checkValidity()) {
            currentInput.setAttribute('aria-invalid', 'true');
            setMessage(currentInput);
        } else {
            currentInput.setAttribute('aria-invalid', 'false');
            var errorMessage = document.querySelector('.' + opts.errorClass + '[for="' + currentInput.id + '"]');
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

        if(!context) {
            context = document;
        }

        var fields = context.querySelectorAll('input, select, textarea');
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
        context.querySelector(invalidSelector).focus(); // focus on the first

    }

    /**
    * Set the message for a given input
    * @memberOf oi
    * @param {input} input to set message for
    */
    function setMessage(input) {

        //console.log(input.validity);
        var message =  ((input.validity.valueMissing) ? input.getAttribute('data-msg-required') : false) ||  
        ((input.validity.typeMismatch) ? input.getAttribute('data-msg-type') : false) || 
        ((input.validity.patternMismatch) ? input.getAttribute('data-msg-pattern') : false) || 
        ((input.validity.tooShort) ? input.getAttribute('data-msg-short') : false) || 
        ((input.validity.tooLong) ? input.getAttribute('data-msg-long') : false) || 
        ((input.validity.customError) ? input.getAttribute('data-msg-custom') : false) || 
        input.getAttribute('data-msg') ||
        input.validationMessage;

        var errorMessage = document.querySelector('.' + opts.errorClass + '[for="' + input.id + '"]');
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