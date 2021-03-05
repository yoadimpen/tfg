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
        // en caso de que se hayan guardado rutas directas a los informes
        } else {
            var links = config_json.links;
            var reportsPath = "";
            reportsPath = links[0];

            for(z=1;z<links.length;z++){
                reportsPath = reportsPath.concat(";").concat(links[z]);
            }
            generateSummaryDivs(reportsPath);
        }
    //en caso de que no haya ninguna configuración añadida
    } else {
        showNoConfigMessageOnGeneral();
    }
}

function actualizaTemp(links, cont){
    //reinicia el JSON para la nueva generación
    if(cont == 0){
        localStorage.removeItem("links_temp");
    }

    //se procede a iterar todos los enlaces de rutas del directorio actual
    links.forEach(function(link){
        //en caso de que sea el primer enlace
        if(localStorage.getItem("links_temp") == null){
            localStorage.setItem("links_temp", link);
        //todos los demás enlaces se concatenan al existente
        } else{
            var links_temp = localStorage.getItem("links_temp").concat(";").concat(link);
            localStorage.removeItem("links_temp");
            localStorage.setItem("links_temp", links_temp);
        }
    })
}

function getPathsFromHTTPRequest(response){
    //se utiliza para sacar el nombre de las carpetas que contienen los informes

    var res = [];
    var firstSplit = response.split("201: ");

    for(i=1;i<firstSplit.length;i++){
        var secondSplit = firstSplit[i].split(" 4096");
        res[i-1] = secondSplit[0];
    }
    return res;
}

function generateSummaryDivs(reportsPath){
    var pathsArray = reportsPath.split(";");

    //arrays de resultados que se van reutilizando
    var statusArray = [0,0,0,0,0];
    var severityArray = [0,0,0,0,0];
    var categoryArray = [0,0,0,0,0];
    var categoryNameArray = ["", "", "", "", ""];

    pathsArray.forEach(function(path){
        path = path.trim();
        //se procede a leer los JSON summary.json, severity.json y categories.json
        readJSONs(path, statusArray, severityArray, categoryArray, categoryNameArray, pathsArray.length);
    })

    showTotalReports(pathsArray.length);
}

function readJSONs (path, statusArray, severityArray, categoryArray, categoryNameArray, nReports){
    //lectura del JSON summary.json
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
        //makeTypeDiv(res1, nReports);
        makeTypeDivAux(res1, nReports);
    };

    //lectura del JSON severity.json
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
            //makeSeverityDiv(res2, nReports);
            makeSeverityDivAux(res2);
        }
    };

    //lectura del JSON categories.json
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
            //makeCategoryDiv(res3, nReports);
            makeCategoryDivAux(res3);
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

    div2.innerHTML = "<i class='far fa-question-circle' style='font-size: 1.5rem; color: #6c757d; width: 10%; margin: 1rem;' aria-hidden='true'></i>" + 
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

function makeTypeDivAux(array, totalReports){
    var resultsDiv = document.getElementById("sum-row");
    resultsDiv.innerHTML = "";

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    canvas.setAttribute("style", "margin-top:15%;");

    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [array[0], array[1], array[2], array[3], array[4]],
                backgroundColor: [
                    "#fc4e03",
                    "#fcdf03",
                    "#a80068",
                    "#a3db02",
                    "#454545"
                ]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Failed',
                'Broken',
                'Skipped',
                'Passed',
                'Unknown'
            ]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 15
                },
                position: 'bottom'
            }
        }
    });

    var title = document.createElement("h2");
    title.setAttribute("style", "margin: 10px");
    title.appendChild(document.createTextNode("Status"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);

    var description = document.createElement("p");
    description.setAttribute("id", "status");
    description.appendChild(document.createTextNode("This summary has been made over a total of " + totalReports + " reports from the provided paths."));

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(canvas);
    div.appendChild(description);

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

    var rect_plot_1_1 = getRectPlot(1);
    var percentage_1_1 = getPercentage(scale_y, array[0]);
    updateRectPlot(rect_plot_1_1, percentage_1_1, true);

    var rect_plot_1_2 = getRectPlot(1);
    var percentage_1_2 = getPercentage(scale_y, array[0]) + 4;
    updateRectPlot(rect_plot_1_2, percentage_1_2, false);

    var rect_plot_1_0 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_0.setAttribute("class", "graph-bar");
    rect_plot_1_0.setAttribute("x", "5.1%");
    rect_plot_1_0.setAttribute("y", "47%");
    rect_plot_1_0.setAttribute("height", "1%");
    rect_plot_1_0.setAttribute("width", "90%");
    rect_plot_1_0.setAttribute("opacity", "0");

    var g_plot_1 = getGplot(rect_plot_1_1, rect_plot_1_2);
    g_plot_1.appendChild(rect_plot_1_0);

    var rect_plot_2_1 = getRectPlot(2);
    var percentage_2_1 = getPercentage(scale_y, array[1]);
    updateRectPlot(rect_plot_2_1, percentage_2_1, true);

    var rect_plot_2_2 = getRectPlot(2);
    var percentage_2_2 = getPercentage(scale_y, array[1]) + 4;
    updateRectPlot(rect_plot_2_2, percentage_2_2, false);

    var g_plot_2 = getGplot(rect_plot_2_1, rect_plot_2_2);

    var rect_plot_3_1 = getRectPlot(3);
    var percentage_3_1 = getPercentage(scale_y, array[2]);
    updateRectPlot(rect_plot_3_1, percentage_3_1, true);

    var rect_plot_3_2 = getRectPlot(3);
    var percentage_3_2 = getPercentage(scale_y, array[2]) + 4;
    updateRectPlot(rect_plot_3_2, percentage_3_2, false);

    var g_plot_3 = getGplot(rect_plot_3_1, rect_plot_3_2);

    var rect_plot_4_1 = getRectPlot(4);
    var percentage_4_1 = getPercentage(scale_y, array[3]);
    updateRectPlot(rect_plot_4_1, percentage_4_1, true);
    
    var rect_plot_4_2 = getRectPlot(4);
    var percentage_4_2 = getPercentage(scale_y, array[3]) + 4;
    updateRectPlot(rect_plot_4_2, percentage_4_2, false);

    var g_plot_4 = getGplot(rect_plot_4_1, rect_plot_4_2);

    var rect_plot_5_1 = getRectPlot(5);
    var percentage_5_1 = getPercentage(scale_y, array[4]);
    updateRectPlot(rect_plot_5_1, percentage_5_1, true);

    var rect_plot_5_2 = getRectPlot(5);
    var percentage_5_2 = getPercentage(scale_y, array[4]) + 4;
    updateRectPlot(rect_plot_5_2, percentage_5_2, false);

    var g_plot_5 = getGplot(rect_plot_5_1, rect_plot_5_2);

    var g_plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot.setAttribute("class", "graph-plot");
    g_plot.setAttribute("style", "padding-bottom: 10%;");
    g_plot.appendChild(g_plot_1);
    g_plot.appendChild(g_plot_2);
    g_plot.appendChild(g_plot_3);
    g_plot.appendChild(g_plot_4);
    g_plot.appendChild(g_plot_5);

    var line_x_1 = getLineX(1);
    var text_x_1 = getTextX("blocker");

    var g_x_1 = getGX(1, line_x_1, text_x_1, true);

    var line_x_2 = getLineX(2);
    var text_x_2 = getTextX("critical");

    var g_x_2 = getGX(2, line_x_2, text_x_2, true);

    var line_x_3 = getLineX(3);
    var text_x_3 = getTextX("normal");

    var g_x_3 = getGX(3, line_x_3, text_x_3, true);

    var line_x_4 = getLineX(4);
    var text_x_4 = getTextX("minor");

    var g_x_4 = getGX(4, line_x_4, text_x_4, true);

    var line_x_5 = getLineX(5);
    var text_x_5 = getTextX("trivial");

    var g_x_5 = getGX(5, line_x_5, text_x_5, true);

    var path_x = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_x.setAttribute("class", "graph-domain");
    path_x.setAttribute("stroke", "#000");

    var g_x = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x.setAttribute("class", "graph-axis-x");
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
    line_y_0_1.setAttribute("class", "graph-y-v-line");
    line_y_0_1.setAttribute("stroke", "#000");
    line_y_0_1.setAttribute("y1", "2%");
    line_y_0_1.setAttribute("y2", "-79.5%");
    line_y_0_1.setAttribute("dx", "0.32em");
    var line_y_0_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_2.setAttribute("class", "graph-y-h-line");
    line_y_0_2.setAttribute("stroke", "#000");
    line_y_0_2.setAttribute("x1", "89%");
    line_y_0_2.setAttribute("x2", "-2%");
    var text_y_0 = getTextY(scale_y[0]);

    var g_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_0.setAttribute("class", "graph-y-tick-0");
    g_y_0.setAttribute("opacity", "1");
    g_y_0.appendChild(line_y_0_1);
    g_y_0.appendChild(line_y_0_2);
    g_y_0.appendChild(text_y_0);

    var line_y_1 = getLineY();
    var text_y_1 = getTextY(scale_y[1]);

    var g_y_1 = getGY(1, line_y_1, text_y_1);

    var line_y_2 = getLineY();
    var text_y_2 = getTextY(scale_y[2]);

    var g_y_2 = getGY(2, line_y_2, text_y_2);

    var line_y_3 = getLineY();
    var text_y_3 = getTextY(scale_y[3]);

    var g_y_3 = getGY(3, line_y_3, text_y_3);

    var line_y_4 = getLineY();
    var text_y_4 = getTextY(scale_y[4]);

    var g_y_4 = getGY(4, line_y_4, text_y_4);

    var line_y_5 = getLineY();
    var text_y_5 = getTextY(scale_y[5]);

    var g_y_5 = getGY(5, line_y_5, text_y_5);

    var line_y_6 = getLineY();
    var text_y_6 = getTextY(scale_y[6]);

    var g_y_6 = getGY(6, line_y_6, text_y_6);

    var line_y_7 = getLineY();
    var text_y_7 = getTextY(scale_y[7]);

    var g_y_7 = getGY(7, line_y_7, text_y_7);

    var line_y_8 = getLineY();
    var text_y_8 = getTextY(scale_y[8]);

    var g_y_8 = getGY(8, line_y_8, text_y_8);

    var line_y_9 = getLineY();
    var text_y_9 = getTextY(scale_y[9]);

    var g_y_9 = getGY(9, line_y_9, text_y_9);

    var line_y_10 = getLineY();
    var text_y_10 = getTextY(scale_y[10]);

    var g_y_10 = getGY(10, line_y_10, text_y_10);

    var path_y = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_y.setAttribute("class", "graph-domain");
    path_y.setAttribute("stroke", "#000");

    var g_y = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y.setAttribute("class", "graph-axis-y");
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
    svg_severity.setAttribute("class", "graph-chart");
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

function makeSeverityDivAux(array){
    var resultsDiv = document.getElementById("sum-row");

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "severity");
    canvas.setAttribute("width", "75%");
    canvas.setAttribute("height", "54%");
    canvas.setAttribute("style", "margin-top:10%;");

    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: [array[0], array[1], array[2], array[3], array[4]],
                backgroundColor: [
                    "#6dd6cd",
                    "#6dd6cd",
                    "#6dd6cd",
                    "#6dd6cd",
                    "#6dd6cd"
                ],
                borderWidth: 1,
                borderColor: [
                    "#46827d",
                    "#46827d",
                    "#46827d",
                    "#46827d",
                    "#46827d"
                ]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'blocker',
                'critical',
                'normal',
                'minor',
                'trivial'
            ]
        },
        options: {
            legend: {
                display: false
            }
        }
    });

    var title = document.createElement("h2");
    title.setAttribute("style", "margin: 10px;");
    title.appendChild(document.createTextNode("Severities"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px; margin-top: 2px; bottom: 0px;");
    description.appendChild(document.createTextNode("A total of " + total + " tests have been taken into account to make this summary."));

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(canvas);
    div.appendChild(description);

    resultsDiv.appendChild(div);
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
        valuesArray[i] = valuesArray[i] + total;
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

    var rect_plot_1_1 = getRectPlot(1);
    var percentage_1_1 = getPercentage(scale_y, array[0]);
    updateRectPlot(rect_plot_1_1, percentage_1_1, true);
    rect_plot_1_1.setAttribute("id", "cat-pd");

    var rect_plot_1_2 = getRectPlot(1);
    var percentage_1_2 = getPercentage(scale_y, array[0]) + 4;
    updateRectPlot(rect_plot_1_2, percentage_1_2, false);
    rect_plot_1_2.setAttribute("id", "cat-pd");

    var rect_plot_1_0 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot_1_0.setAttribute("class", "graph-bar");
    rect_plot_1_0.setAttribute("x", "5.1%");
    rect_plot_1_0.setAttribute("y", "47%");
    rect_plot_1_0.setAttribute("height", "1%");
    rect_plot_1_0.setAttribute("width", "90%");
    rect_plot_1_0.setAttribute("opacity", "0");

    var g_plot_1 = getGplot(rect_plot_1_1, rect_plot_1_2);
    g_plot_1.appendChild(rect_plot_1_0);

    var rect_plot_2_1 = getRectPlot(2);
    var percentage_2_1 = getPercentage(scale_y, array[1]);
    updateRectPlot(rect_plot_2_1, percentage_2_1, true);
    rect_plot_2_1.setAttribute("id", "cat-td");

    var rect_plot_2_2 = getRectPlot(2);
    var percentage_2_2 = getPercentage(scale_y, array[1]) + 4;
    updateRectPlot(rect_plot_2_2, percentage_2_2, false);
    rect_plot_2_2.setAttribute("id", "cat-td");

    var g_plot_2 = getGplot(rect_plot_2_1, rect_plot_2_2);

    var rect_plot_3_1 = getRectPlot(3);
    var percentage_3_1 = getPercentage(scale_y, array[2]);
    updateRectPlot(rect_plot_3_1, percentage_3_1, true);
    rect_plot_3_1.setAttribute("id", "cat-ot");

    var rect_plot_3_2 = getRectPlot(3);
    var percentage_3_2 = getPercentage(scale_y, array[2]) + 4;
    updateRectPlot(rect_plot_3_2, percentage_3_2, false);
    rect_plot_3_2.setAttribute("id", "cat-ot");

    var g_plot_3 = getGplot(rect_plot_3_1, rect_plot_3_2);

    var rect_plot_4_1 = getRectPlot(4);
    var percentage_4_1 = getPercentage(scale_y, array[3]);
    updateRectPlot(rect_plot_4_1, percentage_4_1, true);
    rect_plot_4_1.setAttribute("id", "cat-ip");
    
    var rect_plot_4_2 = getRectPlot(4);
    var percentage_4_2 = getPercentage(scale_y, array[3]) + 4;
    updateRectPlot(rect_plot_4_2, percentage_4_2, false);
    rect_plot_4_2.setAttribute("id", "cat-ip");

    var g_plot_4 = getGplot(rect_plot_4_1, rect_plot_4_2);

    var rect_plot_5_1 = getRectPlot(5);
    var percentage_5_1 = getPercentage(scale_y, array[4]);
    updateRectPlot(rect_plot_5_1, percentage_5_1, true);
    rect_plot_5_1.setAttribute("id", "cat-it");

    var rect_plot_5_2 = getRectPlot(5);
    var percentage_5_2 = getPercentage(scale_y, array[4]) + 4;
    updateRectPlot(rect_plot_5_2, percentage_5_2, false);
    rect_plot_5_2.setAttribute("id", "cat-it");

    var g_plot_5 = getGplot(rect_plot_5_1, rect_plot_5_2);

    var g_plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot.setAttribute("class", "graph-plot");
    g_plot.setAttribute("style", "padding-bottom: 10%;");
    g_plot.appendChild(g_plot_1);
    g_plot.appendChild(g_plot_2);
    g_plot.appendChild(g_plot_3);
    g_plot.appendChild(g_plot_4);
    g_plot.appendChild(g_plot_5);

    var line_x_1 = getLineX(1);
    var g_x_1 = getGX(1, line_x_1, null, false);

    var line_x_2 = getLineX(2);
    var g_x_2 = getGX(2, line_x_2, null, false);

    var line_x_3 = getLineX(3);
    var g_x_3 = getGX(3, line_x_3, null, false);

    var line_x_4 = getLineX(4);
    var g_x_4 = getGX(4, line_x_4, null, false);

    var line_x_5 = getLineX(5);
    var g_x_5 = getGX(5, line_x_5, null, false);

    var path_x = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_x.setAttribute("class", "graph-domain");
    path_x.setAttribute("stroke", "#000");

    var g_x = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x.setAttribute("class", "graph-axis-x");
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
    line_y_0_1.setAttribute("class", "graph-y-v-line");
    line_y_0_1.setAttribute("stroke", "#000");
    line_y_0_1.setAttribute("y1", "2%");
    line_y_0_1.setAttribute("y2", "-79.5%");
    line_y_0_1.setAttribute("dx", "0.32em");
    var line_y_0_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y_0_2.setAttribute("class", "graph-y-h-line");
    line_y_0_2.setAttribute("stroke", "#000");
    line_y_0_2.setAttribute("x1", "89%");
    line_y_0_2.setAttribute("x2", "-2%");
    var text_y_0 = getTextY(scale_y[0]);

    var g_y_0 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y_0.setAttribute("class", "graph-y-tick-0");
    g_y_0.setAttribute("opacity", "1");
    g_y_0.appendChild(line_y_0_1);
    g_y_0.appendChild(line_y_0_2);
    g_y_0.appendChild(text_y_0);

    var line_y_1 = getLineY();
    var text_y_1 = getTextY(scale_y[1]);

    var g_y_1 = getGY(1, line_y_1, text_y_1);

    var line_y_2 = getLineY();
    var text_y_2 = getTextY(scale_y[2]);

    var g_y_2 = getGY(2, line_y_2, text_y_2);

    var line_y_3 = getLineY();
    var text_y_3 = getTextY(scale_y[3]);

    var g_y_3 = getGY(3, line_y_3, text_y_3);

    var line_y_4 = getLineY();
    var text_y_4 = getTextY(scale_y[4]);

    var g_y_4 = getGY(4, line_y_4, text_y_4);

    var line_y_5 = getLineY();
    var text_y_5 = getTextY(scale_y[5]);

    var g_y_5 = getGY(5, line_y_5, text_y_5);

    var line_y_6 = getLineY();
    var text_y_6 = getTextY(scale_y[6]);

    var g_y_6 = getGY(6, line_y_6, text_y_6);

    var line_y_7 = getLineY();
    var text_y_7 = getTextY(scale_y[7]);

    var g_y_7 = getGY(7, line_y_7, text_y_7);

    var line_y_8 = getLineY();
    var text_y_8 = getTextY(scale_y[8]);

    var g_y_8 = getGY(8, line_y_8, text_y_8);

    var line_y_9 = getLineY();
    var text_y_9 = getTextY(scale_y[9]);

    var g_y_9 = getGY(9, line_y_9, text_y_9);

    var line_y_10 = getLineY();
    var text_y_10 = getTextY(scale_y[10]);

    var g_y_10 = getGY(10, line_y_10, text_y_10);

    var path_y = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_y.setAttribute("class", "graph-domain");
    path_y.setAttribute("stroke", "#000");

    var g_y = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y.setAttribute("class", "graph-axis-y");
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
    svg_severity.setAttribute("class", "graph-chart");
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

function makeCategoryDivAux(array){
    var resultsDiv = document.getElementById("sum-row");
    var arrayN = array.slice(0,5);
    var total = 0;

    for(var i in arrayN) {
        total += arrayN[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "category");
    canvas.setAttribute("width", "75%");
    canvas.setAttribute("height", "50%");
    canvas.setAttribute("style", "margin-top:10%;");

    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Product defects',
                'Test defects',
                'Outdated tests',
                'Infrastructure problems',
                'Ignored tests'
            ],
            datasets: [{
                data: [arrayN[0], arrayN[1], arrayN[2], arrayN[3], arrayN[4]],
                backgroundColor: [
                    "#800026",
                    "#d31121",
                    "#fa5c2e",
                    "#feab4b",
                    "#fee087"
                ],
                borderWidth: 1,
                borderColor: [
                    "#63001e",
                    "#a30d19",
                    "#cf4b25",
                    "#cc893b",
                    "#d1b86d"
                ]
            }],
            labels: [
                'Product defects',
                'Test defects',
                'Outdated tests',
                'Infrastructure problems',
                'Ignored tests'
            ]
        },
        options: {
            legend: {
                display: false,
                labels: {
                    boxWidth: 15
                },
                position: 'bottom'
            },
            scales:{
                xAxes: [{
                    ticks: {
                        display: true,
                        callback: function(label, index, labels) {
                            if (/\s/.test(label)) {
                              return label.split(" ");
                            }else{
                              return label;
                            }              
                          }
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var title = document.createElement("h2");
    title.setAttribute("style", "margin: 10px;");
    title.appendChild(document.createTextNode("Categories"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px; margin-top: 23px; position:relative; bottom:0;");
    description.appendChild(document.createTextNode("A total of " + total + " tests have been taken into account to make this part of the summary."));

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(canvas);
    div.appendChild(description);

    resultsDiv.appendChild(div);
}

function getLineX(n){
    var line_x = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_x.setAttribute("class", "graph-x-tick-" + n + "-line");
    line_x.setAttribute("stroke", "#000");
    line_x.setAttribute("y2", "2%");

    return line_x;
}

function getTextX(text){
    var text_x = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_x.setAttribute("class", "graph-x-tick-text");
    text_x.setAttribute("fill", "#000");
    text_x.setAttribute("y", "3.3%");
    text_x.setAttribute("dy", "0.71em");
    text_x.appendChild(document.createTextNode(text));

    return text_x;
}

function getRectPlot(n){

    var array = ["5.1%", "22.8%", "40.6%", "58.4%", "76.2%"];

    var rect_plot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_plot.setAttribute("class", "graph-bar");
    rect_plot.setAttribute("x", array[n-1]);

    return rect_plot;
}

function updateRectPlot(rectPlot, p, cond){
    rectPlot.setAttribute("y", String(p) + "%");
    rectPlot.setAttribute("height", String(48-p) + "%");
    rectPlot.setAttribute("width", "16.2%");
    if(cond){
        rectPlot.setAttribute("rx", "5");
        rectPlot.setAttribute("ry", "5");
    }
}

function getGplot(rect1, rect2){
    var g_plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_plot.setAttribute("transform", "translate(0,0)");
    g_plot.appendChild(rect1);
    g_plot.appendChild(rect2);

    return g_plot;
}

function getGX(n, line, text, cond){
    var g_x = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_x.setAttribute("class", "graph-x-tick-" + n);
    g_x.setAttribute("opacity", "1");
    g_x.appendChild(line);
    if(cond){
        g_x.appendChild(text);
    }

    return g_x;
}

function getLineY(){
    var line_y = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_y.setAttribute("stroke", "#000");
    line_y.setAttribute("x2", "-2%");

    return line_y;
}

function getTextY(text){
    var text_y = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text_y.setAttribute("fill", "#000");
    text_y.setAttribute("x", "-3.3%");
    text_y.setAttribute("dy", "0.32em");
    text_y.appendChild(document.createTextNode(text));

    return text_y;
}

function getGY(n, line, text){
    var g_y = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g_y.setAttribute("class", "graph-y-tick-" + n);
    g_y.setAttribute("opacity", "1");
    g_y.appendChild(line);
    g_y.appendChild(text);

    return g_y;
}