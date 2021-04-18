function loadDemoDataIndex(){
    deleteWidgets();

    var paths = ["./testData/report1/summary.json", "./testData/report2/summary.json",
    "./testData/report3/summary.json", "./testData/report4/summary.json",
    "./testData/report5/summary.json", "./testData/report6/summary.json",
    "./testData/report7/summary.json"];

    paths.forEach(function(path){
        readJSON(path, "#");
    })

    var mode = localStorage.getItem("multiview-mode-h");

    if(mode != null) {
        if(mode === 'dark'){
            fillDark();
        } else if (mode === 'light') {
            fillLight();
        }
    }

    if (mode == null){
        localStorage.setItem("multiview-mode", "light");
        fillLight();
    }
}

function changeMode(){
    var mode = localStorage.getItem("multiview-mode-h");

    var page = document.getElementsByClassName("page")[0];
    page.style.transition = "0.3s";

    setTimeout(function(){
        page.removeAttribute("style");
    }, 500);

    if(mode === 'light'){
        localStorage.setItem("multiview-mode-h", "dark");
        mode = localStorage.getItem("multiview-mode-h");

        fillDark();
    } else if(mode === 'dark') {
        localStorage.setItem("multiview-mode-h", "light");
        mode = localStorage.getItem("multiview-mode-h");

        fillLight();
    }
}

function fillLight(){
    var page = document.getElementsByClassName("page")[0];
    page.classList.remove("background-dark");
    page.classList.add("background-light");

    var header = document.getElementById("header");
    header.classList.remove("background-div-dark");
    header.classList.add("background-div-light");

    var slider = document.getElementById("slider-mode");
    slider.checked = false;

    var sliderLittle = document.getElementById("slider-little-mode");
    sliderLittle.checked = false;

    var navElements = document.getElementsByClassName("nav-mode");
    Array.prototype.slice.call(navElements).forEach(function(el){
        if(el.id.includes("active")){
            el.classList.remove("nav-dark-active");
            el.classList.add("nav-light-active");
        } else {
            el.classList.remove("nav-dark");
            el.classList.add("nav-light");
        }
    })

    var inputElements = document.getElementsByClassName("input-mode");
    Array.prototype.slice.call(inputElements).forEach(function(el){
        el.classList.remove("input-dark");
        el.classList.add("input-light");
    })

    var btnElements = document.getElementsByClassName("btn-mode");
    Array.prototype.slice.call(btnElements).forEach(function(el){
        el.classList.remove("btn-own-dark");
        el.classList.add("btn-own-light");
    })

    var sliderElements = document.getElementsByClassName("slider");
    Array.prototype.slice.call(sliderElements).forEach(function(el){
        el.classList.remove("slider-dark");
        el.classList.add("slider-light");
    })

    var widgetElements = document.getElementsByClassName("widget-summary");
    Array.prototype.slice.call(widgetElements).forEach(function(el){
        el.classList.remove("widget-dark");
        el.classList.add("widget-light");
    })

    var widgetTextElements = document.getElementsByClassName("widget-text-mode");
    Array.prototype.slice.call(widgetTextElements).forEach(function(el){
        el.classList.remove("widget-text-dark");
        el.classList.add("widget-text-light");
    })
}

function fillDark(){
    var page = document.getElementsByClassName("page")[0];
    page.classList.remove("background-light");
    page.classList.add("background-dark");

    var header = document.getElementById("header");
    header.classList.remove("background-div-light");
    header.classList.add("background-div-dark");

    var slider = document.getElementById("slider-mode");
    slider.checked = true;

    var sliderLittle = document.getElementById("slider-little-mode");
    sliderLittle.checked = true;

    var navElements = document.getElementsByClassName("nav-mode");
    Array.prototype.slice.call(navElements).forEach(function(el){
        if(el.id.includes("active")){
            el.classList.remove("nav-light-active");
            el.classList.add("nav-dark-active");
        } else {
            el.classList.remove("nav-light");
            el.classList.add("nav-dark");
        }
    })

    var inputElements = document.getElementsByClassName("input-mode");
    Array.prototype.slice.call(inputElements).forEach(function(el){
        el.classList.remove("input-light");
        el.classList.add("input-dark");
    })

    var btnElements = document.getElementsByClassName("btn-mode");
    Array.prototype.slice.call(btnElements).forEach(function(el){
        el.classList.remove("btn-own-light");
        el.classList.add("btn-own-dark");
    })

    var sliderElements = document.getElementsByClassName("slider");
    Array.prototype.slice.call(sliderElements).forEach(function(el){
        el.classList.remove("slider-light");
        el.classList.add("slider-dark");
    })

    var widgetElements = document.getElementsByClassName("widget-summary");
    Array.prototype.slice.call(widgetElements).forEach(function(el){
        el.classList.remove("widget-light");
        el.classList.add("widget-dark");
    })

    var widgetTextElements = document.getElementsByClassName("widget-text-mode");
    Array.prototype.slice.call(widgetTextElements).forEach(function(el){
        el.classList.remove("widget-text-light");
        el.classList.add("widget-text-dark");
    })
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

    var mode = localStorage.getItem("multiview-mode-h");

    var statistic = jobject.statistic;
    var reportName = jobject.reportName;
    var time = jobject.time;

    var launch = time.start;
    var launchDate = toDateTime(launch);

    var day = getDayName(launchDate.getUTCDay());
    var date = launchDate.getUTCDate();
    date = ("0" + date).slice(-2);
    var month = getMonthName(launchDate.getUTCMonth());
    var year = launchDate.getUTCFullYear();
    var hours = launchDate.getUTCHours();
    hours = ("0" + hours).slice(-2);
    var minutes = launchDate.getUTCMinutes();
    minutes = ("0" + minutes).slice(-2);
    var seconds = launchDate.getUTCSeconds();
    seconds = ("0" + seconds).slice(-2);

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
    text1.classList.add("chart-number");
    text1.classList.add("widget-text-mode");
    text1.appendChild(document.createTextNode(total));

    var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text2.setAttribute("x", "50%");
    text2.setAttribute("y", "50%");
    text2.classList.add("chart-label");
    text2.classList.add("widget-text-mode");
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
    circleHole.setAttribute("fill", "rgba(255,255,255,0)");

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
    p1.classList.add("widget-text-mode");
    p1.appendChild(document.createTextNode(reportName));

    var p2 = document.createElement("p");
    p2.setAttribute("id", "launch-date");
    p2.setAttribute("class", "widget-text-mode");
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

    if(mode != null) {
        if(mode === 'light'){
            divSummary.classList.add("widget-light");
            p1.classList.add("widget-text-light");
            p2.classList.add("widget-text-light");
            text1.classList.add("widget-text-light");
            text2.classList.add("widget-text-light");
        } else if(mode === 'dark'){
            divSummary.classList.add("widget-dark");
            p1.classList.add("widget-text-dark");
            p2.classList.add("widget-text-dark");
            text1.classList.add("widget-text-dark");
            text2.classList.add("widget-text-dark");
        }
    } else {
        divSummary.classList.add("widget-light");
        p1.classList.add("widget-text-light");
        p2.classList.add("widget-text-light");
        text1.classList.add("widget-text-light");
        text2.classList.add("widget-text-light");
    }

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
    var message = document.getElementById("no-data-message");
    message.style.display = "inline";
}