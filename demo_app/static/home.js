$(document).ready(function() {
    // window.alert('hey')
	$("#btnFetchAll").click(function () {
        fetchAllPersonData();
    });
	$("#btnSubmit").click(function () {
        submitPersonData();
    });
	$("#btnPage2").click(function () {
        openPage2();
    });

});

//Send GET request to fetch all users' data and parse only the last name
function fetchAllPersonData() {
	$.get('/getallpersons', function(response){
		let personJsonArray = response;
		let lastNameArray = [];
		for (let i = 0; i < personJsonArray.length; i++) {
			let personJsonObject = personJsonArray[i];
			let lastNm = personJsonObject.lastname;
			lastNameArray.push(lastNm);
		}
        displayDataAsList(lastNameArray);
    });
}


//Send POST request to submit data entered by user
function submitPersonData() {
    let fName = $('#fName').val();
    let lName = $('#lName').val();
    let addr = $('#address').val();
    let phone = $('#phone').val();
    let jsonBody = {
        "firstname": fName,
        "lastname": lName,
        "address": addr,
        "phone": phone
    };
    let jsonBodyStr = JSON.stringify(jsonBody);
    $.post('/addperson', jsonBodyStr, function(response){
        let reponseJson = JSON.parse(response);
        let isSuccess = reponseJson.success;
        if (isSuccess) {
            alert("Person Data Submitted Successfully!!");
            $('#fName').val('');
            $('#lName').val('');
            $('#address').val('');
            $('#phone').val('');
        } else {
            alert("Something went wrong !!");
        }
    });
}

// Display array of lastnames as an unordered list in HTML
// The 'dynamicHtml' variable should contain data in the following format:
// <ul>
//  <li>lastname1</li>
//  <li>lastname2</li>
//  <li>lastname3</li>
//  <li>lastname4</li>
// </ul>
function displayDataAsList(lastNameArray) {
    let dynamicHtml = "<ul>";
    for (let i=0; i<lastNameArray.length; i++) {
        let lName = lastNameArray[i];
        dynamicHtml = dynamicHtml + "<li>" + lName + "</li>";
    }
    dynamicHtml = dynamicHtml + "</ul>";
    $("#outputDiv").html(dynamicHtml);
}

function openPage2() {
    window.location.href = "/otherpage";
}