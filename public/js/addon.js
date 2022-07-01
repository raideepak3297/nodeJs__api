/* add-on script */



var domain_id = AP._hostOrigin.replace('https://', '');
domain_id = domain_id.replace('.atlassian.net', '');


var projectOldHistory = false;
var enableInquestPermissionToggle = false;


var deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9.333" height="12" viewBox="0 0 9.333 12"> <g transform="translate(-42.667)"> <g transform="translate(42.667)"> <path d="M64,93.333a1.333,1.333,0,0,0,1.333,1.333h5.333A1.333,1.333,0,0,0,72,93.333v-8H64Z" transform="translate(-63.333 -82.666)" fill="#B2BED4" /><path d="M49.667.667,49,0H45.667L45,.667H42.667V2H52V.667Z" transform="translate(-42.667)" fill="#B2BED4" /></g></g></svg>'
var redDeleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9.333" height="12" viewBox="0 0 9.333 12"> <g transform="translate(-42.667)"> <g transform="translate(42.667)"> <path d="M64,93.333a1.333,1.333,0,0,0,1.333,1.333h5.333A1.333,1.333,0,0,0,72,93.333v-8H64Z" transform="translate(-63.333 -82.666)" fill="#DF4C4C" /><path d="M49.667.667,49,0H45.667L45,.667H42.667V2H52V.667Z" transform="translate(-42.667)" fill="#DF4C4C" /></g></g></svg>'



/** -------------------- Toaster Section ----------------- **/

/**
* Function for get project details from inquestPRO DB
*
* @param {{body}}
* @param {{type}}
* @return Popup Toaster
*/
function toaster(body, type = 'success') {
    AJS.flag({
        type: type,
        close: 'auto',
        body: body,
    });
}
