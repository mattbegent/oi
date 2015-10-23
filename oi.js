/* ==========================================================================
   oi.js
   ========================================================================== */


var oi = (function(document) {

    'use strict';

    var opts = {};

    function init(args) {

        if(!args) {
            args = {};
        }

        opts = {
            errorHTML: args.errorHTML || '<label class="form__error-message" for="{{id}}" role="alert">{{message}}</label>',
            errorClass: args.errorClass || 'form__error-message',
            interactedClass: args.interactedClass || 'field--interacted',
            fallbackMessage: args.fallbackMessage || 'Please correct this field.',
            error: args.error || function() {} // shouldn't really do this
        };

        var inputElem = document.createElement('input');
        if (('required' in inputElem)) { // test for validation support - is there a better test?    

            // setup forms
            var forms = document.getElementsByTagName('form');
            for (var i = 0; i < forms.length; i++) {
                setupForm(forms[i]);
            }
            //setupMatches();
            setupInputWatches();

        }

    }

    // Set up forms
    function setupForm(form) {

        form.noValidate = true;
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                getMessages(this);
                setupInputWatches(this);
            }
        }, true);

    }

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

    // function setupMatch(input) {

    //     var inputToMatchWith = document.getElementById(input.getAttribute('data-match'));
    //     input.addEventListener('change', function() {
    //         checkMatch(input, inputToMatchWith);
    //     }, true);
    //     inputToMatchWith.addEventListener('change', function() {
    //         checkMatch(input, inputToMatchWith);
    //     }, true);

    // }

    // function setupMatches() {

    //     var matchInputs = document.querySelectorAll('[data-match]');
    //     for (var i = 0; i < matchInputs.length; i++) {
    //         setupMatch(matchInputs[i]);
    //     }

    // }

    // function checkMatch(input, inputToMatchWith) {
            
    //     if (input.value !== inputToMatchWith.value) {
    //         setMessage(input);
    //         input.setCustomValidity(input.getAttribute('data-msg-match'));
    //     } else {
    //         input.setCustomValidity('');
    //         var errorMessage = document.querySelector('.' + opts.errorClass + '[for="' + input.id + '"]');
    //         if(errorMessage) {
    //             errorMessage.parentNode.removeChild(errorMessage); // maybe don't remove?
    //         }
    //     }    

    // }

    function getMessages(context) {

        var invalidSelector = 'input:invalid, select:invalid, textarea:invalid';
        var invalidInputs = context.querySelectorAll(invalidSelector);
        for (var i = 0; i < invalidInputs.length; i++) {
            setMessage(invalidInputs[i]);
            invalidInputs[i].classList.add(opts.interactedClass);
        }
        document.querySelector(invalidSelector).focus(); // focus on the first

    }

    function setMessage(input) {

        //console.log(input.validity);
        var message =  ((input.validity.valueMissing) ? input.getAttribute('data-msg-required') : false) ||  
        ((input.validity.typeMismatch) ? input.getAttribute('data-msg-type') : false) || 
        ((input.validity.patternMismatch) ? input.getAttribute('data-msg-pattern') : false) || 
        ((input.validity.tooShort) ? input.getAttribute('data-msg-short') : false) || 
        ((input.validity.tooLong) ? input.getAttribute('data-msg-long') : false) || 
        ((input.validity.customError) ? input.getAttribute('data-msg-custom') : false) || 
        input.getAttribute('data-msg') ||
        input.validationMessage || 
        opts.fallbackMessage;

        var errorMessage = document.querySelector('.' + opts.errorClass + '[for="' + input.id + '"]');
        if(!errorMessage) {
            input.insertAdjacentHTML('afterend', template(opts.errorHTML, { id: input.id, message: message }));
        } else {
            errorMessage.textContent = message;
        }

        opts.error(input);

    }

    function template(s,d){
        for(var p in d) {
            s=s.replace(new RegExp('{{'+p+'}}','g'), d[p]);
        }
        return s;
    }

    return {
        init: init,
        validateInput: validateInput
    };

})(document);