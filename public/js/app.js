var server = window.location.hostname + ':' + window.location.port;

var area = "php";

appController = {
    /*LOGIN*/
    getResourcesInfo : function(requestData, callback) {
        appController.doAjaxCall("http://" + server + "/" + area + "/webScrap.php", "POST", callback, requestData);
    },
    getOshiInfo : function(requestData, callback) {
        appController.doAjaxCall("http://" + server + "/" + area + "/webScrapOshi.php", "POST", callback, requestData);
    },
    /*LOGIN*/
    paramTest : function(requestData, callback) {
        appController.doAjaxCall("http://" + server + "/" + area + + "/paramTest.php", "POST", callback, requestData);
    },

    /**AJAX CALL**/
    doAjaxCall : function(requestUrl, requestType, callback, requestData) {
        $.ajax({
            url : requestUrl, // The link we are accessing.
            async : true,
            crossDomain : true,
            type : requestType, // The type of request.
            dataType : "JSON", // The type of data that is getting returned.
            data : requestData,
            error : function(obj, textStatus, errorThrown) {
                callback(obj, textStatus);
            },
            success : function(data, textStatus) {
                callback(data, textStatus);
            }
        });
    },

    /**FILTER AJAX DATA**/
    filterAjaxData : function(data, textStatus) {
        //console.log(data, textStatus);
        if (textStatus == "success") {//Ajax call successful
            if (data.success == 1) {//Correct parameters
                return 1;
            } else {//Incorrect parameters
                return 0;
            }
        } else {//Ajax call Unsuccessful
            return "error";
        }
    }
};
