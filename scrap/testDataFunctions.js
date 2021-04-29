//loading test data will help test other functionalities
function loadTestData(){
    deleteWidgets();

    var paths = ["./testData/summary1.json", "./testData/summary2.json",
                "./testData/summary3.json", "./testData/summary4.json",
                "./testData/summary5.json", "./testData/summary6.json",
                "./testData/summary7.json"];

    paths.forEach(function(path){
        readJSON(path, "#");
    })
}

//in case we want to start fresh on a blank page
function eraseTestData(){
    deleteWidgets();
    document.getElementById("pagesAccess").innerHTML = "";
}