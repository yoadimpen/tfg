function test(){
    var page = document.getElementsByClassName("page")[0];
    //page.setAttribute("style", "background: black;");

    var dark = document.getElementsByClassName("dark")[0];
    dark.setAttribute("style", "opacity: 1.0;");
}

function turnActive(method){
    var i1 = document.getElementById("directory-method-icon");
    var text1 = document.getElementById("directory-method-text");

    var i2 = document.getElementById("files-method-icon");
    var text2 = document.getElementById("files-method-text");
    
    if(method == "directory-method"){
        i1.classList.remove("method");
        text1.classList.remove("method");
        i1.classList.add("method-active");
        text1.classList.add("method-active");
        i2.classList.remove("method-active");
        text2.classList.remove("method-active");
        i2.classList.add("method");
        text2.classList.add("method");
    } else {
        i2.classList.remove("method");
        text2.classList.remove("method");
        i2.classList.add("method-active");
        text2.classList.add("method-active");
        i1.classList.remove("method-active");
        text1.classList.remove("method-active");
        i1.classList.add("method");
        text1.classList.add("method");
    }
}

function deleteRow(n) {
    document.getElementById("config-table").deleteRow(n);

    var config = localStorage.getItem("config");

    if(config != null) {
        var configJSON = JSON.parse(config);
        configJSON.links.splice(n-1, 1);

        var i = 1;

        configJSON.links.forEach(function(element){
            element.id = i;
            i = i + 1;
        })

        localStorage.setItem("config", JSON.stringify(configJSON));
    }

    var dataDiv = document.getElementById("config-data");
    dataDiv.innerHTML = "";

    loadConfig();

    var message = document.getElementById("message");
    message.classList.remove("message-no");
    message.classList.add("message");

    setTimeout(function(){
        message.classList.remove("message");
        message.classList.add("message-no");
    }, 5500);
}

function updatePreference(){
    var config = String(localStorage.getItem("config"));

    console.log(config);

    if(config != null){
        var configJSON = JSON.parse(config);

        var optionInput = document.getElementById("inlineRadio1");
        if(optionInput.checked){
            configJSON.type = "directory";
        } else {
            configJSON.type = "specific_files";
        }
        localStorage.setItem("config", JSON.stringify(configJSON));
    }

    var dataDiv = document.getElementById("config-data");
    dataDiv.innerHTML = "";

    loadConfig();

    var message = document.getElementById("message");
    message.classList.remove("message-no");
    message.classList.add("message");

    setTimeout(function(){
        message.classList.remove("message");
        message.classList.add("message-no");
    }, 5500);
}

function resetConfig() {
    localStorage.removeItem("config");

    var json = '{"type": "directory", "links":[]}';
    configJSON = JSON.parse(json);

    console.log(configJSON);

    localStorage.setItem("config", JSON.stringify(configJSON));

    var dataDiv = document.getElementById("config-data");
    dataDiv.innerHTML = "";

    loadConfig();

    var resetMessage = document.getElementById("reset-message");
    resetMessage.classList.remove("message-no");
    resetMessage.classList.add("message");

    setTimeout(function(){
        resetMessage.classList.remove("message");
        resetMessage.classList.add("message-no");
    }, 5500);
}

function loadConfig() {

    var i1 = document.getElementById("directory-method-icon");
    var text1 = document.getElementById("directory-method-text");
    var input1 = document.getElementById("inlineRadio1");

    var i2 = document.getElementById("files-method-icon");
    var text2 = document.getElementById("files-method-text");
    var input2 = document.getElementById("inlineRadio2");

    var message = document.getElementById("message");

    message.classList.remove("message");
    message.classList.remove("message-no");

    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("class", "table-responsive-xxl");

    var table = document.createElement("table");
    table.setAttribute("id", "config-table");
    table.setAttribute("class", "table");

    var thead = document.createElement("thead");

    var headerRow = document.createElement("tr");
    
    var header1 = document.createElement("th");
    header1.setAttribute("scope", "col");
    header1.appendChild(document.createTextNode("#"));

    var header2 = document.createElement("th");
    header2.setAttribute("scope", "col");
    header2.setAttribute("class", "w-75");
    header2.appendChild(document.createTextNode("Path"));

    var header3 = document.createElement("th");
    header3.setAttribute("scope", "col");
    header3.appendChild(document.createTextNode("Last Modified"));

    var header4 = document.createElement("th");
    header4.setAttribute("scope", "col");
    header4.appendChild(document.createTextNode(""));

    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    headerRow.appendChild(header4);

    thead.appendChild(headerRow);

    var tbody = document.createElement("tbody");

    var config = String(localStorage.getItem("config"));

    if(config != null){
        var configJSON = JSON.parse(config);
        var links = configJSON.links;

        links.forEach(function(link){
            var row = document.createElement("tr");
            var id = "-";
            var path = link;
            var last_modified = "-";

            var td1 = document.createElement("td");
            td1.setAttribute("scope", "row");
            td1.appendChild(document.createTextNode(link.id));

            var td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(link.path));

            var td3 = document.createElement("td");
            td3.appendChild(document.createTextNode(link.last_modified));

            var td4 = document.createElement("td");
            var i = document.createElement("i");
            i.setAttribute("class", "fas fa-times");
            i.setAttribute("onclick", "deleteRow(" + link.id + ")");
            td4.appendChild(i);

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tbody.appendChild(row);
        })

        if(configJSON.type == "directory"){
            i1.classList.add("method-active");
            text1.classList.add("method-active");
            input1.checked = true;
            i2.classList.add("method");
            text2.classList.add("method");
            input2.checked = false;
        } else {
            i2.classList.add("method-active");
            text2.classList.add("method-active");
            input2.checked = true;
            i1.classList.add("method");
            text1.classList.add("method");
            input1.checked = false;
        }
        message.classList.add("message-no");
    } else {
        //cosas
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    tableDiv.appendChild(table);

    var div = document.getElementById("config-data");
    div.appendChild(tableDiv);

}

function addNewPath(){
    var path = document.getElementById("config-path-input").value;
    var today = new Date();
    var time = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var config = localStorage.getItem("config");

    if(config != null){
        var configJSON = JSON.parse(config);
        configJSON.links.push({"id":configJSON.links.length + 1, "path":path, "last_modified":time});
        console.log(configJSON);
        localStorage.setItem("config", JSON.stringify(configJSON));
    }

    var dataDiv = document.getElementById("config-data");
    dataDiv.innerHTML = "";

    loadConfig();

    var message = document.getElementById("message");
    message.classList.remove("message-no");
    message.classList.add("message");

    setTimeout(function(){
        message.classList.remove("message");
        message.classList.add("message-no");
    }, 5500);
}

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