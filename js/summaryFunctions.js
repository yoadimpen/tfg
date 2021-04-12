function loadSummaryFromConfig(){

    var divs = document.getElementById("sum-row");
    divs.innerHTML = "";

    var config = String(localStorage.getItem("config"));

    if(config != "null"){
        //se obtiene el objeto JSON de la configuracion
        var config_json = JSON.parse(config);

        if (config_json.links.length == 0) {
            showNoConfigMessageOnGeneral();
        } else {
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
                        request[k].open('GET', directories[k].path);
                        request[k].overrideMimeType("application/json");
                        request[k].send();
                        request[k].onreadystatechange = function() {

                            if(this.readyState === 4) {
                                data = request[k].responseText;

                                //se obtiene el nombre de las carpetas en las cuales hay un informe de Allure
                                var realDataArray = getPathsFromHTTPRequest(data);

                                //se forma la ruta completa = directorio + nombre de la carpeta del informe
                                for(i=0;i<realDataArray.length;i++){
                                    realDataArray[i] = directories[k].path.concat("/".concat(realDataArray[i]));
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
                reportsPath = links[0].path;

                for(z=1;z<links.length;z++){
                    reportsPath = reportsPath.concat(";").concat(links[z].path);
                }
                generateSummaryDivs(reportsPath);
            }
        }
    //en caso de que no haya ninguna configuración añadida
    } else {
        showNoConfigMessageOnGeneral();
    }

    var mode = localStorage.getItem("multiview-mode");

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
    var mode = localStorage.getItem("multiview-mode");

    var page = document.getElementsByClassName("page")[0];
    page.style.transition = "1s";

    setTimeout(function(){
        page.removeAttribute("style");
    }, 1000);

    if(mode === 'light'){
        localStorage.setItem("multiview-mode", "dark");
        mode = localStorage.getItem("multiview-mode");

        fillDark();
    } else if(mode === 'dark') {
        localStorage.setItem("multiview-mode", "light");
        mode = localStorage.getItem("multiview-mode");

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

    var widgetElements = document.getElementsByClassName("widget-mode");
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

    var widgetElements = document.getElementsByClassName("widget-mode");
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

    var status = processResults(localStorage.getItem("statusArray"));
    var severity = processResults(localStorage.getItem("severityArray"));
    var category = processResults(localStorage.getItem("categoryArray"));

    localStorage.removeItem("statusArray");
    localStorage.removeItem("severityArray");
    localStorage.removeItem("categoryArray");

    makeTypeDiv(status);
    makeSeverityDiv(severity);
    makeCategoryDiv(category);

    showTotalReports(pathsArray.length);
}

function processResults(results){
    var array = results.split(",");
    for (i=0;i<array.length;i++){
        array[i] = parseInt(array[i]);
    }
    return array;
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
    localStorage.setItem("statusArray", resultsArray);
    return resultsArray;
}

function makeTypeDiv(array){

    var mode = localStorage.getItem("multiview-mode");

    var resultsDiv = document.getElementById("sum-row");
    resultsDiv.innerHTML = "";

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    canvas.setAttribute("style", "margin-top:20%;");

    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [array[0], array[1], array[2], array[3], array[4]],
                backgroundColor: [
                    "#fd5a3e",
                    "#ffd050",
                    "#aaaaaa",
                    "#97cc64",
                    "#d35ebe"
                ],
                borderColor: "rgba(0, 0, 0, 0.0)"
            }],

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
    title.classList.add("widget-text-mode");
    title.appendChild(document.createTextNode("Status"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);

    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.classList.add("widget-text-mode");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.classList.add("col");
    div.classList.add("widget-mode");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

    if(mode != null) {
        if(mode === 'light'){
            div.classList.add("widget-light");
            title.classList.add("widget-text-light");
            description.classList.add("widget-text-light");
        } else if(mode === 'dark'){
            div.classList.add("widget-dark");
            title.classList.add("widget-text-dark");
            description.classList.add("widget-text-dark");
        }
    } else {
        div.classList.add("widget-light");
        title.classList.add("widget-text-light");
        description.classList.add("widget-text-light");
    }

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

    localStorage.setItem("severityArray", array);

    return array;
}

function makeSeverityDiv(array){

    var mode = localStorage.getItem("multiview-mode");

    var resultsDiv = document.getElementById("sum-row");

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "severity");
    canvas.setAttribute("width", "75%");
    canvas.setAttribute("height", "54%");
    canvas.setAttribute("style", "margin-top:7%;margin-bottom:5%;");

    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: [array[0], array[1], array[2], array[3], array[4]],
                backgroundColor: "#6dd6cd",
                borderWidth: 1,
                borderColor: "#46827d"
            }],
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
    title.classList.add("widget-text-mode");
    title.appendChild(document.createTextNode("Severity"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.classList.add("widget-text-mode");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.classList.add("col");
    div.classList.add("widget-mode");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

    if(mode != null) {
        if(mode === 'light'){
            div.classList.add("widget-light");
            title.classList.add("widget-text-light");
            description.classList.add("widget-text-light");
        } else if(mode === 'dark'){
            div.classList.add("widget-dark");
            title.classList.add("widget-text-dark");
            description.classList.add("widget-text-dark");
        }
    } else {
        div.classList.add("widget-light");
        title.classList.add("widget-text-light");
        description.classList.add("widget-text-light");
    }

    resultsDiv.appendChild(div);
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

    localStorage.setItem("categoryArray", valuesArray);
    return res;
}

function makeCategoryDiv(array){

    var mode = localStorage.getItem("multiview-mode");

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
    canvas.setAttribute("style", "margin-top:7%;");

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
            }]
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
                        display: false
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
    title.classList.add("widget-text-mode");
    title.appendChild(document.createTextNode("Category"));

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col-10");

    var legendDiv = document.createElement("div");
    legendDiv.setAttribute("class", "col-2");
    legendDiv.innerHTML = "<i class='far fa-question-circle widget-text-mode' style='font-size: 1.5rem; margin-top: 1.1rem;' aria-hidden='true';></i>" + 
            "<span class='tooltip-text widget-mode'>" +
                "<b>Help</b>" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#800026;' aria-hidden='true'></i> Product defects" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#d31121;' aria-hidden='true'></i> Test defects" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fa5c2e;' aria-hidden='true'></i> Outdated tests" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#feab4b;' aria-hidden='true'></i> Infrastructure problems" +
                "<br>" +
                "<i class='fas fa-circle' style='color:#fee087;' aria-hidden='true'></i> Ignored tests" +
            "</span>";

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    titleRow.appendChild(legendDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.classList.add("widget-text-mode");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.classList.add("col");
    div.classList.add("widget-mode");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

    if(mode != null) {
        if(mode === 'light'){
            div.classList.add("widget-light");
            title.classList.add("widget-text-light");
            description.classList.add("widget-text-light");
        } else if(mode === 'dark'){
            div.classList.add("widget-dark");
            title.classList.add("widget-text-dark");
            description.classList.add("widget-text-dark");
        }
    } else {
        div.classList.add("widget-light");
        title.classList.add("widget-text-light");
        description.classList.add("widget-text-light");
    }

    resultsDiv.appendChild(div);
}

function showTotalReports(n){

    var mode = localStorage.getItem("multiview-mode");

    var div = document.getElementById("summary-info");

    var h4 = document.createElement("h4");
    h4.setAttribute("id", "total-reports");
    h4.classList.add("widget-text-mode");
    h4.appendChild(document.createTextNode("Total reports used: " + n));

    if(mode != null) {
        if(mode === 'light'){
            h4.classList.add("widget-text-light");
        } else if(mode === 'dark'){
            h4.classList.add("widget-text-dark");
        }
    } else {
        h4.classList.add("widget-text-light");
    }

    div.appendChild(h4);
}

function showNoConfigMessageOnGeneral(){
    var message = document.getElementById("no-data-message");
    message.style.display = "inline";
    message.style.marginTop = "20px";
 
    var dataDiv = document.getElementById("summary-data-div");
    dataDiv.style.display = "none";
 }