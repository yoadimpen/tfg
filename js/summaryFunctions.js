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
                console.log(directories)
                
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

//---------------------LOADING AUX FUNCTIONS----------------------//

function actualizaTemp(links, cont){
    //reinicia el JSON para la nueva generación
    if(cont === 0){
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

//--------------------SUMMARY CHARTS RESULTS---------------------//

function processResults(results){
    var array = results.split(",");
    for (i=0;i<array.length;i++){
        array[i] = parseInt(array[i]);
    }
    return array;
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

function getSeverityLevelResults(json, dictionary){
    var totalItems = Object.keys(json).length;

    for(i=0;i<totalItems;i++){
        var severity = json[i].severity;

        if(dictionary.hasOwnProperty(severity)){
            dictionary[severity] = dictionary[severity] + 1;
        } else {
            dictionary[severity] = 1;
        }
    }

    localStorage.setItem("severityArray", JSON.stringify(dictionary));
}

function getCategoryResults(json, dictionary){
    var items = json.items;
    var totalItems = json.total;

    for(i=0;i<totalItems;i++){
        var statistic = items[i].statistic;
        var total = statistic.total;
        var name = items[i].name;

        if(dictionary.hasOwnProperty(name)){
            dictionary[name] = dictionary[name] + total;
        } else {
            dictionary[name] = total;
        }
    }

    localStorage.setItem("categoryArray", JSON.stringify(dictionary));
}

//---------------------SUMMARY GENERATION----------------------//

function generateSummaryDivs(reportsPath){
    var pathsArray = reportsPath.split(";");

    //variables de resultados que se van reutilizando
    var statusArray = [0,0,0,0,0];
    var severityDict = {
        "blocker": 0,
        "critical": 0,
        "normal": 0,
        "minor": 0,
        "trivial": 0
    };
    var categoryDict = {};

    pathsArray.forEach(function(path){
        path = path.trim();
        //se procede a leer los JSON summary.json, severity.json y categories.json
        readJSONs(path, statusArray, severityDict, categoryDict, pathsArray.length);
    })

    var status = processResults(localStorage.getItem("statusArray"));
    var severity = JSON.parse(localStorage.getItem("severityArray"));
    var category = JSON.parse(localStorage.getItem("categoryArray"));

    localStorage.removeItem("statusArray");
    localStorage.removeItem("severityArray");
    localStorage.removeItem("categoryArray");

    generateDefaultChartDivs(status, severity, category);

    generateCustomChartDivs();

    showTotalReports(pathsArray.length);
}

//---------------------READ PATHS FILES----------------------//

function readJSONs (path, statusArray, severityDict, categoryDict, nReports){
    //lectura del JSON summary.json
    var data1 = "";
    var jobject1 = "";

    var request1 = new XMLHttpRequest();
    request1.withCredentials = true;
    request1.open('GET', path.concat("/widgets/summary.json"));
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
            var res2 = getSeverityLevelResults(jobject2, severityDict);
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
            var res3 = getCategoryResults(jobject3, categoryDict);
        }
    };

}

//---------------------CHART TEMPLATES----------------------//

function getChart(ctx, chartType, sameColor, dataJSON, legendDisplay){
    var widgetType;

    if(chartType === 'doughnut'){
        widgetType = 'A';
    } else if (sameColor == true) {
        widgetType = 'B';
    } else {
        widgetType = 'C';
    }

    var chartLabels = [];
    var chartDatasets = [];
    var chartOptions;

    switch(widgetType) {
        case 'C':
            dataJSON.items.forEach(function(item){
                var datasetItem = {
                    label: item.label,
                    backgroundColor: item.color,
                    data: [item.value],
                    borderWidth: 1,
                    borderColor:  "rgba(255, 255, 255, 0.5)"
                }
                chartDatasets.push(datasetItem);
            })
            chartLabels.push(dataJSON.name);
            break;
        default:
            var labels = [];
            var data = [];
            var colors = [];
            dataJSON.items.forEach(function(item){
                labels.push(item.label);
                data.push(item.value);
                colors.push(item.color);
            })
            chartLabels = labels;

            chartDatasets = [{
                data: data,
                backgroundColor: colors,
                borderWidth: 1,
                borderColor:  "rgba(255, 255, 255, 0.5)"
            }]
    }

    switch(widgetType) {
        case 'A':
            chartOptions = {
                legend: {
                    display: legendDisplay,
                    labels: {
                        boxWidth: 15,
                        fontColor: '#999'
                    },
                    position: 'bottom'
                }
            }
            break;
        case 'B':
            chartOptions = {
                legend: {
                    display: false
                },
                scales:{
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#999'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: '#999'
                        }
                    }]
                }
            }
            break;
        default:
            chartOptions = {
                legend: {
                    display: legendDisplay,
                    labels: {
                        boxWidth: 15,
                        fontColor: '#999'
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
                            beginAtZero: true,
                            fontColor: '#999'
                        }
                    }]
                }
            }
    }

    var chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartLabels,
            datasets: chartDatasets
        },
        options: chartOptions
    })

    return chart;
}

//---------------------DEFAULT SUMMARY----------------------//

function generateDefaultChartDivs(status, severity, category){

    var dataJSONStatus = {
        name: "Status",
        items: [{
            label: "Failed",
            value: status[0],
            color: "#fd5a3e"
        },{
            label: "Broken",
            value: status[1],
            color: "#ffd050"
        },{
            label: "Skipped",
            value: status[2],
            color: "#aaaaaa"
        },{
            label: "Passed",
            value: status[3],
            color: "#97cc64"
        },{
            label: "Unknown",
            value: status[4],
            color: "#d35ebe"
        }],
        legendDisplay: true,
        sameColor: false,
        type: 'doughnut'
    }

    makeDiv(status, dataJSONStatus, true);

    var dataJSONCategory = {
        name: "Category",
        items: [],
        legendDisplay: true,
        sameColor: false,
        type: 'bar'
    }

    var colors = interpolateColors("rgb(128, 0, 38)", "rgb(254, 224, 135)", Object.keys(category).length);

    for(i=0; i<Object.keys(category).length; i++){
        var color = "rgb(" + colors[i] + ")";
        var item = {
            label: Object.keys(category)[i],
            value: category[Object.keys(category)[i]],
            color: color
        }
        dataJSONCategory.items.push(item);
    }

    makeDiv(category, dataJSONCategory, true);

    var dataJSONSeverity = {
        name: "Severity",
        items: [],
        legendDisplay: false,
        sameColor: true,
        type: 'bar'
    }

    for(i=0; i<Object.keys(severity).length; i++){
        var item = {
            label: Object.keys(severity)[i],
            value: severity[Object.keys(severity)[i]],
            color: "#6dd6cd"
        }
        dataJSONSeverity.items.push(item);
    }

    makeDiv(severity, dataJSONSeverity, true);
}

//---------------------EXTENSIONS----------------------//

//Takes every new summary widget information from JSON in memory
function generateCustomChartDivs(){
    var customCharts = JSON.parse(localStorage.getItem("custom-charts"));
    console.log(customCharts);

    if(customCharts != null) {
        customCharts.graphs.forEach(function(graph){
            makeDiv(null, graph, false);
        })
    }
}

//Generates div for that custom summary widget

function makeDiv(arrayForTotal, json, def){
    var mode = localStorage.getItem("multiview-mode");

    var resultsDiv = document.getElementById("sum-row");

    var total = 0;
    for(var i in arrayForTotal) {
        total += arrayForTotal[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", json.name.toLowerCase());
    canvas.setAttribute("width", "75%");
    canvas.setAttribute("height", "54%");
    canvas.setAttribute("style", "margin-top:7%;margin-bottom:5%;");

    var ctx = canvas.getContext('2d');

    var chart = getChart(ctx, json.type, json.sameColor, json, json.legendDisplay);

    var title = document.createElement("h2");
    title.setAttribute("style", "margin: 10px;");
    title.classList.add("widget-text-mode");
    title.appendChild(document.createTextNode(toTitleCase(json.name)));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);

    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.classList.add("widget-text-mode");

    if(def == false) {
        description.classList.add("custom-graph-remove");
        description.setAttribute("onclick", "deleteCustomChart('" + json.name + "')");
        description.innerHTML = "Remove";
    } else {
        description.innerHTML = "Total used tests: " + total;
    }

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    if(def == false) {
        divdesc.setAttribute("style", "cursor: pointer");
    }
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", json.name.toLowerCase() + "-widget");
    div.classList.add("col");
    div.classList.add("sum-col");
    div.classList.add("widget-mode");
    div.setAttribute("draggable", "true");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragenter', handleDragEnter, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('dragleave', handleDragLeave, false);
    div.addEventListener('drop', handleDrop, false);
    div.addEventListener('dragend', handleDragEnd, false);

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

//---------------------TOTAL SUMMARY REPORTS----------------------//

function showTotalReports(n){

    var mode = localStorage.getItem("multiview-mode");

    var div = document.getElementById("summary-additional");
    div.innerHTML = "";

    var divTotal = document.createElement("div");
    divTotal.setAttribute("class", "col-10");

    var divBtnNew = document.createElement("div");
    divBtnNew.setAttribute("id", "btn-new-graph");
    divBtnNew.classList.add("col-2");
    divBtnNew.classList.add("justify-content-end");

    var divIcon = document.createElement("div");
    divIcon.style.borderRadius = "5px";
    divIcon.style.cursor = "pointer";
    divIcon.classList.add("widget-mode");
    divIcon.setAttribute("onclick", "showNewGraphForm()");

    var icon = document.createElement("i");
    icon.style.margin = "10px";
    icon.classList.add("fas");
    icon.classList.add("fa-plus");
    icon.classList.add("widget-text-mode");

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

    divIcon.appendChild(icon);

    divBtnNew.appendChild(divIcon);

    divTotal.appendChild(h4);

    div.appendChild(divTotal);
    div.appendChild(divBtnNew);
}

 //-------------------EXTENSION IN GUI EXAMPLE--------------------//

 function showNewGraphForm() {
    document.getElementById("new-graph-form").style.display = "inline";
 }

function closeForm() {
    document.getElementById("new-graph-form").style.display = "none";
}

function addNewRow() {

    var mode = localStorage.getItem("multiview-mode");

    var rowsDiv = document.getElementById("new-graph-data");

    var n = rowsDiv.children.length;

    var div = document.createElement("div");
    div.classList.add("row");

    var labelDiv = document.createElement("div");
    labelDiv.classList.add("col-4");
    labelDiv.classList.add("form-property-lv2");

    var innerLabelDiv = document.createElement("div");
    innerLabelDiv.classList.add("input-group");
    innerLabelDiv.classList.add("mb-3");

    var labelSpan = document.createElement("span");
    labelSpan.classList.add("input-group-text");
    labelSpan.classList.add("input-mode");
    labelSpan.setAttribute("id", "basic-addon1");
    labelSpan.appendChild(document.createTextNode("Label"));

    var labelInput = document.createElement("input");
    labelInput.setAttribute("type", "text");
    labelInput.classList.add("form-control");
    labelInput.classList.add("new-graph-labels");
    labelInput.classList.add("input-mode");
    labelInput.setAttribute("placeholder", "labeled tests");
    labelInput.setAttribute("aria-label", "Label");
    labelInput.setAttribute("aria-describedby", "basic-addon1");

    innerLabelDiv.appendChild(labelSpan);
    innerLabelDiv.appendChild(labelInput);

    labelDiv.appendChild(innerLabelDiv);

    var valueDiv = document.createElement("div");
    valueDiv.classList.add("col-4");
    valueDiv.classList.add("form-property-lv2");

    var innerValueDiv = document.createElement("div");
    innerValueDiv.classList.add("input-group");
    innerValueDiv.classList.add("mb-3");

    var valueSpan = document.createElement("span");
    valueSpan.classList.add("input-group-text");
    valueSpan.classList.add("input-mode");
    valueSpan.setAttribute("id", "basic-addon2");
    valueSpan.appendChild(document.createTextNode("Value"));

    var valueInput = document.createElement("input");
    valueInput.setAttribute("type", "text");
    valueInput.classList.add("form-control");
    valueInput.classList.add("new-graph-values");
    valueInput.classList.add("input-mode");
    valueInput.setAttribute("placeholder", "20");
    valueInput.setAttribute("aria-label", "Value");
    valueInput.setAttribute("aria-describedby", "basic-addon2");

    innerValueDiv.appendChild(valueSpan);
    innerValueDiv.appendChild(valueInput);

    valueDiv.appendChild(innerValueDiv);

    var colorDiv = document.createElement("div");
    colorDiv.classList.add("col-3");
    colorDiv.classList.add("form-property-lv2");

    var innerColorDiv = document.createElement("div");
    innerColorDiv.classList.add("input-group");
    innerColorDiv.classList.add("mb-3");

    var colorSpan = document.createElement("span");
    colorSpan.classList.add("input-group-text");
    colorSpan.classList.add("input-mode");
    colorSpan.setAttribute("id", "basic-addon3");
    colorSpan.appendChild(document.createTextNode("Color"));

    var colorInput = document.createElement("input");
    colorInput.setAttribute("type", "text");
    colorInput.classList.add("form-control");
    colorInput.classList.add("new-graph-colors");
    colorInput.classList.add("input-mode");
    colorInput.setAttribute("placeholder", "#b9ebfa");
    colorInput.setAttribute("aria-label", "Color");
    colorInput.setAttribute("aria-describedby", "basic-addon3");

    innerColorDiv.appendChild(colorSpan);
    innerColorDiv.appendChild(colorInput);

    colorDiv.appendChild(innerColorDiv);

    var deleteDiv = document.createElement("div");
    deleteDiv.classList.add("col-1");
    deleteDiv.classList.add("form-property-lv2");

    var deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("id", "remove-row-form");
    deleteIcon.classList.add("fas");
    deleteIcon.classList.add("fa-times");
    deleteIcon.classList.add("fa-lg");
    deleteIcon.classList.add("widget-text-mode");
    deleteIcon.setAttribute("onclick", "deleteFormRow(" + n + ")");

    deleteDiv.appendChild(deleteIcon);

    div.appendChild(labelDiv);
    div.appendChild(valueDiv);
    div.appendChild(colorDiv);
    div.appendChild(deleteDiv);

    rowsDiv.appendChild(div);

    if(mode != null) {
        if(mode === 'dark'){
            labelSpan.classList.add("input-dark");
            labelInput.classList.add("input-dark");
            valueSpan.classList.add("input-dark");
            valueInput.classList.add("input-dark");
            colorSpan.classList.add("input-dark");
            colorInput.classList.add("input-dark");
            deleteIcon.classList.add("widget-text-dark");
        } else if (mode === 'light') {
            labelSpan.classList.add("input-light");
            labelInput.classList.add("input-light");
            valueSpan.classList.add("input-light");
            valueInput.classList.add("input-light");
            colorSpan.classList.add("input-light");
            colorInput.classList.add("input-light");
            deleteIcon.classList.add("widget-text-light");
        }
    } else {
        labelSpan.classList.add("input-light");
        labelInput.classList.add("input-light");
        valueSpan.classList.add("input-light");
        valueInput.classList.add("input-light");
        colorSpan.classList.add("input-light");
        colorInput.classList.add("input-light");
        deleteIcon.classList.add("widget-text-light");
    }
}

function deleteFormRow(n){
    var dataDiv = document.getElementById("new-graph-data");

    var children = dataDiv.children;

    children[n].remove();

    var i = 0;
    Array.prototype.slice.call(children).forEach(function(child){
        child.children[3].children[0].setAttribute("onclick", "deleteFormRow(" + i + ")");
        i = i + 1;
    })
}

function isFree(name){
    var res = true;
    var customCharts = JSON.parse(localStorage.getItem("custom-charts"));

    if(customCharts != null){
        customCharts.graphs.forEach(function(graph){
            res = res && (graph.name.toLowerCase() != name.toLowerCase());
        })
    }

    return res;
}

function validateForm(){
    var name = document.getElementById("new-graph-name").value;
    var nameCondition = true;
    var takenCondition = isFree(name);

    if(name == null || name.trim() === ""){
        document.getElementById("new-graph-val-name").style.display = "inline";
        nameCondition = false;
    } else {
        document.getElementById("new-graph-val-name").style.display = "none";
    }

    if(!takenCondition){
        document.getElementById("new-graph-val-taken").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-taken").style.display = "none";
    }

    var labels = document.getElementsByClassName("new-graph-labels");
    var labelCondition = true;

    Array.prototype.slice.call(labels).forEach(function(label){
        if(labelCondition){
            labelCondition = labelCondition && label.value.trim() != "";
        }
    })

    if(!labelCondition){
        document.getElementById("new-graph-val-label").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-label").style.display = "none";
    }

    var values = document.getElementsByClassName("new-graph-values");
    var valueCondition = true;
    var numericCondition = true;

    Array.prototype.slice.call(values).forEach(function(value){
        if(valueCondition || numericCondition){
            valueCondition = valueCondition && value.value.trim() != "";
            numericCondition = numericCondition && !isNaN(value.value) && value.value.trim() != "";
        }
    })

    if(!valueCondition){
        document.getElementById("new-graph-val-value").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-value").style.display = "none";
    }

    if(!numericCondition){
        document.getElementById("new-graph-val-numeric").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-numeric").style.display = "none";
    }

    var colors = document.getElementsByClassName("new-graph-colors");
    var colorCondition = true;
    var formatCondition = true;
    var formatPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

    Array.prototype.slice.call(colors).forEach(function(color){
        if(colorCondition || formatCondition){
            colorCondition = colorCondition && color.value.trim() != "";
            formatCondition = formatCondition && formatPattern.test(color.value);
        }
    })

    if(!colorCondition){
        document.getElementById("new-graph-val-color").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-color").style.display = "none";
    }

    if(!formatCondition){
        document.getElementById("new-graph-val-format").style.display = "inline";
    } else {
        document.getElementById("new-graph-val-format").style.display = "none";
    }

    if(nameCondition && takenCondition && labelCondition && valueCondition && numericCondition && colorCondition && formatCondition){
        saveNewGraph();
    }
}

function saveNewGraph(){
    var name = document.getElementById("new-graph-name").value;
    var type = document.getElementById("new-graph-type").value;
    var legendDisplay = document.getElementById("new-graph-legend").checked;

    var labels = document.getElementsByClassName("new-graph-labels");
    var values = document.getElementsByClassName("new-graph-values");
    var colors = document.getElementsByClassName("new-graph-colors");

    var sameColor = Array.prototype.slice.call(colors).every( (val, i, arr) => val.value === arr[0].value);

    var i = 0;

    var items = [];

    Array.prototype.slice.call(labels).forEach(function(label){
        var item = {
            label: label.value,
            value: parseInt(values[i].value),
            color: colors[i].value
        }
        items.push(item);

        i = i + 1;
    })

    var dataJSON = {
        name: name,
        type: type,
        items: items,
        legendDisplay: legendDisplay,
        sameColor: sameColor
    }

    document.getElementById("new-graph-form").style.display = "none";
    
    var customCharts = JSON.parse(localStorage.getItem("custom-charts"));

    if(customCharts != null){
        customCharts.graphs.push(dataJSON);
        localStorage.setItem("custom-charts", JSON.stringify(customCharts));
    } else {
        var newCharts = {
            graphs: []
        };

        newCharts.graphs.push(dataJSON);
        localStorage.setItem("custom-charts", JSON.stringify(newCharts));
    }

    var form = document.getElementById("new-graph-data");
    form.innerHTML = "";

    addNewRow();

    document.getElementById("new-graph-name").value = "";
    document.getElementById("new-graph-type").value = "Doughnut";
    document.getElementById("new-graph-legend").checked = false;

    loadSummaryFromConfig();
}

function deleteCustomChart(name) {
    var customCharts = JSON.parse(localStorage.getItem("custom-charts"));

    var i = 0;

    customCharts.graphs.forEach(function(graph){
        if(graph.name === name){
            customCharts.graphs.splice(i, 1);
        }
        i = i + 1;
    })

    localStorage.setItem("custom-charts", JSON.stringify(customCharts));

    loadSummaryFromConfig();
}

//---------------------UI AUX FUNCTIONS----------------------//

function showNoConfigMessageOnGeneral(){
    var message = document.getElementById("no-data-message");
    message.style.display = "inline";
    message.style.marginTop = "20px";
 
    var dataDiv = document.getElementById("summary-data-div");
    dataDiv.style.display = "none";
}

function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

function interpolateColor(color1, color2, factor) {
     if (arguments.length < 3) { 
        factor = 0.5; 
     }
     var result = color1.slice();
     for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        if(i == 0){
            result[i] = result[i] + 15;
        } else if(i == 2) {
            result[i] = result[i] - 50;
        }
    }
     return result;
};
 
function interpolateColors(color1, color2, steps) {
     var stepFactor = 1 / (steps - 1),
         interpolatedColorArray = [];
 
     color1 = color1.match(/\d+/g).map(Number);
     color2 = color2.match(/\d+/g).map(Number);
 
     for(var i = 0; i < steps; i++) {
         interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
     }
 
     return interpolatedColorArray;
}

 //---------------------GRID WIDGETS SWAP----------------------//

var dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';
    
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
    e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }
    
    if (dragSrcEl != this) {
        var sourceID = dragSrcEl.id;
        var targetID = this.id;
        var sourceDiv = document.getElementById(sourceID);
        var targetDiv = document.getElementById(targetID);
        var sourceChildren = sourceDiv.children;
        var targetChildren = targetDiv.children;

        var srcChildren = sourceChildren;
        var trgChildren = targetChildren;

        var div = document.createElement("div");

        Array.prototype.slice.call(srcChildren).forEach(function(child){
            div.appendChild(child);
        });

        sourceDiv.innerHTML = "";

        Array.prototype.slice.call(trgChildren).forEach(function(child){
            sourceDiv.appendChild(child);
        });

        targetDiv.innerHTML = "";

        Array.prototype.slice.call(div.children).forEach(function(child){
            targetDiv.appendChild(child);
        });

        this.classList.remove('over');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}