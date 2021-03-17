function loadTestDataSummary(){
    var divs = document.getElementById("sum-row");
    divs.innerHTML = "";

    var paths = "./testData/report1;./testData/report2;" +
    "./testData/report3;./testData/report4;" +
    "./testData/report5;./testData/report6;" +
    "./testData/report7";

    generateSummaryDivs(paths);
    
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

    showTotalReports(pathsArray.length);
}

function readJSONs (path, statusArray, severityArray, categoryArray, categoryNameArray, nReports){
    var data1 = "";
    var jobject1 = "";

    var request1 = new XMLHttpRequest();
    request1.withCredentials = true;
    pathSummary = path.concat("/summary.json");
    request1.open('GET', pathSummary);
    console.log(pathSummary);
    request1.overrideMimeType("application/json");
    request1.send();
    request1.onreadystatechange = function() {
        if(this.readyState === 4) {
            data1 = request1.responseText;
            jobject1 = JSON.parse(data1);
            var res1 = getTypeResults(jobject1, statusArray);
        }
        makeTypeDiv(res1);
    };

    var data2 = "";
    var jobject2 = "";
    
    var request2 = new XMLHttpRequest();
    request2.withCredentials = true;
    pathSeverity = path.concat("/severity.json");
    request2.open('GET', pathSeverity);
    console.log(pathSeverity);
    request2.overrideMimeType("application/json");
    request2.send();
    request2.onreadystatechange = function() {
        if(this.readyState === 4) {
            data2 = request2.responseText;
            jobject2 = JSON.parse(data2);
            var res2 = getSeverityLevelResults(jobject2, severityArray);
            makeSeverityDiv(res2);
        }
    };

    var data3 = "";
    var jobject3 = "";

    var request3 = new XMLHttpRequest();
    request3.withCredentials = true;
    pathCategories = path.concat("/categories.json");
    request3.open('GET', pathCategories);
    console.log(pathCategories);
    request3.overrideMimeType("application/json");
    request3.send();
    request3.onreadystatechange = function() {
        if(this.readyState === 4) {
            data3 = request3.responseText;
            jobject3 = JSON.parse(data3);
            var res3 = getCategoryResults(jobject3, categoryArray, categoryNameArray);
            makeCategoryDiv(res3);
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

function makeTypeDiv(array){
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
                ]
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
    title.appendChild(document.createTextNode("Status"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);

    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

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

function makeSeverityDiv(array){

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
    title.appendChild(document.createTextNode("Severity"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);

    resultsDiv.appendChild(div);
}

function getCategoryResults(json, valuesArray, nameArray){
    var items = json.items;
    var totalItems = json.total;

    for(i=0;i<totalItems;i++){
        var statistic = items[i].statistic;
        var total = statistic.total;
        var name = items[i].name;
        valuesArray[i] = + valuesArray[i] + total;
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

function makeCategoryDiv(array){

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
    title.appendChild(document.createTextNode("Category"));

    var titleRow = document.createElement("div");
    titleRow.setAttribute("class", "row");

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "col");

    titleDiv.appendChild(title);

    titleRow.appendChild(titleDiv);
    
    var description = document.createElement("p");
    description.setAttribute("style", "margin-left:10px;");
    description.innerHTML = "Total of tests used: " + total;

    var divdesc = document.createElement("div");
    divdesc.setAttribute("id", "description");
    divdesc.appendChild(description);

    var legend = document.createElement("div");
    legend.setAttribute("style", "font-size:12px; color:#6c757d; margin:10px;");
    legend.innerHTML = "<i class='fas fa-square-full' style='color:#800026'></i> Product defects  </br>" + 
                    "<i class='fas fa-square-full' style='color:#d31121'></i> Test defects  </br>" + 
                    "<i class='fas fa-square-full' style='color:#fa5c2e'></i> Outdated tests  </br>" + 
                    "<i class='fas fa-square-full' style='color:#feab4b'></i> Infrastructure problems  </br>" + 
                    "<i class='fas fa-square-full' style='color:#fee087'></i> Ignored tests  ";

    var div = document.createElement("div");
    div.setAttribute("id", "sum-col");
    div.setAttribute("class", "col");
    div.appendChild(titleRow);
    div.appendChild(divdesc);
    div.appendChild(canvas);
    div.appendChild(legend);

    resultsDiv.appendChild(div);
}

function showTotalReports(n){
    var div = document.getElementById("summary-info");

    var h4 = document.createElement("h4");
    h4.setAttribute("style", "margin-top:1%");
    h4.appendChild(document.createTextNode("Total reports used: " + n));

    div.appendChild(h4);
}