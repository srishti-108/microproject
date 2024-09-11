var jpdBaseURL = "http://api.login2explore.com:5577";
var jpdIRL = "/api/irl";
var jpdIML = "/api/iml";
var projDBName = "PROJ-DB";
var projRelationName = "ProjData";
var connToken = "90932044|-31949219508824645|90962247";

$("#projid").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProjIdAsJsonObj(){
    var projid = $("projid").val();
    var jsonStr = {
        id: projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("projname").val(record.name);
    $("projown").val(record.owner);
    $("projdate").val(record.date);
    $("projend").val(record.deadline);
}

function resetForm(){
    $("#projid").val("");
    $("#projname").val("");
    $("#projown").val("");
    $("#projdate").val("");
    $("#projend").val("");
    $("#projid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projid").focus();
}

function validateData(){
    var projid, projname, projown, projdate, projend;
    projid = $("#projid").val();
    projname = $("#projname").val();
    projown = $("#projown").val();
    projdate = $("#projdate").val();
    projend = $("#projend").val();

    if(projid === ""){
        alert("Project ID missing");
        $("#projid").focus();
        return "";
    }
    if(projname === ""){
        alert("Project Name missing");
        $("#projname").focus();
        return "";
    }
    if(projown === ""){
        alert("Project is not assigned");
        $("#projown").focus();
        return "";
    }
    if(projdate === ""){
        alert("Project is not scheduled");
        $("#projdate").focus();
        return "";
    }
    if(projidend === ""){
        alert("Project deadline missing");
        $("#projend").focus();
        return "";
    }

    var jsonStrObj = {
        id: projid,
        name: projname,
        owner: projown,
        date: projdate,
        deadline: projend
    };
    return JSON.stringify(jsonStrObj);
}

function getProj(){
    var projIdJsonObj = getProjIdJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDBName, projRelationName, projIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projname").focus();
    } else if(resJsonObj.status === 200){
        $("#projid").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, projDBName, projRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#projid").focus();
}

function changeData(){
    $("#update").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projDBName, projRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseURL(updateRequest, jpdbBaseURL, jpdBaseIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#projid").focus();
}