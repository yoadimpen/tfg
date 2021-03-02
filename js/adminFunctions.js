function showCurrentConfig(){

    var config = String(localStorage.getItem("config"));

    if(config != null){

        var config_json = JSON.parse(config);
        var type = config_json.type;

        if(type == "directory"){
            var typeElement = document.getElementById("inlineRadio1");
            typeElement.setAttribute("checked", "true");
        } else {
            var typeElement = document.getElementById("inlineRadio2");
            typeElement.setAttribute("checked", "true");
        }

        var inputs = document.getElementById("inputs");

        var links = config_json.links;
        for(i=0;i<links.length;i++){
            var input = document.createElement("input");
            input.setAttribute("id", "input".concat(i));
            input.setAttribute("type", "text");
            input.setAttribute("class", "form-control");
            input.setAttribute("placeholder", "file:///X:/Path/To/Report");
            input.setAttribute("onkeyup", "addSubstractNewInput(".concat(i).concat(")"));
            input.setAttribute("value", links[i]);
            input.setAttribute("aria-describedby", "basic-addon1");
            input.setAttribute("style", "margin-bottom:1.5%;");

            inputs.appendChild(input);
        }
    } else {
        showEmptyInput();
    }
}

function showEmptyInput(){
    var div = document.getElementById("settings");

    var inputsDiv = document.getElementById("inputs");
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

    for(i=0;i<10;i++){
        var id = "input".concat(i);

        var posInput = document.getElementById(id);

        if(typeof(posInput) != 'undefined' && posInput != null){
            links[i] = posInput.value.trim();
        }
    }

    console.log(links);

    var json_links = '\"links\": [\"' + links[0];

    for(j=1;j<10;j++){
        if(links[j].trim() != ""){
            json_links = json_links.concat('\", \"' + links[j]);
        }
    }

    json_links = json_links.concat('\"]' + ' }');

    var json = '{ ' + '\"type\": ' + '\"' + type + '\", ' + json_links;

    localStorage.setItem("config", json);

    var settingsDiv = document.getElementById("btns-settings");

    var newBtnDiv = document.getElementById("successMsg");

    if(typeof(newBtnDiv) != 'undefined' && newBtnDiv != null){
        newBtnDiv.innerHTML = "";
    } else {
        newBtnDiv = document.createElement("div");
        newBtnDiv.setAttribute("class", "col-4");
        newBtnDiv.setAttribute("id", "successMsg");
        newBtnDiv.setAttribute("style", "margin-top: 3%;");
    }

    var successButton = document.createElement("button");
    successButton.setAttribute("class", "btn btn-success");
    successButton.setAttribute("disabled", "true");
    successButton.setAttribute("type", "button");
    successButton.setAttribute("id", "button-addon2");
    successButton.appendChild(document.createTextNode("Your configuration has been saved successfully!"));

    newBtnDiv.appendChild(successButton);

    settingsDiv.appendChild(newBtnDiv);
}

function deleteSettings(){
    if(localStorage.getItem("config")!=null){
        localStorage.removeItem("config");
    }
    showEmptyInput();

    var settingsDiv = document.getElementById("btns-settings");

    var newBtnDiv = document.getElementById("successMsg");

    if(typeof(newBtnDiv) != 'undefined' && newBtnDiv != null){
        newBtnDiv.innerHTML = "";
    } else {
        newBtnDiv = document.createElement("div");
        newBtnDiv.setAttribute("class", "col-8");
        newBtnDiv.setAttribute("id", "successMsg");
        newBtnDiv.setAttribute("style", "margin-top: 3%;");
    }

    var successButton = document.createElement("button");
    successButton.setAttribute("class", "btn btn-success");
    successButton.setAttribute("disabled", "true");
    successButton.setAttribute("type", "button");
    successButton.setAttribute("id", "button-addon2");
    successButton.appendChild(document.createTextNode("Your configuration has been deleted successfully! You're free to enter some new values."));

    newBtnDiv.appendChild(successButton);

    settingsDiv.appendChild(newBtnDiv);
}

function showCurrentDemoConfig(){
    var config = String(localStorage.getItem("demoConfig"));

    if(config != null){

        var config_json = JSON.parse(config);
        var type = config_json.type;

        if(type == "directory"){
            var typeElement = document.getElementById("inlineRadio1");
            typeElement.setAttribute("checked", "true");
        } else {
            var typeElement = document.getElementById("inlineRadio2");
            typeElement.setAttribute("checked", "true");
        }

        var inputs = document.getElementById("inputs");

        var links = config_json.links;
        for(i=0;i<links.length;i++){
            var input = document.createElement("input");
            input.setAttribute("id", "input".concat(i));
            input.setAttribute("type", "text");
            input.setAttribute("class", "form-control");
            input.setAttribute("placeholder", "file:///X:/Path/To/Report");
            input.setAttribute("onkeyup", "addSubstractNewInput(".concat(i).concat(")"));
            input.setAttribute("value", links[i]);
            input.setAttribute("aria-describedby", "basic-addon1");
            input.setAttribute("style", "margin-bottom:1.5%;");

            inputs.appendChild(input);
        }
    } else {
        showEmptyInput();
    }
}

function saveDemoSettings(){
    var type;
    var links = ["", "", "", "", "", "", "", "", "", ""];

    var typeInput = document.getElementById("inlineRadio1");
    
    if (typeInput.checked) {
        type = "directory";
    } else {
        type = "specific_files";
    }

    for(i=0;i<10;i++){
        var id = "input".concat(i);

        var posInput = document.getElementById(id);

        if(typeof(posInput) != 'undefined' && posInput != null){
            links[i] = posInput.value.trim();
        }
    }

    console.log(links);

    var json_links = '\"links\": [\"' + links[0];

    for(j=1;j<10;j++){
        if(links[j].trim() != ""){
            json_links = json_links.concat('\", \"' + links[j]);
        }
    }

    json_links = json_links.concat('\"]' + ' }');

    var json = '{ ' + '\"type\": ' + '\"' + type + '\", ' + json_links;

    localStorage.setItem("demoConfig", json);

    var settingsDiv = document.getElementById("btns-settings");

    var newBtnDiv = document.getElementById("successMsg");

    if(typeof(newBtnDiv) != 'undefined' && newBtnDiv != null){
        newBtnDiv.innerHTML = "";
    } else {
        newBtnDiv = document.createElement("div");
        newBtnDiv.setAttribute("class", "col-4");
        newBtnDiv.setAttribute("id", "successMsg");
        newBtnDiv.setAttribute("style", "margin-top: 3%;");
    }

    var successButton = document.createElement("button");
    successButton.setAttribute("class", "btn btn-success");
    successButton.setAttribute("disabled", "true");
    successButton.setAttribute("type", "button");
    successButton.setAttribute("id", "button-addon2");
    successButton.appendChild(document.createTextNode("Your configuration has been saved successfully!"));

    newBtnDiv.appendChild(successButton);

    settingsDiv.appendChild(newBtnDiv);
}

function deleteDemoSettings(){
    if(localStorage.getItem("demoConfig")!=null){
        localStorage.removeItem("demoConfig");
    }
    showEmptyInput();

    var settingsDiv = document.getElementById("btns-settings");

    var newBtnDiv = document.getElementById("successMsg");

    if(typeof(newBtnDiv) != 'undefined' && newBtnDiv != null){
        newBtnDiv.innerHTML = "";
    } else {
        newBtnDiv = document.createElement("div");
        newBtnDiv.setAttribute("class", "col-8");
        newBtnDiv.setAttribute("id", "successMsg");
        newBtnDiv.setAttribute("style", "margin-top: 3%;");
    }

    var successButton = document.createElement("button");
    successButton.setAttribute("class", "btn btn-success");
    successButton.setAttribute("disabled", "true");
    successButton.setAttribute("type", "button");
    successButton.setAttribute("id", "button-addon2");
    successButton.appendChild(document.createTextNode("Your configuration has been deleted successfully! You're free to enter some new values."));

    newBtnDiv.appendChild(successButton);

    settingsDiv.appendChild(newBtnDiv);
}