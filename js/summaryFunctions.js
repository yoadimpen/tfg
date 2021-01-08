function generateSummary(){
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
        var pathToSummary = path.concat("/widgets/summary.json");
        readJSONSummary(pathToSummary, resultsArray);
    })

}

function readJSONSummary(pathToSummary, resultsArray){
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

/*function saveResults(results){
    var resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    var typeResults = document.createElement("p");
    typeResults.setAttribute("id", "typeResults");
    typeResults.setAttribute("hidden", "true");
    typeResults.appendChild(document.createTextNode(results));

    resultsDiv.appendChild(typeResults);
}*/

function showEmptyMessage(){
    //find the message div and fill it
}