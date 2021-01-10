function generateSummary(){
    //file:///F:/-TFG/code/allure-report; file:///F:/-TFG/code/allure-report-2
    var reportsPath = document.getElementById("generateSummaryInput").value;

    console.log(reportsPath);

    if(reportsPath.trim() == ''){
        showEmptyMessage();
    } else {

        //find the message div and empty it if it's full

        //generate test output type summary col
        generateTypeSummary(reportsPath);
        //generate categories/severity summary col

        //generate a third graph summary col aight there m8
    }

}

function generateTypeSummary(paths){
    var pathsArray = paths.split(";");

    //var failed, broken, skipped, passed, unknown;
    var resultsArray = [0,0,0,0,0];

    pathsArray.forEach(function(path){
        path = path.trim();
        var pathToSummary = path.concat("/widgets/summaryCopy.json");
        readJSONSummary(pathToSummary, resultsArray, pathsArray.length);
    })

}

function readJSONSummary(pathToSummary, resultsArray, totalReports){
    var request = new XMLHttpRequest();
    var data = "";
    var jobject = "";

    request.withCredentials = true;
    
    request.open('GET', pathToSummary);

    request.overrideMimeType("application/json");
   
    request.send();
    
    request.onreadystatechange = function() {
        if(this.readyState === 4) {
            
            data = request.responseText;
            jobject = JSON.parse(data);
            
            var res = getTypeResults(jobject, resultsArray);
            //how should i save this???
            console.log(res);
        }
        makeTypeDiv(res, totalReports);
    };
}

function getTypeResults(json, resultsArray){
    var statistic = json.statistic;
    resultsArray[0] = resultsArray[0] + statistic.failed;
    resultsArray[1] = resultsArray[1] + statistic.broken;
    resultsArray[2] = resultsArray[2] + statistic.skipped;
    resultsArray[3] = resultsArray[3] + statistic.passed;
    resultsArray[4] = resultsArray[4] + statistic.unknown;
    return resultsArray;
}

function makeTypeDiv(array, totalReports){
    var resultsDiv = document.getElementById("sum-row");
    resultsDiv.innerHTML = "";

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var dashFailed, dashBroken, dashSkipped, dashPassed, dashUnknown;
    var failed, broken, skipped, passed, unknown;
    var failed1, broken1, skipped1, passed1, unknown1;
    var failed2, broken2, skipped2, passed2, unknown2;

    if(parseInt(total) == 0){
        failed1 = 0;
        broken1 = 0;
        skipped1 = 0;
        passed1 = 0;
        unknown1 = 0;
    } else {
        failed1 = parseFloat(array[0])/parseFloat(total)*100;
        broken1 = parseFloat(array[1])/parseFloat(total)*100;
        skipped1 = parseFloat(array[2])/parseFloat(total)*100;
        passed1 = parseFloat(array[3])/parseFloat(total)*100;
        unknown1 = parseFloat(array[4])/parseFloat(total)*100;
    }

    failed2 = 100 - parseFloat(failed1);
    broken2 = 100 - parseFloat(broken1);
    skipped2 = 100 - parseFloat(skipped1);
    passed2 = 100 - parseFloat(passed1);
    unknown2 = 100 - parseFloat(unknown1);

    failed = String(parseFloat(failed1)).concat(" ").concat(String(parseFloat(failed2)));
    broken = String(parseFloat(broken1)).concat(" ").concat(String(parseFloat(broken2)));
    skipped = String(parseFloat(skipped1)).concat(" ").concat(String(parseFloat(skipped2)));
    passed = String(parseFloat(passed1)).concat(" ").concat(String(parseFloat(passed2)));
    unknown = String(parseFloat(unknown1)).concat(" ").concat(String(parseFloat(unknown2)));
    
    dashFailed = String(25);
    dashBroken = String((parseFloat(failed2) + parseFloat(dashFailed)) % 100);
    dashSkipped = String((parseFloat(broken2) + parseFloat(dashBroken)) % 100);
    dashPassed = String((parseFloat(skipped2) + parseFloat(dashSkipped)) % 100);
    dashUnknown = String((parseFloat(passed2) + parseFloat(dashPassed)) % 100);

    var text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text1.setAttribute("x", "50%");
    text1.setAttribute("y", "50%");
    text1.setAttribute("class", "chart-number")
    text1.appendChild(document.createTextNode(total));

    var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text2.setAttribute("x", "50%");
    text2.setAttribute("y", "50%");
    text2.setAttribute("class", "chart-label")
    text2.appendChild(document.createTextNode("tests"));

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "chart-text");
    g.appendChild(text1);
    g.appendChild(text2);

    var circleHole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleHole.setAttribute("class", "donut-hole");
    circleHole.setAttribute("cx", "21");
    circleHole.setAttribute("cy", "21");
    circleHole.setAttribute("r", "15.91549430918954");
    circleHole.setAttribute("fill", "#fff");


    var circleRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleRing.setAttribute("class", "donut-ring");
    circleRing.setAttribute("cx", "21");
    circleRing.setAttribute("cy", "21");
    circleRing.setAttribute("r", "15.91549430918954");
    circleRing.setAttribute("fill", "transparent");
    circleRing.setAttribute("stroke", "#d2d3d4");
    circleRing.setAttribute("stroke-width", "3");

    var circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle1.setAttribute("class", "donut-segment");
    circle1.setAttribute("cx", "21");
    circle1.setAttribute("cy", "21");
    circle1.setAttribute("r", "15.91549430918954");
    circle1.setAttribute("fill", "transparent");
    circle1.setAttribute("stroke", "#fc4e03");
    circle1.setAttribute("stroke-width", "3");
    circle1.setAttribute("stroke-dasharray", failed);
    circle1.setAttribute("stroke-dashoffset", dashFailed);

    var circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle2.setAttribute("class", "donut-segment");
    circle2.setAttribute("cx", "21");
    circle2.setAttribute("cy", "21");
    circle2.setAttribute("r", "15.91549430918954");
    circle2.setAttribute("fill", "transparent");
    circle2.setAttribute("stroke", "#fcdf03");
    circle2.setAttribute("stroke-width", "3");
    circle2.setAttribute("stroke-dasharray", broken);
    circle2.setAttribute("stroke-dashoffset", dashBroken);

    var circle3 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle3.setAttribute("class", "donut-segment");
    circle3.setAttribute("cx", "21");
    circle3.setAttribute("cy", "21");
    circle3.setAttribute("r", "15.91549430918954");
    circle3.setAttribute("fill", "transparent");
    circle3.setAttribute("stroke", "#a80068");
    circle3.setAttribute("stroke-width", "3");
    circle3.setAttribute("stroke-dasharray", skipped);
    circle3.setAttribute("stroke-dashoffset", dashSkipped);

    var circle4 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle4.setAttribute("class", "donut-segment");
    circle4.setAttribute("cx", "21");
    circle4.setAttribute("cy", "21");
    circle4.setAttribute("r", "15.91549430918954");
    circle4.setAttribute("fill", "transparent");
    circle4.setAttribute("stroke", "#a3db02");
    circle4.setAttribute("stroke-width", "3");
    circle4.setAttribute("stroke-dasharray", passed);
    circle4.setAttribute("stroke-dashoffset", dashPassed);

    var circle5 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle5.setAttribute("class", "donut-segment");
    circle5.setAttribute("cx", "21");
    circle5.setAttribute("cy", "21");
    circle5.setAttribute("r", "15.91549430918954");
    circle5.setAttribute("fill", "transparent");
    circle5.setAttribute("stroke", "#454545");
    circle5.setAttribute("stroke-width", "3");
    circle5.setAttribute("stroke-dasharray", unknown);
    circle5.setAttribute("stroke-dashoffset", dashUnknown);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "70%");
    svg.setAttribute("viewBox", "0 0 42 42");
    svg.setAttribute("class", "donut-status");
    svg.appendChild(circleHole);
    svg.appendChild(circleRing);
    svg.appendChild(circle1);
    svg.appendChild(circle2);
    svg.appendChild(circle3);
    svg.appendChild(circle4);
    svg.appendChild(circle5);
    svg.appendChild(g);

    var title = document.createElement("h2");
    title.appendChild(document.createTextNode("Status"));

    var p = document.createElement("p");
    p.setAttribute("id", "status");
    p.setAttribute("style", "width:60%");
    p.appendChild(title);

    /*var help = document.createElement("i");
    help.setAttribute("class", "far fa-question-circle");
    help.setAttribute("style", "font-size: 1.5rem; color: #6c757d; width: 10%; margin: 1rem;");

    var spanHelp = document.createElement("span");
    spanHelp.setAttribute("class", "tooltip-text");
    
    var bHelp = document.createElement("b");
    bHelp.appendChild(document.createTextNode("Help"));

    var br1 = document.createElement("br");

    var i1 = document.createElement("i");
    i1.setAttribute("class", "fas fa-circle");
    i1.setAttribute("style", "color:#fc4e03;");

    var br2 = document.createElement("br");

    var i2 = document.createElement("i");
    i2.setAttribute("class", "fas fa-circle");
    i2.setAttribute("style", "color:#fcdf03;");

    var br3 = document.createElement("br");

    var i3 = document.createElement("i");
    i3.setAttribute("class", "fas fa-circle");
    i3.setAttribute("style", "color:#a80068;");
    
    var br4 = document.createElement("br");

    var i4 = document.createElement("i");
    i4.setAttribute("class", "fas fa-circle");
    i4.setAttribute("style", "color:#a3db02;");

    var br5 = document.createElement("br");

    var i5 = document.createElement("i");
    i5.setAttribute("class", "fas fa-circle");
    i5.setAttribute("style", "color:#454545;");

    spanHelp.appendChild(bHelp);
    spanHelp.appendChild(br1);
    spanHelp.appendChild(i1);
    spanHelp.appendChild(br2);
    spanHelp.appendChild(i2);
    spanHelp.appendChild(br3);
    spanHelp.appendChild(i3);
    spanHelp.appendChild(br4);
    spanHelp.appendChild(i4);
    spanHelp.appendChild(br5);
    spanHelp.appendChild(i5);*/

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    /*titleRow.appendChild(p);
    titleRow.appendChild(help);
    titleRow.appendChild(spanHelp);*/

    var div1 = document.createElement("div");
    div1.setAttribute("class", "col");

    div1.appendChild(p);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "col-2");
    div2.setAttribute("style", "padding:auto;");

    //div2.appendChild(document.createTextNode("<i class='far fa-question-circle' style='font-size: 1.5rem; color: #6c757d; width: 10%; margin: 1rem;' aria-hidden='true'></i><span class='tooltip-text'><b>Help</b><br><i class='fas fa-circle' style='color:#fc4e03;' aria-hidden='true'></i><br><i class='fas fa-circle' style='color:#fcdf03;' aria-hidden='true'></i><br><i class='fas fa-circle' style='color:#a80068;' aria-hidden='true'></i><br><i class='fas fa-circle' style='color:#a3db02;' aria-hidden='true'></i><br><i class='fas fa-circle' style='color:#454545;' aria-hidden='true'></i></span>"));
    div2.innerHTML = "<i class='far fa-question-circle' style='font-size: 1.5rem; color: #6c757d; width: 10%; margin: 1rem;' aria-hidden='true';></i>" + 
            "<span class='tooltip-text'>" +
                "<b>Help</b>" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fc4e03;' aria-hidden='true'></i> Failed tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fcdf03;' aria-hidden='true'></i> Broken tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#a80068;' aria-hidden='true'></i> Skipped tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#a3db02;' aria-hidden='true'></i> Passed tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#454545;' aria-hidden='true'></i> Unknown tests" +
            "</span>";

    titleRow.appendChild(div1);
    titleRow.appendChild(div2);

    var exp = document.createElement("p");
    exp.setAttribute("id", "status");
    exp.appendChild(document.createTextNode("This summary has been made over a total of " + totalReports + " reports from the provided paths."));

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(svg);
    div.appendChild(exp);

    var br = document.createElement("br");
    div.appendChild(br);

    var blank = document.createElement("div");
    blank.setAttribute("id", "sum-col");
    blank.setAttribute("class", "col");
    blank.appendChild(document.createTextNode("Blank div for development purpose :)"));

    var blank2 = document.createElement("div");
    blank2.setAttribute("id", "sum-col");
    blank2.setAttribute("class", "col");
    blank2.appendChild(document.createTextNode("Blank div for development purpose :)"));

    resultsDiv.appendChild(div);
    resultsDiv.appendChild(blank);
    resultsDiv.appendChild(blank2);

}

function makeTwoBlankDivs(){
    var div = document.getElementById("sum-row");

    var blank = document.createElement("div");
    blank.setAttribute("id", "sum-col");
    blank.setAttribute("class", "col");
    blank.appendChild(document.createTextNode("Blank div for development purpose :)"));

    div.appendChild(blank);
    div.appendChild(blank);
}

function showEmptyMessage(){
    //find the message div and fill it
}