var rest = require('restler');

//var postURL = "https://docs.google.com/forms/d/1mh5jD1RfstgrbJPefjyPoM2OyLqsZt6C87g1suQ1TuI/formResponse";
var postURL = "http://localhost"; // Use this in dev mode

function faultCategory(num) {
    switch (parseInt(num)) {
        case 1:
            return "New";
        case 2:
            return "Reported but not rectified";
        case 3:
            return "Reported, rectified but re-occurred";
        case 4:
            return "__other_option__";
        default:
            return "New";
    }
}

function problemUrgency(num) {
    switch (parseInt(num)) {
        case 1:
            return "Very Urgent";
        case 2:
            return "Urgent";
        case 3:
            return "Slightly Urgent";
        case 4:
            return "Can Wait";
        default:
            return "Urgent";
    }
}

function send(URL, Obj, callback) {
    callback = (typeof callback === 'function') ? callback : console.log;
    rest.postJson(URL, Obj).on('complete', function(result, response) {
        var message;
        if (!(result instanceof Error)) {
            message = "Fault reported.";
        } else {
            message = "Unable to report. Try again later.";
        }
        callback(message);
    });
}

function prepareForm(data, user, callback) {
    var postObj = {
        'entry.2132193706': faultCategory(data.faultCategoryOption),
        'entry.2132193706.other_option_response': data.faultCategoryOther,
        'entry.749088216': problemUrgency(data.problemUrgencyOption),
        'entry.2133800720': data.problemLocation,
        'entry.787536878': user.name,
        'entry.1813223989': user.roomNo,
        'entry.1836226199': user.matricNo,
        'entry.2119962668': user.nusEmail,
        'entry.858293967': user.phone,
        'entry.113024073': data.problemDescription,
        'draftResponse': '[,,"6866458541185337193 "] ',
        'pageHistory': "0",
        'fbzx': "6866458541185337193"
    };

    send(postURL, postObj, callback);
}


function report(data, callback) {
    var isValid = data.problemDescription && data.problemLocation && data.problemUrgencyOption && data.faultCategoryOption;
    if (isValid) {
        data.faultCategoryOther = data.faultCategoryOther ? data.faultCategoryOther : "";
        prepareForm(data, {}, callback);
    } else {
        return "invalid data";
    }
}

module.exports = {
    report: report
};
