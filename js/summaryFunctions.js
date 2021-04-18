function loadDemoDataGeneral() {

    var divs = document.getElementById("sum-row");
    divs.innerHTML = "";

    var paths = "./testData/report1;./testData/report2;" +
    "./testData/report3;./testData/report4;" +
    "./testData/report5;./testData/report6;" +
    "./testData/report7";

    generateSummaryDivs(paths);

    var mode = localStorage.getItem("multiview-mode-h");

    if(mode != null) {
        if(mode === 'dark'){
            fillDark();
        } else if (mode === 'light') {
            fillLight();
        }
    }

    if (mode == null){
        localStorage.setItem("multiview-mode-h", "light");
        fillLight();
    }
}

//------------------------DARK/LIGHT MODE--------------------------//

function changeMode(){
    var mode = localStorage.getItem("multiview-mode-h");

    var page = document.getElementsByClassName("page")[0];
    page.style.transition = "1s";

    setTimeout(function(){
        page.removeAttribute("style");
    }, 1000);

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

    var formElements = document.getElementsByClassName("form-mode");
    Array.prototype.slice.call(formElements).forEach(function(el){
        el.classList.remove("form-dark");
        el.classList.add("form-light");
    })

    var radioElements = document.getElementsByClassName("radio-mode");
    Array.prototype.slice.call(radioElements).forEach(function(el){
        el.classList.remove("radio-dark");
        el.classList.add("radio-light");
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

    var formElements = document.getElementsByClassName("form-mode");
    Array.prototype.slice.call(formElements).forEach(function(el){
        el.classList.remove("form-light");
        el.classList.add("form-dark");
    })

    var radioElements = document.getElementsByClassName("radio-mode");
    Array.prototype.slice.call(radioElements).forEach(function(el){
        el.classList.remove("radio-light");
        el.classList.add("radio-dark");
    })
}

//---------------------SUMMARY GENERATION----------------------//

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

    var status = processResults(localStorage.getItem("statusArrayH"));
    var severity = processResults(localStorage.getItem("severityArrayH"));
    var category = processResults(localStorage.getItem("categoryArrayH"));

    localStorage.removeItem("statusArrayH");
    localStorage.removeItem("severityArrayH");
    localStorage.removeItem("categoryArrayH");

    makeTypeDiv(status);
    makeSeverityDiv(severity);
    makeCategoryDiv(category);

    generateCustomChartDivs();

    showTotalReports(pathsArray.length);
}

function generateCustomChartDivs(){
    var customCharts = JSON.parse(localStorage.getItem("custom-charts-h"));

    if(customCharts != null) {
        customCharts.graphs.forEach(function(graph){
            makeCustomDiv(graph);
        })
    }
}

function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

function makeCustomDiv(json){
    var mode = localStorage.getItem("multiview-mode-h");

    var resultsDiv = document.getElementById("sum-row");

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
    description.classList.add("custom-graph-remove");
    description.setAttribute("onclick", "deleteCustomChart('" + json.name + "')");
    description.innerHTML = "Remove";

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.setAttribute("style", "cursor: pointer");
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
    request1.open('GET', path.concat("/summary.json"));
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
    request2.open('GET', path.concat("/severity.json"));
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
    request3.open('GET', path.concat("/categories.json"));
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

//---------------------GRAPH TEMPLATES----------------------//

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
                        boxWidth: 15
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
                            beginAtZero: true
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

//---------------------TYPE SUMMARY WIDGET----------------------//

function getTypeResults(json, resultsArray){
    var statistic = json.statistic;
    resultsArray[0] = resultsArray[0] + statistic.failed;
    resultsArray[1] = resultsArray[1] + statistic.broken;
    resultsArray[2] = resultsArray[2] + statistic.skipped;
    resultsArray[3] = resultsArray[3] + statistic.passed;
    resultsArray[4] = resultsArray[4] + statistic.unknown;
    localStorage.setItem("statusArrayH", resultsArray);
    return resultsArray;
}

function makeTypeDiv(array){

    var mode = localStorage.getItem("multiview-mode-h");

    var resultsDiv = document.getElementById("sum-row");
    resultsDiv.innerHTML = "";

    var total = 0;
    for(var i in array) {
        total += array[i];
    }

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    canvas.setAttribute("width", "75%");
    canvas.setAttribute("height", "54%");
    canvas.setAttribute("style", "margin-top:7%;margin-bottom:5%;");

    var ctx = canvas.getContext('2d');

    var dataJSON = {
        name: "Status",
        items: [{
            label: "Failed",
            value: array[0],
            color: "#fd5a3e"
        },{
            label: "Broken",
            value: array[1],
            color: "#ffd050"
        },{
            label: "Skipped",
            value: array[2],
            color: "#aaaaaa"
        },{
            label: "Passed",
            value: array[3],
            color: "#97cc64"
        },{
            label: "Unknown",
            value: array[4],
            color: "#d35ebe"
        }]
    }

    var chart = getChart(ctx, "doughnut", false, dataJSON, true);

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
    description.innerHTML = "Total used tests: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "type-widget");
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

//---------------------SEVERITY SUMMARY WIDGET----------------------//

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

    localStorage.setItem("severityArrayH", array);

    return array;
}

function makeSeverityDiv(array){

    var mode = localStorage.getItem("multiview-mode-h");

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

    var dataJSON = {
        name: "Severity",
        items: [{
            label: "blocker",
            value: array[0],
            color: "#6dd6cd"
        },{
            label: "critical",
            value: array[1],
            color: "#6dd6cd"
        },{
            label: "normal",
            value: array[2],
            color: "#6dd6cd"
        },{
            label: "minor",
            value: array[3],
            color: "#6dd6cd"
        },{
            label: "trivial",
            value: array[4],
            color: "#6dd6cd"
        }]
    }

    var chart = getChart(ctx, "bar", true, dataJSON, null);

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
    description.innerHTML = "Total used tests: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "severity-widget");
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

//---------------------CATEGORY SUMMARY WIDGET----------------------//

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

    localStorage.setItem("categoryArrayH", valuesArray);
    return res;
}

function makeCategoryDiv(array){

    var mode = localStorage.getItem("multiview-mode-h");

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

    var dataJSON = {
        name: "Category",
        items: [{
            label: "Product defects",
            value: arrayN[0],
            color: "#800026"
        },{
            label: "Test defects",
            value: arrayN[1],
            color: "#d31121"
        },{
            label: "Outdated tests",
            value: arrayN[2],
            color: "#fa5c2e"
        },{
            label: "Infrastructure problems",
            value: arrayN[3],
            color: "#feab4b"
        },{
            label: "Ignored tests",
            value: arrayN[4],
            color: "#fee087"
        }]
    }

    var chart = getChart(ctx, "bar", false, dataJSON, true);

    var title = document.createElement("h2");
    title.setAttribute("style", "margin: 10px;");
    title.classList.add("widget-text-mode");
    title.appendChild(document.createTextNode("Category"));

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.classList.add("widget-text-mode");
    description.innerHTML = "Total used tests: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "category-widget");
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

    var mode = localStorage.getItem("multiview-mode-h");

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

//---------------------UI AUX FUNCTIONS----------------------//

function showNoConfigMessageOnGeneral(){
    var message = document.getElementById("no-data-message");
    message.style.display = "inline";
    message.style.marginTop = "20px";
 
    var dataDiv = document.getElementById("summary-data-div");
    dataDiv.style.display = "none";
 }

 //-------------------NEW GRAPH FUNCTIONS--------------------//

 function showNewGraphForm() {
    document.getElementById("new-graph-form").style.display = "inline";
 }

function closeForm() {
    document.getElementById("new-graph-form").style.display = "none";
}

function addNewRow() {

    var mode = localStorage.getItem("multiview-mode-h");

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
    var customCharts = JSON.parse(localStorage.getItem("custom-charts-h"));

    if(customCharts != null){
        customCharts.graphs.forEach(function(graph){
            res = res && (graph.name != name);
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
    
    var customCharts = JSON.parse(localStorage.getItem("custom-charts-h"));

    if(customCharts != null){
        customCharts.graphs.push(dataJSON);
        localStorage.setItem("custom-charts-h", JSON.stringify(customCharts));
    } else {
        var newCharts = {
            graphs: []
        };

        newCharts.graphs.push(dataJSON);
        localStorage.setItem("custom-charts-h", JSON.stringify(newCharts));
    }

    var form = document.getElementById("new-graph-data");
    form.innerHTML = "";

    addNewRow();

    document.getElementById("new-graph-name").value = "";
    document.getElementById("new-graph-type").value = "Doughnut";
    document.getElementById("new-graph-legend").checked = false;

    loadDemoDataGeneral();
}

function deleteCustomChart(name) {
    var customCharts = JSON.parse(localStorage.getItem("custom-charts-h"));

    var i = 0;

    customCharts.graphs.forEach(function(graph){
        if(graph.name === name){
            customCharts.graphs.splice(i, 1);
        }
        i = i + 1;
    })

    localStorage.setItem("custom-charts-h", JSON.stringify(customCharts));

    loadDemoDataGeneral();
}