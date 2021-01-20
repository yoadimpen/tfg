function generateView(){
    
    deleteWidgets();

    var reportsPath = document.getElementById("generateInput").value;

    if(reportsPath.trim() == ''){
        console.log("entra aqui");
        showNotFound();
    } else{
        var div = document.getElementById("errorMessageDiv");
        div.style.display = "none";

        var pathsArray = reportsPath.split(";");

        pathsArray.forEach(function(path){
            path = path.trim();
            var fullPath = path.concat("/widgets/summaryCopy.json");
            readJSON(fullPath, path);
        });
    }

    //document.getElementById("pageInput").value = 10;
    //doPagination();

}

function loadDataFromConfig(){

    deleteWidgets();

    var config = String(localStorage.getItem("config"));

    if(config != null){
        var config_json = JSON.parse(config);
        var links = config_json.links;

        links.forEach(function(link){
            link = link.trim();
            var fullPath = link.concat("/widgets/summaryCopy.json");
            readJSON(fullPath, link);
        })
    }
}

function readJSON (JSONFile, folderPath) {
    
    var request = new XMLHttpRequest();
    var data = "";
    var jobject = "";

    request.withCredentials = true;
    
    request.open('GET', JSONFile);

    request.overrideMimeType("application/json");
   
    request.send();
    
    request.onreadystatechange = function() {
        if(this.readyState === 4) {
            //console.log(this.responseText);
            data = request.responseText;
            jobject = JSON.parse(data);
            
            //console.log(jobject);
            generateWidget(jobject, folderPath);
        }
    };

}

function generateWidget(jobject, folderPath){
    //console.log(jobject.reportName);
    //console.log(jobject.statistic);
    var statistic = jobject.statistic;
    var reportName = jobject.reportName;

    var dashFailed, dashBroken, dashSkipped, dashPassed, dashUnknown;
    var failed, broken, skipped, passed, unknown;
    var failed1, broken1, skipped1, passed1, unknown1;
    var failed2, broken2, skipped2, passed2, unknown2;

    var total = statistic.total;

    //console.log(statistic.failed);

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

    var ul = document.getElementById("widgets");

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
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 42 42");
    svg.setAttribute("class", "donut");
    svg.appendChild(circleHole);
    svg.appendChild(circleRing);
    svg.appendChild(circle1);
    svg.appendChild(circle2);
    svg.appendChild(circle3);
    svg.appendChild(circle4);
    svg.appendChild(circle5);
    svg.appendChild(g);

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

    var hiddenFailed = document.createElement("p");
    hiddenFailed.setAttribute("id", "hiddenFailed");
    hiddenFailed.setAttribute("hidden", "true");
    hiddenFailed.appendChild(document.createTextNode(statistic.failed));

    var hiddenBroken = document.createElement("p");
    hiddenBroken.setAttribute("id", "hiddenBroken");
    hiddenBroken.setAttribute("hidden", "true");
    hiddenBroken.appendChild(document.createTextNode(statistic.broken));

    var hiddenSkipped = document.createElement("p");
    hiddenSkipped.setAttribute("id", "hiddenSkipped");
    hiddenSkipped.setAttribute("hidden", "true");
    hiddenSkipped.appendChild(document.createTextNode(statistic.skipped));

    var hiddenPassed = document.createElement("p");
    hiddenPassed.setAttribute("id", "hiddenPassed");
    hiddenPassed.setAttribute("hidden", "true");
    hiddenPassed.appendChild(document.createTextNode(statistic.passed));
    
    var hiddenUnknown = document.createElement("p");
    hiddenUnknown.setAttribute("id", "hiddenUnknown");
    hiddenUnknown.setAttribute("hidden", "true");
    hiddenUnknown.appendChild(document.createTextNode(statistic.unknown));

    var divSummary = document.createElement("div");
    divSummary.setAttribute("class", "widget_summary");
    divSummary.appendChild(divDescription);
    divSummary.appendChild(divWidget);

    divSummary.appendChild(hiddenFailed);
    divSummary.appendChild(hiddenBroken);
    divSummary.appendChild(hiddenSkipped);
    divSummary.appendChild(hiddenPassed);
    divSummary.appendChild(hiddenUnknown);

    var li = document.createElement("li");
    li.setAttribute("class", "apiSummary");
    var pathToIndex = folderPath.concat("/index.html");
    li.setAttribute("onclick", "location.href = " + "'" + pathToIndex + "';");
    li.appendChild(divSummary);

    return ul.appendChild(li);

}

function deleteWidgets(){
    document.getElementById("widgets").innerHTML = "";
}

function showNotFound(){
    var div = document.getElementById("errorMessageDiv");
    div.style.display = "";
}