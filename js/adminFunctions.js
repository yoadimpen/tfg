function showEmptyInput(){
    var div = document.getElementById("settings");

    var inputsDiv = document.getElementById("inputs");
    //inputsDiv.setAttribute("class", "col-4");
    inputsDiv.innerHTML = "";

    var firstInput = document.createElement("input");
    firstInput.setAttribute("id", "input0");
    firstInput.setAttribute("type", "text");
    firstInput.setAttribute("class", "form-control");
    firstInput.setAttribute("placeholder", "file:///X:/Path/To/Report");
    firstInput.setAttribute("onkeyup", "addSubstractNewInput(0)");
    firstInput.setAttribute("aria-label", "New Path");
    firstInput.setAttribute("aria-describedby", "basic-addon1");
    firstInput.setAttribute("style", "margin-bottom:1.5%;");

    inputsDiv.appendChild(firstInput);

    div.appendChild(inputsDiv);
}

function addSubstractNewInput(n){

    console.log(localStorage.getItem("config"));

    if(n<9){
        var currentId = "input".concat(n);
        var currentInput = document.getElementById(currentId);

        if(currentInput.value.trim() == ""){
            var id = "input".concat(n+1);
            var posInput = document.getElementById(id);

            var id2 = "input".concat(n+2);
            var posInput2 = document.getElementById(id2);

            if((typeof(posInput) != 'undefined' || posInput != null) && ((typeof(posInput2) === 'undefined' || posInput2 === null)) || posInput2.value != "" || posInput2.style.display == "none"){
                posInput.style.display = "none";
            }
        } else {

            var id = "input".concat(n+1);

            var posInput = document.getElementById(id);

            if(typeof(posInput) === 'undefined' || posInput === null){
                console.log("entra");
                var newInput = document.createElement("input");
                newInput.setAttribute("id", id);
                newInput.setAttribute("type", "text");
                newInput.setAttribute("class", "form-control");
                newInput.setAttribute("placeholder", "file:///X:/Path/To/Report");
                newInput.setAttribute("onkeyup", "addSubstractNewInput(" + parseInt(n+1) + ")");
                newInput.setAttribute("aria-label", "New Path");
                newInput.setAttribute("aria-describedby", "basic-addon1");
                newInput.setAttribute("style", "margin-bottom:1.5%;");

                var inputsDiv = document.getElementById("inputs");
                inputsDiv.appendChild(newInput);
            } else {
                posInput.style.display = "";
            }
        }
    }
}

function saveSettings(){

    var type;
    var links = ["", "", "", "", "", "", "", "", "", ""];

    var typeInput = document.getElementById("inlineRadio1");
    
    if (typeInput.checked) {
        type = "directory";
    } else {
        type = "specific_files";
    }

    console.log(type);

    for(i=0;i<10;i++){
        var id = "input".concat(i);

        var posInput = document.getElementById(id);

        if(typeof(posInput) != 'undefined' && posInput != null){
            links[i] = posInput.value.trim();
        }
    }

    var json_links = "'links':['" + links[0];

    for(j=1;j<10;j++){
        if(links[j].trim() != ""){
            json_links = json_links.concat("','" + links[j]);
        }
    }

    json_links = json_links.concat("']" + "}");

    var json = "{" + "'type':" + "'" + type + "'," + json_links;

    var config_json = JSON.stringify(json);

    localStorage.setItem("config", config_json);
}