
// betaalmogelijkheid tonen wanneer radio button wordt aangeklikt

// caching a reference to the dependant/conditional content:
var conditionalContent1 = $('#betaalmogelijkheid'),
// caching a reference to the group of inputs, since we're using that
// same group twice:
    group1 = $('input[type=radio][name=vrijwilligofbetalen]');

// binding the change event-handler:
group1.change(function() {
    // toggling the visibility of the conditionalContent, which will
    // be shown if the assessment returns true and hidden otherwise:
    conditionalContent1.toggle(group1.filter(':checked').val() === 'Yes');
    // triggering the change event on the group, to appropriately show/hide
    // the conditionalContent on page-load/DOM-ready:
}).change();




// adresmogelijkheid tonen wanneer radio button wordt aangeklikt

// caching a reference to the dependant/conditional content:
var conditionalContent2 = $('#locationField'),
// caching a reference to the group of inputs, since we're using that
// same group twice:
    group2 = $('input[type=radio][name=plaats]');

// binding the change event-handler:
group2.change(function() {
    // toggling the visibility of the conditionalContent, which will
    // be shown if the assessment returns true and hidden otherwise:
    conditionalContent2.toggle(group2.filter(':checked').val() === 'Yes');
    // triggering the change event on the group, to appropriately show/hide
    // the conditionalContent on page-load/DOM-ready:
}).change();