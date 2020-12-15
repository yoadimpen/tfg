import * as fs from 'fs';
import * as path from 'path';
//Given a path input, it should search for the summary JSON file in the allure-report
function searchForReportsNODE(){

    //this should be the input with the folder containing all the allure-report folders
    var givenPath = "F:\- TFG\code\scrap-code\Allure-Multidashboard-master";
    var res = "";

    const path = require('path');
    const fs = require('fs');

    fs.readdir(givenPath, function(err, files){
        if(err) {
            return console.log('Unable to scan directory: ' + err);
        }

        filesNumber = files.length;
        i = 1;

        files.forEach(function(file){
            if(file.includes("allure-report")){
                res.concat(file);
            }
            if(i != filesNumber){
                res.concat(";");
            }
            i = i + 1;
        });
    });

    return res;
}

function generateView(reportsPath){
    //uses the allure-report path to find the summary JSON and calls the readJSON function
    var arrayPaths = reportsPath.split(";");
    arrayPaths.forEach(function(file){
        var fullPath = file.concat("/widgets/summary.json");
        readJSON(fullPath, folderPath);
    });
}

//Given a path of the JSON file, it should read it
function readJSON (JSONFile, folderPath) {
    //should 'return' the json object
    //if it's not found it should call showNotFound

    var request = new XMLHttpRequest();
    request.open('GET', JSONFile, false);
    request.send(null);
    if(request.status == 200){
        //should generate JSON Object
        jobject = JSON.parse(request.responseText);
        generateWidget(jobject, folderPath);
    } else {
        //should go to showNotFound
    }
}

//No parameters should be given here
function showNotFound(){
    //should return a not found message, try again or something like that
}

//Given the JSON object, this should generate a new widget in the home html
function generateWidget(jobject, folderPath){
    //should return 1 if everything went well and 0 if there was an error in order to display a message
    var statistic = jobject.statistic;
    var reportName = jobject.reportName;

    var dashFailed, dashBroken, dashSkipped, dashPassed, dashUnknown;
    var failed, broken, skipped, passed, unknown;
    var failed1, broken1, skipped1, passed1, unknown1;
    var failed2, broken2, skipped2, passed2, unknown2;

    var total = statistic.total;

    if(parseInt(total) == 0){
        failed1 = 0;
        broken1 = 0;
        skipped1 = 0;
        passed1 = 0;
        unknown1 = 0;
    } else {
        failed1 = parseFloat(statistic.failed)/parseFloat(total)*100;
        broken1 = parseFloat(statistic.broken)/parseFloat(total)*100;
        skipped1 = parseFloat(statistic.skipped)/parseFloat(total)*100;
        passed1 = parseFloat(statistic.passed)/parseFloat(total)*100;
        unknown1 = parseFloat(statistic.unknown)/parseFloat(total)*100;
    }

    failed2 = 100 - parseFloat(failed1);
    broken2 = 100 - parseFloat(broken1);
    skipped2 = 100 - parseFloat(skipped1);
    passed2 = 100 - parseFloat(passed1);
    unknown2 = 100 - parseFloat(unknown1);

    failed = String(failed1).concat(" ").concat(String(failed2));
    broken = String(broken1).concat(" ").concat(String(broken2));
    skipped = String(skipped1).concat(" ").concat(String(skipped2));
    passed = String(passed1).concat(" ").concat(String(passed2));
    unknown = String(unknown1).concat(" ").concat(String(unknown2));
    
    dashFailed = String(25);
    dashBroken = String((parseFloat(failed2) + parseFloat(dashFailed)) % 100);
    dashSkipped = String((parseFloat(broken2) + parseFloat(dashBroken)) % 100);
    dashPassed = String((parseFloat(skipped2) + parseFloat(dashSkipped)) % 100);
    dashUnknown = String((parseFloat(passed2) + parseFloat(dashPassed)) % 100);

    var ul = document.getElementById("widgets");

    var text1 = document.createElement("text");
    text1.setAttribute("x", "50%");
    text1.setAttribute("y", "50%");
    text1.setAttribute("class", "chart-number")
    text1.appendChild(document.createTextNode(total));

    var text2 = document.createElement("text");
    text2.setAttribute("x", "50%");
    text2.setAttribute("y", "50%");
    text2.setAttribute("class", "chart-label")
    text2.appendChild(document.createTextNode("tests"));

    var g = document.createElement("g");
    g.setAttribute("class", "chart-text");
    g.appendChild(text1);
    g.appendChild(text2);

    var circleHole = document.createElement("circle");
    circleHole.setAttribute("class", "donut-hole");
    circleHole.setAttribute("cx", "21");
    circleHole.setAttribute("cy", "21");
    circleHole.setAttribute("r", "15.91549430918954");
    circleHole.setAttribute("fill", "#fff");

    var circleRing = document.createElement("circle");
    circleRing.setAttribute("class", "donut-ring");
    circleRing.setAttribute("cx", "21");
    circleRing.setAttribute("cy", "21");
    circleRing.setAttribute("r", "15.91549430918954");
    circleRing.setAttribute("fill", "transparent");
    circleRing.setAttribute("stroke", "#d2d3d4");
    circleRing.setAttribute("stroke-width", "3");

    var circle1 = document.createElement("circle");
    circle1.setAttribute("class", "donut-segment");
    circle1.setAttribute("cx", "21");
    circle1.setAttribute("cy", "21");
    circle1.setAttribute("r", "15.91549430918954");
    circle1.setAttribute("fill", "transparent");
    circle1.setAttribute("stroke", "#fc4e03");
    circle1.setAttribute("stroke-width", "3");
    circle1.setAttribute("stroke-dasharray", failed);
    circle1.setAttribute("stroke-dashoffset", dashFailed);

    var circle2 = document.createElement("circle");
    circle2.setAttribute("class", "donut-segment");
    circle2.setAttribute("cx", "21");
    circle2.setAttribute("cy", "21");
    circle2.setAttribute("r", "15.91549430918954");
    circle2.setAttribute("fill", "transparent");
    circle2.setAttribute("stroke", "#fcdf03");
    circle2.setAttribute("stroke-width", "3");
    circle2.setAttribute("stroke-dasharray", broken);
    circle2.setAttribute("stroke-dashoffset", dashBroken);

    var circle3 = document.createElement("circle");
    circle3.setAttribute("class", "donut-segment");
    circle3.setAttribute("cx", "21");
    circle3.setAttribute("cy", "21");
    circle3.setAttribute("r", "15.91549430918954");
    circle3.setAttribute("fill", "transparent");
    circle3.setAttribute("stroke", "#a80068");
    circle3.setAttribute("stroke-width", "3");
    circle3.setAttribute("stroke-dasharray", skipped);
    circle3.setAttribute("stroke-dashoffset", dashSkipped);

    var circle4 = document.createElement("circle");
    circle4.setAttribute("class", "donut-segment");
    circle4.setAttribute("cx", "21");
    circle4.setAttribute("cy", "21");
    circle4.setAttribute("r", "15.91549430918954");
    circle4.setAttribute("fill", "transparent");
    circle4.setAttribute("stroke", "#a3db02");
    circle4.setAttribute("stroke-width", "3");
    circle4.setAttribute("stroke-dasharray", passed);
    circle4.setAttribute("stroke-dashoffset", dashPassed);

    var circle5 = document.createElement("circle");
    circle5.setAttribute("class", "donut-segment");
    circle5.setAttribute("cx", "21");
    circle5.setAttribute("cy", "21");
    circle5.setAttribute("r", "15.91549430918954");
    circle5.setAttribute("fill", "transparent");
    circle5.setAttribute("stroke", "#454545");
    circle5.setAttribute("stroke-width", "3");
    circle5.setAttribute("stroke-dasharray", unknown);
    circle5.setAttribute("stroke-dashoffset", dashUnknown);

    var svg = document.createElement("svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewbox", "0 0 42 42");
    svg.setAttribute("width", "donut");
    svg.appendChild(circleHole);
    svg.appendChild(circleRing);
    svg.appendChild(circle1);
    svg.appendChild(circle2);
    svg.appendChild(circle3);
    svg.appendChild(circle4);
    svg.appendChild(circle5);

    var divWidget = document.createElement("div");
    divWidget.setAttribute("class", "widget");
    divWidget.appendChild(svg);

    var p1 = document.createElement("p");
    p1.setAttribute("id", "API_title");
    p1.appendChild(document.createTextNode(reportName));

    var p2 = document.createElement("p");
    p2.setAttribute("id", "API_description");
    p2.appendChild(document.createTextNode("Brief description"));

    var divDescription = document.createElement("div");
    divDescription.setAttribute("class", "description");
    divDescription.appendChild(p1);
    divDescription.appendChild(p2);

    var divSummary = document.createElement("div");
    divSummary.setAttribute("class", "widget_summary");
    divSummary.appendChild(divDescription);
    divSummary.appendChild(divWidget);

    var li = document.createElement("li");
    li.setAttribute("class", "apiSummary");
    var pathToIndex = folderPath.concat("/index.html");
    li.setAttribute("onclick", "location.href=" + pathToIndex + ";");
    li.appendChild(divSummary);

    ul.appendChild(li);

}

//No parameters, this should delete all existing widgets on the page in order to generate a more updated ones
function deleteWidgets(){

}