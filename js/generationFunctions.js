function loadDataFromConfig(){

    deleteWidgets();

    var config = String(localStorage.getItem("config"));

    if(config != "null"){
        var config_json = JSON.parse(config);
        if(config_json.type == "directory"){
            var directories = config_json.links;
            directories.forEach(function(directory){
                var request = new XMLHttpRequest();
                var data = "";

                request.withCredentials = true;
                
                request.open('GET', directory);

                request.overrideMimeType("application/json");
            
                request.send();

                request.onreadystatechange = function() {
                    if(this.readyState === 4) {
                        data = request.responseText;
                        
                        var realDataArray = getPathsFromHTTPRequest(data);

                        for(i=0;i<realDataArray.length;i++){
                            realDataArray[i] = directory.concat("/".concat(realDataArray[i]));
                        }

                        realDataArray.forEach(function(realData){
                            var fullPath = realData.concat("/widgets/summaryCopy.json");
                            readJSON(fullPath, realData);
                        })
                    }
                };
            })
        } else {
            var links = config_json.links;

            links.forEach(function(link){
                link = link.trim();
                var fullPath = link.concat("/widgets/summaryCopy.json");
                readJSON(fullPath, link);
            })
        }
    } else {
        showNoConfigMessageOnIndividual();
    }
}

function getPathsFromHTTPRequest(response){
    var res = [];

    var firstSplit = response.split("201: ");

    for(i=1;i<firstSplit.length;i++){
        var secondSplit = firstSplit[i].split(" 4096");
        res[i-1] = secondSplit[0];
    }

    return res;
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
            data = request.responseText;
            jobject = JSON.parse(data);
            
            generateWidget(jobject, folderPath);
        }
    };

}

function toDateTime(secs){
    var t = new Date(1970, 0, 1); // Epoch
    t.setMilliseconds(secs);
    return t;
}

function getDayName(n){
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[n];
}

function getMonthName(m){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[m];
}

function getCircle(stroke, dasharray, dashoffset){
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "donut-segment");
    circle.setAttribute("cx", "21");
    circle.setAttribute("cy", "21");
    circle.setAttribute("r", "15.91549430918954");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", "3");
    circle.setAttribute("stroke-dasharray", dasharray);
    circle.setAttribute("stroke-dashoffset", dashoffset);

    return circle;
}

function getHiddenElement(id, text){
    var hidden = document.createElement("p");
    hidden.setAttribute("id", id);
    hidden.setAttribute("hidden", "true");
    hidden.appendChild(document.createTextNode(text));

    return hidden;
}

function generateWidget(jobject, folderPath){
    var statistic = jobject.statistic;
    var reportName = jobject.reportName;
    var time = jobject.time;

    var launch = time.start;
    var launchDate = toDateTime(launch);

    var day = getDayName(launchDate.getUTCDay());
    var date = launchDate.getUTCDate();
    var month = getMonthName(launchDate.getUTCMonth());
    var year = launchDate.getUTCFullYear();
    var hours = launchDate.getUTCHours();
    var minutes = launchDate.getUTCMinutes();
    var seconds = launchDate.getUTCSeconds();

    var date = String(day).concat(" ").concat(String(date)).concat(" ").concat(String(month)).concat(" ").concat(String(year)).concat("\n\r").concat(String(hours)).concat(":").concat(String(minutes)).concat(":").concat(String(seconds)).concat(" UTC");

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
    circleHole.setAttribute("fill", "rgba(245,245,245,0.1)");


    var circleRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleRing.setAttribute("class", "donut-ring");
    circleRing.setAttribute("cx", "21");
    circleRing.setAttribute("cy", "21");
    circleRing.setAttribute("r", "15.91549430918954");
    circleRing.setAttribute("fill", "transparent");
    circleRing.setAttribute("stroke", "#d2d3d4");
    circleRing.setAttribute("stroke-width", "3");

    var circle1 = getCircle("#fd5a3e", failed, dashFailed);
    var circle2 = getCircle("#ffd050", broken, dashBroken);
    var circle3 = getCircle("#aaaaaa", skipped, dashSkipped);
    var circle4 = getCircle("#97cc64", passed, dashPassed);
    var circle5 = getCircle("#d35ebe", unknown, dashUnknown);

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
    p1.setAttribute("id", "name");
    p1.appendChild(document.createTextNode(reportName));

    var p2 = document.createElement("p");
    p2.setAttribute("id", "launch-date");
    p2.appendChild(document.createTextNode(date));

    var divDescription = document.createElement("div");
    divDescription.setAttribute("class", "data");
    divDescription.appendChild(p1);
    divDescription.appendChild(p2);

    var hiddenFailed = getHiddenElement("hiddenFailed", statistic.failed);
    var hiddenBroken = getHiddenElement("hiddenBroken", statistic.broken);
    var hiddenSkipped = getHiddenElement("hiddenSkipped", statistic.skipped);
    var hiddenPassed = getHiddenElement("hiddenPassed", statistic.passed);
    var hiddenUnknown = getHiddenElement("hiddenUnknown", statistic.unknown);

    var divSummary = document.createElement("div");
    divSummary.setAttribute("class", "widget-summary");
    divSummary.appendChild(divDescription);
    divSummary.appendChild(divWidget);

    divSummary.appendChild(hiddenFailed);
    divSummary.appendChild(hiddenBroken);
    divSummary.appendChild(hiddenSkipped);
    divSummary.appendChild(hiddenPassed);
    divSummary.appendChild(hiddenUnknown);

    var li = document.createElement("li");
    li.setAttribute("class", "api-summary");
    var pathToIndex = folderPath.concat("/index.html");
    li.setAttribute("onclick", "location.href = " + "'" + pathToIndex + "';");
    li.appendChild(divSummary);

    return ul.appendChild(li);

}

function deleteWidgets(){
    document.getElementById("widgets").innerHTML = "";
}

function showNoConfigMessageOnIndividual(){
    div = document.getElementById("filters");

    rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row justify-content-center");

    btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "col-5");

    btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "btn btn-warning btn-lg disabled");
    btn.setAttribute("disabled", "true");
    btn.appendChild(document.createTextNode("There are no current configuration settings saved. Maybe head to the admin options :)"));

    btnDiv.appendChild(btn);
    rowDiv.appendChild(btnDiv);
    div.appendChild(rowDiv);
}