function loadSummaryFromConfig(){

    var divs = document.getElementById("sum-row");
    divs.innerHTML = "";

    var config = String(localStorage.getItem("config"));

    if(config != "null"){
        //se obtiene el objeto JSON de la configuracion
        var config_json = JSON.parse(config);

        //si se han guardado directorios se hace lo siguiente
        if(config_json.type == "directory"){
            //se cogen todos los enlaces a los directorios guardados
            var directories = config_json.links;
            var request = [];

            //para cada uno de los directorios se hace lo siguiente
            for(k=0;k<directories.length;k++){
                (function(k){
                    //se hace una peticion HTTP para hallar la ruta completa de los informes
                    var allLinks = [];
                    var data = "";

                    request[k] = new XMLHttpRequest();
                    request[k].withCredentials = true;
                    request[k].open('GET', directories[k]);
                    request[k].overrideMimeType("application/json");
                    request[k].send();
                    request[k].onreadystatechange = function() {

                        if(this.readyState === 4) {
                            data = request[k].responseText;

                            //se obtiene el nombre de las carpetas en las cuales hay un informe de Allure
                            var realDataArray = getPathsFromHTTPRequest(data);

                            //se forma la ruta completa = directorio + nombre de la carpeta del informe
                            for(i=0;i<realDataArray.length;i++){
                                realDataArray[i] = directories[k].concat("/".concat(realDataArray[i]));
                            }

                            realDataArray.forEach(function(realData){
                                allLinks.push(realData);
                            })

                            //se actualiza la variable con las rutas nuevas
                            actualizaTemp(allLinks, k);
                        }
                    };
                })(k);
            }

            var reportsPath = localStorage.getItem("links_temp");
            generateSummaryDivs(reportsPath);
        } else {
            var links = config_json.links;
            var reportsPath = "";
            reportsPath = links[0];

            for(z=1;z<links.length;z++){
                reportsPath = reportsPath.concat(";").concat(links[z]);
            }
            generateSummaryDivs(reportsPath);
        }
    } else {
        showNoConfigMessageOnGeneral();
    }
}

function actualizaTemp(links, cont){
    if(cont == 0){
        localStorage.removeItem("links_temp");
    }

    links.forEach(function(link){
        if(localStorage.getItem("links_temp") == null){
            localStorage.setItem("links_temp", link);
        } else{
            var links_temp = localStorage.getItem("links_temp").concat(";").concat(link);
            localStorage.removeItem("links_temp");
            localStorage.setItem("links_temp", links_temp);
        }
    })
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

function generateSummary(){
    var divs = document.getElementById("sum-row");
    divs.innerHTML = "";

    //file:///F:/-TFG/code/allure-report; file:///F:/-TFG/code/allure-report-2
    var reportsPath = document.getElementById("generateSummaryInput").value;

    if(reportsPath.trim() == ''){
        showEmptyMessage();
    } else {
        generateSummaryDivs(reportsPath);
    }

}

function generateSummaryDivs(reportsPath){
    var pathsArray = reportsPath.split(";");

    var statusArray = [0,0,0,0,0];
    var severityArray = [0,0,0,0,0];
    var categoryArray = [0,0,0,0,0];
    var categoryNameArray = ["", "", "", "", ""];

    pathsArray.forEach(function(path){
        path = path.trim();
        readJSONs(path, statusArray, severityArray, categoryArray, categoryNameArray, pathsArray.length);
    })
}

function readJSONs (path, statusArray, severityArray, categoryArray, categoryNameArray, nReports){
    var data1 = "";
    var jobject1 = "";

    var request1 = new XMLHttpRequest();
    request1.withCredentials = true;
    request1.open('GET', path.concat("/widgets/summaryCopy.json"));
    request1.overrideMimeType("application/json");
    request1.send();
    request1.onreadystatechange = function() {
        if(this.readyState === 4) {
            data1 = request1.responseText;
            jobject1 = JSON.parse(data1);
            var res1 = getTypeResults(jobject1, statusArray);
        }
        makeTypeDiv(res1, nReports);
    };

    var data2 = "";
    var jobject2 = "";
    
    var request2 = new XMLHttpRequest();
    request2.withCredentials = true;
    request2.open('GET', path.concat("/widgets/severity.json"));
    request2.overrideMimeType("application/json");
    request2.send();
    request2.onreadystatechange = function() {
        if(this.readyState === 4) {
            data2 = request2.responseText;
            jobject2 = JSON.parse(data2);
            var res2 = getSeverityLevelResults(jobject2, severityArray);
            makeSeverityDiv(res2, nReports);
        }
    };

    var data3 = "";
    var jobject3 = "";

    var request3 = new XMLHttpRequest();
    request3.withCredentials = true;
    request3.open('GET', path.concat("/widgets/categories.json"));
    request3.overrideMimeType("application/json");
    request3.send();
    request3.onreadystatechange = function() {
        if(this.readyState === 4) {
            data3 = request3.responseText;
            jobject3 = JSON.parse(data3);
            var res3 = getCategoryResults(jobject3, categoryArray, categoryNameArray);
            makeCategoryDiv(res3, nReports);
        }
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

    var circle1 = getCircle("#fc4e03", failed, dashFailed);
    var circle2 = getCircle("#fcdf03", broken, dashBroken);
    var circle3 = getCircle("#a80068", skipped, dashSkipped);
    var circle4 = getCircle("#a3db02", passed, dashPassed);
    var circle5 = getCircle("#454545", unknown, dashUnknown);

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
    title.setAttribute("style", "margin: 10px; margin-bottom: 15px;");

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var div1 = document.createElement("div");
    div1.setAttribute("class", "col");

    div1.appendChild(title);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "col-2");
    div2.setAttribute("style", "padding:auto;");

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

    resultsDiv.appendChild(div);
}

function getSeverityLevelResults(jobject, array){
    var n = jobject.length;

    for(i=0;i<n;i++){
        var j = jobject[i];
        var json = JSON.parse(JSON.stringify(j));
        var severityLevel = json.severity;

        switch(severityLevel){
            case "blocker":
                array[0] = array[0] + 1;
                break;
            case "critical":
                array[1] = array[1] + 1;
                break;
            case "normal":
                array[2] = array[2] + 1;
                break;
            case "minor":
                array[3] = array[3] + 1;
                break;
            case "trivial":
                array[4] = array[4] + 1;
                break;
        }
    }

    return array;
}

function getCoherentScale(arrayResults){
    
    var highest_result = Math.max.apply(null, arrayResults);
    var highest;
    var scale = [0,0,0,0,0,0,0,0,0,0,0];

    var rem = (highest_result + 10) % 10;

    if(rem == 0){
        highest = highest_result;
    } else {
        highest = highest_result + 10 - rem;
    }

    var step = highest / 10;

    for(i=1;i<=10;i++){
        scale[i] = step*i;
    }

    return scale;

}

function getPercentage(scaleArray, n){
    
    var x1 = scaleArray[10];
    var x2 = scaleArray[5];

    var y1 = -32;
    var y2 = 8;
    
    var m = (y2 - y1)/(x2 - x1);

    var res = m*n + 48;

    return res;
}

function makeSeverityDiv(array){

    var resultsDiv = document.getElementById("sum-row");

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var scale_y = getCoherentScale(array);

    var rect_plot_1_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_1.setAttribute("class", "severity-bar");
    rect_plot_1_1.setAttribute("x", "5.1%");
    var percentage_1_1 = getPercentage(scale_y, array[0]);
    rect_plot_1_1.setAttribute("y", String(percentage_1_1) + "%");
    rect_plot_1_1.setAttribute("height", String(48-percentage_1_1) + "%");
    rect_plot_1_1.setAttribute("width", "16.2%");
    rect_plot_1_1.setAttribute("rx", "5");
    rect_plot_1_1.setAttribute("ry", "5");
    var rect_plot_1_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_2.setAttribute("class", "severity-bar");
    rect_plot_1_2.setAttribute("x", "5.1%");
    var percentage_1_2 = getPercentage(scale_y, array[0]) + 4;
    rect_plot_1_2.setAttribute("y", String(percentage_1_2) + "%");
    rect_plot_1_2.setAttribute("height", String(48-percentage_1_2) + "%");
    rect_plot_1_2.setAttribute("width", "16.2%");
    var rect_plot_1_0 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_0.setAttribute("class", "severity-bar");
    rect_plot_1_0.setAttribute("x", "5.1%");
    rect_plot_1_0.setAttribute("y", "47%");
    rect_plot_1_0.setAttribute("height", "1%");
    rect_plot_1_0.setAttribute("width", "90%");
    rect_plot_1_0.setAttribute("opacity", "0");

    var g_plot_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_1.setAttribute("transform", "translate(0,0)");
    g_plot_1.appendChild(rect_plot_1_1);
    g_plot_1.appendChild(rect_plot_1_2);
    g_plot_1.appendChild(rect_plot_1_0);

    var rect_plot_2_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_2_1.setAttribute("class", "severity-bar");
    rect_plot_2_1.setAttribute("x", "22.8%");
    var percentage_2_1 = getPercentage(scale_y, array[1]);
    rect_plot_2_1.setAttribute("y", String(percentage_2_1) + "%");
    rect_plot_2_1.setAttribute("height", String(48-percentage_2_1) + "%");
    rect_plot_2_1.setAttribute("width", "16.2%");
    rect_plot_2_1.setAttribute("rx", "5");
    rect_plot_2_1.setAttribute("ry", "5");
    var rect_plot_2_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_2_2.setAttribute("class", "severity-bar");
    rect_plot_2_2.setAttribute("x", "22.8%");
    var percentage_2_2 = getPercentage(scale_y, array[1]) + 4;
    rect_plot_2_2.setAttribute("y", String(percentage_2_2) + "%");
    rect_plot_2_2.setAttribute("height", String(48-percentage_2_2) + "%");
    rect_plot_2_2.setAttribute("width", "16.2%");

    var g_plot_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_2.setAttribute("transform", "translate(0,0)");
    g_plot_2.appendChild(rect_plot_2_1);
    g_plot_2.appendChild(rect_plot_2_2);

    var rect_plot_3_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_3_1.setAttribute("class", "severity-bar");
    rect_plot_3_1.setAttribute("x", "40.6%");
    var percentage_3_1 = getPercentage(scale_y, array[2]);
    rect_plot_3_1.setAttribute("y", String(percentage_3_1) + "%");
    rect_plot_3_1.setAttribute("height", String(48-percentage_3_1) + "%");
    rect_plot_3_1.setAttribute("width", "16.2%");
    rect_plot_3_1.setAttribute("rx", "5");
    rect_plot_3_1.setAttribute("ry", "5");
    var rect_plot_3_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_3_2.setAttribute("class", "severity-bar");
    rect_plot_3_2.setAttribute("x", "40.6%");
    var percentage_3_2 = getPercentage(scale_y, array[2]) + 4;
    rect_plot_3_2.setAttribute("y", String(percentage_3_2) + "%");
    rect_plot_3_2.setAttribute("height", String(48-percentage_3_2) + "%");
    rect_plot_3_2.setAttribute("width", "16.2%");

    var g_plot_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_3.setAttribute("transform", "translate(0,0)");
    g_plot_3.appendChild(rect_plot_3_1);
    g_plot_3.appendChild(rect_plot_3_2);

    var rect_plot_4_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_4_1.setAttribute("class", "severity-bar");
    rect_plot_4_1.setAttribute("x", "58.4%");
    var percentage_4_1 = getPercentage(scale_y, array[3]);
    rect_plot_4_1.setAttribute("y", String(percentage_4_1) + "%");
    rect_plot_4_1.setAttribute("height", String(48-percentage_4_1) + "%");
    rect_plot_4_1.setAttribute("width", "16.2%");
    rect_plot_4_1.setAttribute("rx", "5");
    rect_plot_4_1.setAttribute("ry", "5");
    var rect_plot_4_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_4_2.setAttribute("class", "severity-bar");
    rect_plot_4_2.setAttribute("x", "58.4%");
    var percentage_4_2 = getPercentage(scale_y, array[3]) + 4;
    rect_plot_4_2.setAttribute("y", String(percentage_4_2) + "%");
    rect_plot_4_2.setAttribute("height", String(48-percentage_4_2) + "%");
    rect_plot_4_2.setAttribute("width", "16.2%");

    var g_plot_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_4.setAttribute("transform", "translate(0,0)");
    g_plot_4.appendChild(rect_plot_4_1);
    g_plot_4.appendChild(rect_plot_4_2);

    var rect_plot_5_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_5_1.setAttribute("class", "severity-bar");
    rect_plot_5_1.setAttribute("x", "76.2%");
    var percentage_5_1 = getPercentage(scale_y, array[4]);
    rect_plot_5_1.setAttribute("y", String(percentage_5_1) + "%");
    rect_plot_5_1.setAttribute("height", String(48-percentage_5_1) + "%");
    rect_plot_5_1.setAttribute("width", "16.2%");
    rect_plot_5_1.setAttribute("rx", "5");
    rect_plot_5_1.setAttribute("ry", "5");
    var rect_plot_5_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_5_2.setAttribute("class", "severity-bar");
    rect_plot_5_2.setAttribute("x", "76.2%");
    var percentage_5_2 = getPercentage(scale_y, array[4]) + 4;
    rect_plot_5_2.setAttribute("y", String(percentage_5_2) + "%");
    rect_plot_5_2.setAttribute("height", String(48-percentage_5_2) + "%");
    rect_plot_5_2.setAttribute("width", "16.2%");

    var g_plot_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_5.setAttribute("transform", "translate(0,0)");
    g_plot_5.appendChild(rect_plot_5_1);
    g_plot_5.appendChild(rect_plot_5_2);

    var g_plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot.setAttribute("class", "severity-plot");
    g_plot.setAttribute("style", "padding-bottom: 10%;");
    g_plot.appendChild(g_plot_1);
    g_plot.appendChild(g_plot_2);
    g_plot.appendChild(g_plot_3);
    g_plot.appendChild(g_plot_4);
    g_plot.appendChild(g_plot_5);

    var line_x_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_1.setAttribute("class", "severity-x-tick-1-line");
    line_x_1.setAttribute("stroke", "#000");
    line_x_1.setAttribute("y2", "2%");
    var text_x_1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x_1.setAttribute("class", "severity-x-tick-text");
    text_x_1.setAttribute("fill", "#000");
    text_x_1.setAttribute("y", "3.3%");
    text_x_1.setAttribute("dy", "0.71em");
    text_x_1.appendChild(document.createTextNode("blocker"));

    var g_x_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_1.setAttribute("class", "severity-x-tick-1");
    g_x_1.setAttribute("opacity", "1");
    g_x_1.appendChild(line_x_1);
    g_x_1.appendChild(text_x_1);

    var line_x_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_2.setAttribute("class", "severity-x-tick-2-line");
    line_x_2.setAttribute("stroke", "#000");
    line_x_2.setAttribute("y2", "2%");
    var text_x_2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x_2.setAttribute("class", "severity-x-tick-text");
    text_x_2.setAttribute("fill", "#000");
    text_x_2.setAttribute("y", "3.3%");
    text_x_2.setAttribute("dy", "0.71em");
    text_x_2.appendChild(document.createTextNode("critical"));

    var g_x_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_2.setAttribute("class", "severity-x-tick-2");
    g_x_2.setAttribute("opacity", "1");
    g_x_2.appendChild(line_x_2);
    g_x_2.appendChild(text_x_2);

    var line_x_3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_3.setAttribute("class", "severity-x-tick-3-line");
    line_x_3.setAttribute("stroke", "#000");
    line_x_3.setAttribute("y2", "2%");
    var text_x_3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x_3.setAttribute("class", "severity-x-tick-text");
    text_x_3.setAttribute("fill", "#000");
    text_x_3.setAttribute("y", "3.3%");
    text_x_3.setAttribute("dy", "0.71em");
    text_x_3.appendChild(document.createTextNode("normal"));

    var g_x_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_3.setAttribute("class", "severity-x-tick-3");
    g_x_3.setAttribute("opacity", "1");
    g_x_3.appendChild(line_x_3);
    g_x_3.appendChild(text_x_3);

    var line_x_4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_4.setAttribute("class", "severity-x-tick-4-line");
    line_x_4.setAttribute("stroke", "#000");
    line_x_4.setAttribute("y2", "2%");
    var text_x_4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x_4.setAttribute("class", "severity-x-tick-text");
    text_x_4.setAttribute("fill", "#000");
    text_x_4.setAttribute("y", "3.3%");
    text_x_4.setAttribute("dy", "0.71em");
    text_x_4.appendChild(document.createTextNode("minor"));

    var g_x_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_4.setAttribute("class", "severity-x-tick-4");
    g_x_4.setAttribute("opacity", "1");
    g_x_4.appendChild(line_x_4);
    g_x_4.appendChild(text_x_4);

    var line_x_5 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_5.setAttribute("class", "severity-x-tick-5-line");
    line_x_5.setAttribute("stroke", "#000");
    line_x_5.setAttribute("y2", "2%");
    var text_x_5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x_5.setAttribute("class", "severity-x-tick-text");
    text_x_5.setAttribute("fill", "#000");
    text_x_5.setAttribute("y", "3.3%");
    text_x_5.setAttribute("dy", "0.71em");
    text_x_5.appendChild(document.createTextNode("trivial"));

    var g_x_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_5.setAttribute("class", "severity-x-tick-5");
    g_x_5.setAttribute("opacity", "1");
    g_x_5.appendChild(line_x_5);
    g_x_5.appendChild(text_x_5);

    var path_x = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_x.setAttribute("class", "severity-domain");
    path_x.setAttribute("stroke", "#000");

    var g_x = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x.setAttribute("class", "severity-axis-x");
    g_x.setAttribute("fill", "none");
    g_x.setAttribute("font-size", "12");
    g_x.setAttribute("text-anchor", "middle");
    g_x.appendChild(path_x);
    g_x.appendChild(g_x_1);
    g_x.appendChild(g_x_2);
    g_x.appendChild(g_x_3);
    g_x.appendChild(g_x_4);
    g_x.appendChild(g_x_5);

    var line_y_0_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_1.setAttribute("class", "severity-y-v-line");
    line_y_0_1.setAttribute("stroke", "#000");
    line_y_0_1.setAttribute("y1", "2%");
    line_y_0_1.setAttribute("y2", "-79.5%");
    line_y_0_1.setAttribute("dx", "0.32em");
    var line_y_0_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_2.setAttribute("class", "severity-y-h-line");
    line_y_0_2.setAttribute("stroke", "#000");
    line_y_0_2.setAttribute("x1", "89%");
    line_y_0_2.setAttribute("x2", "-2%");
    var text_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_0.setAttribute("fill", "#000");
    text_y_0.setAttribute("x", "-3.3%");
    text_y_0.setAttribute("dy", "0.32em");
    text_y_0.appendChild(document.createTextNode(scale_y[0]));

    var g_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_0.setAttribute("class", "severity-y-tick-0");
    g_y_0.setAttribute("opacity", "1");
    g_y_0.appendChild(line_y_0_1);
    g_y_0.appendChild(line_y_0_2);
    g_y_0.appendChild(text_y_0);

    var line_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_1.setAttribute("stroke", "#000");
    line_y_1.setAttribute("x2", "-2%");
    var text_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_1.setAttribute("fill", "#000");
    text_y_1.setAttribute("x", "-3.3%");
    text_y_1.setAttribute("dy", "0.32em");
    text_y_1.appendChild(document.createTextNode(scale_y[1]));

    var g_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_1.setAttribute("class", "severity-y-tick-1");
    g_y_1.setAttribute("opacity", "1");
    g_y_1.appendChild(line_y_1);
    g_y_1.appendChild(text_y_1);

    var line_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_2.setAttribute("stroke", "#000");
    line_y_2.setAttribute("x2", "-2%");
    var text_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_2.setAttribute("fill", "#000");
    text_y_2.setAttribute("x", "-3.3%");
    text_y_2.setAttribute("dy", "0.32em");
    text_y_2.appendChild(document.createTextNode(scale_y[2]));

    var g_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_2.setAttribute("class", "severity-y-tick-2");
    g_y_2.setAttribute("opacity", "1");
    g_y_2.appendChild(line_y_2);
    g_y_2.appendChild(text_y_2);

    var line_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_3.setAttribute("stroke", "#000");
    line_y_3.setAttribute("x2", "-2%");
    var text_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_3.setAttribute("fill", "#000");
    text_y_3.setAttribute("x", "-3.3%");
    text_y_3.setAttribute("dy", "0.32em");
    text_y_3.appendChild(document.createTextNode(scale_y[3]));

    var g_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_3.setAttribute("class", "severity-y-tick-3");
    g_y_3.setAttribute("opacity", "1");
    g_y_3.appendChild(line_y_3);
    g_y_3.appendChild(text_y_3);

    var line_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_4.setAttribute("stroke", "#000");
    line_y_4.setAttribute("x2", "-2%");
    var text_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_4.setAttribute("fill", "#000");
    text_y_4.setAttribute("x", "-3.3%");
    text_y_4.setAttribute("dy", "0.32em");
    text_y_4.appendChild(document.createTextNode(scale_y[4]));

    var g_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_4.setAttribute("class", "severity-y-tick-4");
    g_y_4.setAttribute("opacity", "1");
    g_y_4.appendChild(line_y_4);
    g_y_4.appendChild(text_y_4);

    var line_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_5.setAttribute("stroke", "#000");
    line_y_5.setAttribute("x2", "-2%");
    var text_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_5.setAttribute("fill", "#000");
    text_y_5.setAttribute("x", "-3.3%");
    text_y_5.setAttribute("dy", "0.32em");
    text_y_5.appendChild(document.createTextNode(scale_y[5]));

    var g_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_5.setAttribute("class", "severity-y-tick-5");
    g_y_5.setAttribute("opacity", "1");
    g_y_5.appendChild(line_y_5);
    g_y_5.appendChild(text_y_5);

    var line_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_6.setAttribute("stroke", "#000");
    line_y_6.setAttribute("x2", "-2%");
    var text_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_6.setAttribute("fill", "#000");
    text_y_6.setAttribute("x", "-3.3%");
    text_y_6.setAttribute("dy", "0.32em");
    text_y_6.appendChild(document.createTextNode(scale_y[6]));

    var g_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_6.setAttribute("class", "severity-y-tick-6");
    g_y_6.setAttribute("opacity", "1");
    g_y_6.appendChild(line_y_6);
    g_y_6.appendChild(text_y_6);

    var line_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_7.setAttribute("stroke", "#000");
    line_y_7.setAttribute("x2", "-2%");
    var text_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_7.setAttribute("fill", "#000");
    text_y_7.setAttribute("x", "-3.3%");
    text_y_7.setAttribute("dy", "0.32em");
    text_y_7.appendChild(document.createTextNode(scale_y[7]));

    var g_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_7.setAttribute("class", "severity-y-tick-7");
    g_y_7.setAttribute("opacity", "1");
    g_y_7.appendChild(line_y_7);
    g_y_7.appendChild(text_y_7);

    var line_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_8.setAttribute("stroke", "#000");
    line_y_8.setAttribute("x2", "-2%");
    var text_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_8.setAttribute("fill", "#000");
    text_y_8.setAttribute("x", "-3.3%");
    text_y_8.setAttribute("dy", "0.32em");
    text_y_8.appendChild(document.createTextNode(scale_y[8]));

    var g_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_8.setAttribute("class", "severity-y-tick-8");
    g_y_8.setAttribute("opacity", "1");
    g_y_8.appendChild(line_y_8);
    g_y_8.appendChild(text_y_8);

    var line_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_9.setAttribute("stroke", "#000");
    line_y_9.setAttribute("x2", "-2%");
    var text_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_9.setAttribute("fill", "#000");
    text_y_9.setAttribute("x", "-3.3%");
    text_y_9.setAttribute("dy", "0.32em");
    text_y_9.appendChild(document.createTextNode(scale_y[9]));

    var g_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_9.setAttribute("class", "severity-y-tick-9");
    g_y_9.setAttribute("opacity", "1");
    g_y_9.appendChild(line_y_9);
    g_y_9.appendChild(text_y_9);

    var line_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_10.setAttribute("stroke", "#000");
    line_y_10.setAttribute("x2", "-2%");
    var text_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_10.setAttribute("fill", "#000");
    text_y_10.setAttribute("x", "-3.3%");
    text_y_10.setAttribute("dy", "0.32em");
    text_y_10.appendChild(document.createTextNode(scale_y[10]));

    var g_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_10.setAttribute("class", "severity-y-tick-10");
    g_y_10.setAttribute("opacity", "1");
    g_y_10.appendChild(line_y_10);
    g_y_10.appendChild(text_y_10);

    var path_y = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_y.setAttribute("class", "severity-domain");
    path_y.setAttribute("stroke", "#000");

    var g_y = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y.setAttribute("class", "severity-axis-y");
    g_y.setAttribute("fill", "none");
    g_y.setAttribute("font-size", "12");
    g_y.setAttribute("text-anchor", "end");
    g_y.appendChild(g_y_0);
    g_y.appendChild(g_y_1);
    g_y.appendChild(g_y_2);
    g_y.appendChild(g_y_3);
    g_y.appendChild(g_y_4);
    g_y.appendChild(g_y_5);
    g_y.appendChild(g_y_6);
    g_y.appendChild(g_y_7);
    g_y.appendChild(g_y_8);
    g_y.appendChild(g_y_9);
    g_y.appendChild(g_y_10);

    var svg_severity = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_severity.setAttribute("class", "severity-chart");
    svg_severity.setAttribute("width", "75%");
    svg_severity.setAttribute("height", "95%");
    svg_severity.appendChild(g_plot);
    svg_severity.appendChild(g_x);
    svg_severity.appendChild(g_y);

    var title_severity = document.createElement("h2");
    title_severity.setAttribute("style", "margin: 10px; margin-bottom: 15px;");
    title_severity.appendChild(document.createTextNode("Severities"));
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px; margin-top: 2px;");
    description.appendChild(document.createTextNode("A total of " + total + " tests have been taken into account to make this summary."));

    var div_severity = document.createElement("div");
    div_severity.setAttribute("id", "sum-col");
    div_severity.setAttribute("class", "col");
    div_severity.setAttribute("style", "padding-bottom: 10%;");
    div_severity.appendChild(title_severity);
    div_severity.appendChild(svg_severity);
    div_severity.appendChild(description);

    resultsDiv.appendChild(div_severity);
}

function showNoConfigMessageOnGeneral(){

    div = document.getElementById("summary-info");

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

function getCategoryResults(json, valuesArray, nameArray){
    var items = json.items;
    var totalItems = json.total;

    for(i=0;i<totalItems;i++){
        var statistic = items[i].statistic;
        var total = statistic.total;
        var name = items[i].name;
        valuesArray[i] = total;
        nameArray[i] = name;
    }

    var res = [];

    valuesArray.forEach(function(value){
        res.push(value);
    })

    nameArray.forEach(function(name){

        res.push(name);
    })

    return res;

}

function makeCategoryDiv(resultsArray, nReports){

    var resultsDiv = document.getElementById("sum-row");

    var array = resultsArray.slice(0,5);

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var scale_y = getCoherentScale(array);

    var rect_plot_1_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_1.setAttribute("id", "cat-pd");
    rect_plot_1_1.setAttribute("class", "severity-bar");
    rect_plot_1_1.setAttribute("x", "5.1%");
    var percentage_1_1 = getPercentage(scale_y, array[0]);
    rect_plot_1_1.setAttribute("y", String(percentage_1_1) + "%");
    rect_plot_1_1.setAttribute("height", String(48-percentage_1_1) + "%");
    rect_plot_1_1.setAttribute("width", "16.2%");
    rect_plot_1_1.setAttribute("rx", "5");
    rect_plot_1_1.setAttribute("ry", "5");
    var rect_plot_1_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_2.setAttribute("id", "cat-pd");
    rect_plot_1_2.setAttribute("class", "severity-bar");
    rect_plot_1_2.setAttribute("x", "5.1%");
    var percentage_1_2 = getPercentage(scale_y, array[0]) + 4;
    rect_plot_1_2.setAttribute("y", String(percentage_1_2) + "%");
    rect_plot_1_2.setAttribute("height", String(48-percentage_1_2) + "%");
    rect_plot_1_2.setAttribute("width", "16.2%");
    var rect_plot_1_0 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_0.setAttribute("class", "severity-bar");
    rect_plot_1_0.setAttribute("x", "5.1%");
    rect_plot_1_0.setAttribute("y", "47%");
    rect_plot_1_0.setAttribute("height", "1%");
    rect_plot_1_0.setAttribute("width", "90%");
    rect_plot_1_0.setAttribute("opacity", "0");

    var g_plot_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_1.setAttribute("transform", "translate(0,0)");
    g_plot_1.appendChild(rect_plot_1_1);
    g_plot_1.appendChild(rect_plot_1_2);
    g_plot_1.appendChild(rect_plot_1_0);

    var rect_plot_2_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_2_1.setAttribute("id", "cat-td");
    rect_plot_2_1.setAttribute("class", "severity-bar");
    rect_plot_2_1.setAttribute("x", "22.8%");
    var percentage_2_1 = getPercentage(scale_y, array[1]);
    rect_plot_2_1.setAttribute("y", String(percentage_2_1) + "%");
    rect_plot_2_1.setAttribute("height", String(48-percentage_2_1) + "%");
    rect_plot_2_1.setAttribute("width", "16.2%");
    rect_plot_2_1.setAttribute("rx", "5");
    rect_plot_2_1.setAttribute("ry", "5");
    var rect_plot_2_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_2_2.setAttribute("id", "cat-td");
    rect_plot_2_2.setAttribute("class", "severity-bar");
    rect_plot_2_2.setAttribute("x", "22.8%");
    var percentage_2_2 = getPercentage(scale_y, array[1]) + 4;
    rect_plot_2_2.setAttribute("y", String(percentage_2_2) + "%");
    rect_plot_2_2.setAttribute("height", String(48-percentage_2_2) + "%");
    rect_plot_2_2.setAttribute("width", "16.2%");

    var g_plot_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_2.setAttribute("transform", "translate(0,0)");
    g_plot_2.appendChild(rect_plot_2_1);
    g_plot_2.appendChild(rect_plot_2_2);

    var rect_plot_3_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_3_1.setAttribute("id", "cat-ot");
    rect_plot_3_1.setAttribute("class", "severity-bar");
    rect_plot_3_1.setAttribute("x", "40.6%");
    var percentage_3_1 = getPercentage(scale_y, array[2]);
    rect_plot_3_1.setAttribute("y", String(percentage_3_1) + "%");
    rect_plot_3_1.setAttribute("height", String(48-percentage_3_1) + "%");
    rect_plot_3_1.setAttribute("width", "16.2%");
    rect_plot_3_1.setAttribute("rx", "5");
    rect_plot_3_1.setAttribute("ry", "5");
    var rect_plot_3_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_3_2.setAttribute("id", "cat-ot");
    rect_plot_3_2.setAttribute("class", "severity-bar");
    rect_plot_3_2.setAttribute("x", "40.6%");
    var percentage_3_2 = getPercentage(scale_y, array[2]) + 4;
    rect_plot_3_2.setAttribute("y", String(percentage_3_2) + "%");
    rect_plot_3_2.setAttribute("height", String(48-percentage_3_2) + "%");
    rect_plot_3_2.setAttribute("width", "16.2%");

    var g_plot_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_3.setAttribute("transform", "translate(0,0)");
    g_plot_3.appendChild(rect_plot_3_1);
    g_plot_3.appendChild(rect_plot_3_2);

    var rect_plot_4_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_4_1.setAttribute("id", "cat-ip");
    rect_plot_4_1.setAttribute("class", "severity-bar");
    rect_plot_4_1.setAttribute("x", "58.4%");
    var percentage_4_1 = getPercentage(scale_y, array[3]);
    rect_plot_4_1.setAttribute("y", String(percentage_4_1) + "%");
    rect_plot_4_1.setAttribute("height", String(48-percentage_4_1) + "%");
    rect_plot_4_1.setAttribute("width", "16.2%");
    rect_plot_4_1.setAttribute("rx", "5");
    rect_plot_4_1.setAttribute("ry", "5");
    var rect_plot_4_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_4_2.setAttribute("id", "cat-ip");
    rect_plot_4_2.setAttribute("class", "severity-bar");
    rect_plot_4_2.setAttribute("x", "58.4%");
    var percentage_4_2 = getPercentage(scale_y, array[3]) + 4;
    rect_plot_4_2.setAttribute("y", String(percentage_4_2) + "%");
    rect_plot_4_2.setAttribute("height", String(48-percentage_4_2) + "%");
    rect_plot_4_2.setAttribute("width", "16.2%");

    var g_plot_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_4.setAttribute("transform", "translate(0,0)");
    g_plot_4.appendChild(rect_plot_4_1);
    g_plot_4.appendChild(rect_plot_4_2);

    var rect_plot_5_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_5_1.setAttribute("id", "cat-it");
    rect_plot_5_1.setAttribute("class", "severity-bar");
    rect_plot_5_1.setAttribute("x", "76.2%");
    var percentage_5_1 = getPercentage(scale_y, array[4]);
    rect_plot_5_1.setAttribute("y", String(percentage_5_1) + "%");
    rect_plot_5_1.setAttribute("height", String(48-percentage_5_1) + "%");
    rect_plot_5_1.setAttribute("width", "16.2%");
    rect_plot_5_1.setAttribute("rx", "5");
    rect_plot_5_1.setAttribute("ry", "5");
    var rect_plot_5_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_5_2.setAttribute("id", "cat-it");
    rect_plot_5_2.setAttribute("class", "severity-bar");
    rect_plot_5_2.setAttribute("x", "76.2%");
    var percentage_5_2 = getPercentage(scale_y, array[4]) + 4;
    rect_plot_5_2.setAttribute("y", String(percentage_5_2) + "%");
    rect_plot_5_2.setAttribute("height", String(48-percentage_5_2) + "%");
    rect_plot_5_2.setAttribute("width", "16.2%");

    var g_plot_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot_5.setAttribute("transform", "translate(0,0)");
    g_plot_5.appendChild(rect_plot_5_1);
    g_plot_5.appendChild(rect_plot_5_2);

    var g_plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot.setAttribute("class", "severity-plot");
    g_plot.setAttribute("style", "padding-bottom: 10%;");
    g_plot.appendChild(g_plot_1);
    g_plot.appendChild(g_plot_2);
    g_plot.appendChild(g_plot_3);
    g_plot.appendChild(g_plot_4);
    g_plot.appendChild(g_plot_5);

    var line_x_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_1.setAttribute("class", "severity-x-tick-1-line");
    line_x_1.setAttribute("stroke", "#000");
    line_x_1.setAttribute("y2", "2%");

    var g_x_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_1.setAttribute("class", "severity-x-tick-1");
    g_x_1.setAttribute("opacity", "1");
    g_x_1.appendChild(line_x_1);

    var line_x_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_2.setAttribute("class", "severity-x-tick-2-line");
    line_x_2.setAttribute("stroke", "#000");
    line_x_2.setAttribute("y2", "2%");

    var g_x_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_2.setAttribute("class", "severity-x-tick-2");
    g_x_2.setAttribute("opacity", "1");
    g_x_2.appendChild(line_x_2);

    var line_x_3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_3.setAttribute("class", "severity-x-tick-3-line");
    line_x_3.setAttribute("stroke", "#000");
    line_x_3.setAttribute("y2", "2%");

    var g_x_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_3.setAttribute("class", "severity-x-tick-3");
    g_x_3.setAttribute("opacity", "1");
    g_x_3.appendChild(line_x_3);

    var line_x_4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_4.setAttribute("class", "severity-x-tick-4-line");
    line_x_4.setAttribute("stroke", "#000");
    line_x_4.setAttribute("y2", "2%");

    var g_x_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_4.setAttribute("class", "severity-x-tick-4");
    g_x_4.setAttribute("opacity", "1");
    g_x_4.appendChild(line_x_4);

    var line_x_5 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x_5.setAttribute("class", "severity-x-tick-5-line");
    line_x_5.setAttribute("stroke", "#000");
    line_x_5.setAttribute("y2", "2%");

    var g_x_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x_5.setAttribute("class", "severity-x-tick-5");
    g_x_5.setAttribute("opacity", "1");
    g_x_5.appendChild(line_x_5);

    var path_x = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_x.setAttribute("class", "severity-domain");
    path_x.setAttribute("stroke", "#000");

    var g_x = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x.setAttribute("class", "severity-axis-x");
    g_x.setAttribute("fill", "none");
    g_x.setAttribute("font-size", "12");
    g_x.setAttribute("text-anchor", "middle");
    g_x.appendChild(path_x);
    g_x.appendChild(g_x_1);
    g_x.appendChild(g_x_2);
    g_x.appendChild(g_x_3);
    g_x.appendChild(g_x_4);
    g_x.appendChild(g_x_5);

    var line_y_0_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_1.setAttribute("class", "severity-y-v-line");
    line_y_0_1.setAttribute("stroke", "#000");
    line_y_0_1.setAttribute("y1", "2%");
    line_y_0_1.setAttribute("y2", "-79.5%");
    line_y_0_1.setAttribute("dx", "0.32em");
    var line_y_0_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_2.setAttribute("class", "severity-y-h-line");
    line_y_0_2.setAttribute("stroke", "#000");
    line_y_0_2.setAttribute("x1", "89%");
    line_y_0_2.setAttribute("x2", "-2%");
    var text_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_0.setAttribute("fill", "#000");
    text_y_0.setAttribute("x", "-3.3%");
    text_y_0.setAttribute("dy", "0.32em");
    text_y_0.appendChild(document.createTextNode(scale_y[0]));

    var g_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_0.setAttribute("class", "severity-y-tick-0");
    g_y_0.setAttribute("opacity", "1");
    g_y_0.appendChild(line_y_0_1);
    g_y_0.appendChild(line_y_0_2);
    g_y_0.appendChild(text_y_0);

    var line_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_1.setAttribute("stroke", "#000");
    line_y_1.setAttribute("x2", "-2%");
    var text_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_1.setAttribute("fill", "#000");
    text_y_1.setAttribute("x", "-3.3%");
    text_y_1.setAttribute("dy", "0.32em");
    text_y_1.appendChild(document.createTextNode(scale_y[1]));

    var g_y_1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_1.setAttribute("class", "severity-y-tick-1");
    g_y_1.setAttribute("opacity", "1");
    g_y_1.appendChild(line_y_1);
    g_y_1.appendChild(text_y_1);

    var line_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_2.setAttribute("stroke", "#000");
    line_y_2.setAttribute("x2", "-2%");
    var text_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_2.setAttribute("fill", "#000");
    text_y_2.setAttribute("x", "-3.3%");
    text_y_2.setAttribute("dy", "0.32em");
    text_y_2.appendChild(document.createTextNode(scale_y[2]));

    var g_y_2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_2.setAttribute("class", "severity-y-tick-2");
    g_y_2.setAttribute("opacity", "1");
    g_y_2.appendChild(line_y_2);
    g_y_2.appendChild(text_y_2);

    var line_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_3.setAttribute("stroke", "#000");
    line_y_3.setAttribute("x2", "-2%");
    var text_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_3.setAttribute("fill", "#000");
    text_y_3.setAttribute("x", "-3.3%");
    text_y_3.setAttribute("dy", "0.32em");
    text_y_3.appendChild(document.createTextNode(scale_y[3]));

    var g_y_3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_3.setAttribute("class", "severity-y-tick-3");
    g_y_3.setAttribute("opacity", "1");
    g_y_3.appendChild(line_y_3);
    g_y_3.appendChild(text_y_3);

    var line_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_4.setAttribute("stroke", "#000");
    line_y_4.setAttribute("x2", "-2%");
    var text_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_4.setAttribute("fill", "#000");
    text_y_4.setAttribute("x", "-3.3%");
    text_y_4.setAttribute("dy", "0.32em");
    text_y_4.appendChild(document.createTextNode(scale_y[4]));

    var g_y_4 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_4.setAttribute("class", "severity-y-tick-4");
    g_y_4.setAttribute("opacity", "1");
    g_y_4.appendChild(line_y_4);
    g_y_4.appendChild(text_y_4);

    var line_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_5.setAttribute("stroke", "#000");
    line_y_5.setAttribute("x2", "-2%");
    var text_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_5.setAttribute("fill", "#000");
    text_y_5.setAttribute("x", "-3.3%");
    text_y_5.setAttribute("dy", "0.32em");
    text_y_5.appendChild(document.createTextNode(scale_y[5]));

    var g_y_5 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_5.setAttribute("class", "severity-y-tick-5");
    g_y_5.setAttribute("opacity", "1");
    g_y_5.appendChild(line_y_5);
    g_y_5.appendChild(text_y_5);

    var line_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_6.setAttribute("stroke", "#000");
    line_y_6.setAttribute("x2", "-2%");
    var text_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_6.setAttribute("fill", "#000");
    text_y_6.setAttribute("x", "-3.3%");
    text_y_6.setAttribute("dy", "0.32em");
    text_y_6.appendChild(document.createTextNode(scale_y[6]));

    var g_y_6 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_6.setAttribute("class", "severity-y-tick-6");
    g_y_6.setAttribute("opacity", "1");
    g_y_6.appendChild(line_y_6);
    g_y_6.appendChild(text_y_6);

    var line_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_7.setAttribute("stroke", "#000");
    line_y_7.setAttribute("x2", "-2%");
    var text_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_7.setAttribute("fill", "#000");
    text_y_7.setAttribute("x", "-3.3%");
    text_y_7.setAttribute("dy", "0.32em");
    text_y_7.appendChild(document.createTextNode(scale_y[7]));

    var g_y_7 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_7.setAttribute("class", "severity-y-tick-7");
    g_y_7.setAttribute("opacity", "1");
    g_y_7.appendChild(line_y_7);
    g_y_7.appendChild(text_y_7);

    var line_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_8.setAttribute("stroke", "#000");
    line_y_8.setAttribute("x2", "-2%");
    var text_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_8.setAttribute("fill", "#000");
    text_y_8.setAttribute("x", "-3.3%");
    text_y_8.setAttribute("dy", "0.32em");
    text_y_8.appendChild(document.createTextNode(scale_y[8]));

    var g_y_8 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_8.setAttribute("class", "severity-y-tick-8");
    g_y_8.setAttribute("opacity", "1");
    g_y_8.appendChild(line_y_8);
    g_y_8.appendChild(text_y_8);

    var line_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_9.setAttribute("stroke", "#000");
    line_y_9.setAttribute("x2", "-2%");
    var text_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_9.setAttribute("fill", "#000");
    text_y_9.setAttribute("x", "-3.3%");
    text_y_9.setAttribute("dy", "0.32em");
    text_y_9.appendChild(document.createTextNode(scale_y[9]));

    var g_y_9 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_9.setAttribute("class", "severity-y-tick-9");
    g_y_9.setAttribute("opacity", "1");
    g_y_9.appendChild(line_y_9);
    g_y_9.appendChild(text_y_9);

    var line_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_10.setAttribute("stroke", "#000");
    line_y_10.setAttribute("x2", "-2%");
    var text_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y_10.setAttribute("fill", "#000");
    text_y_10.setAttribute("x", "-3.3%");
    text_y_10.setAttribute("dy", "0.32em");
    text_y_10.appendChild(document.createTextNode(scale_y[10]));

    var g_y_10 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_10.setAttribute("class", "severity-y-tick-10");
    g_y_10.setAttribute("opacity", "1");
    g_y_10.appendChild(line_y_10);
    g_y_10.appendChild(text_y_10);

    var path_y = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_y.setAttribute("class", "severity-domain");
    path_y.setAttribute("stroke", "#000");

    var g_y = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y.setAttribute("class", "severity-axis-y");
    g_y.setAttribute("fill", "none");
    g_y.setAttribute("font-size", "12");
    g_y.setAttribute("text-anchor", "end");
    g_y.appendChild(g_y_0);
    g_y.appendChild(g_y_1);
    g_y.appendChild(g_y_2);
    g_y.appendChild(g_y_3);
    g_y.appendChild(g_y_4);
    g_y.appendChild(g_y_5);
    g_y.appendChild(g_y_6);
    g_y.appendChild(g_y_7);
    g_y.appendChild(g_y_8);
    g_y.appendChild(g_y_9);
    g_y.appendChild(g_y_10);

    var svg_severity = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_severity.setAttribute("class", "severity-chart");
    svg_severity.setAttribute("width", "75%");
    svg_severity.setAttribute("height", "95%");
    svg_severity.appendChild(g_plot);
    svg_severity.appendChild(g_x);
    svg_severity.appendChild(g_y);

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var title_severity = document.createElement("h2");
    title_severity.setAttribute("style", "margin: 10px; margin-bottom: 15px;");
    title_severity.appendChild(document.createTextNode("Categories"));

    var div1 = document.createElement("div");
    div1.setAttribute("class", "col");

    div1.appendChild(title_severity);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "col-2");
    div2.setAttribute("style", "padding:auto;");

    div2.innerHTML = "<i class='far fa-question-circle' style='font-size: 1.5rem; color: #6c757d; width: 10%; margin: 1rem;' aria-hidden='true';></i>" + 
            "<span class='tooltip-text'>" +
                "<b>Help</b>" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#800026;' aria-hidden='true'></i> Ignored tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#d31121;' aria-hidden='true'></i> Infrastructure problems" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fa5c2e;' aria-hidden='true'></i> Outdated tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#feab4b;' aria-hidden='true'></i> Test defects" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fee087;' aria-hidden='true'></i> Product defects" +
            "</span>";

    titleRow.appendChild(div1);
    titleRow.appendChild(div2);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px; margin-top: 2px;");
    description.appendChild(document.createTextNode("A total of " + total + " tests have been taken into account to make this part of the summary."));

    var div_severity = document.createElement("div");
    div_severity.setAttribute("id", "sum-col");
    div_severity.setAttribute("class", "col");
    div_severity.setAttribute("style", "padding-bottom: 10%;");
    div_severity.appendChild(titleRow);
    div_severity.appendChild(svg_severity);
    div_severity.appendChild(description);

    var blank = document.createElement("div");
    blank.setAttribute("id", "sum-col");
    blank.setAttribute("class", "col");
    blank.appendChild(document.createTextNode("Blank div for development purpose :)"));

    resultsDiv.appendChild(div_severity);
}