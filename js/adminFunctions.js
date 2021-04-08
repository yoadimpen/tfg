function test(){
    var page = document.getElementsByClassName("page")[0];
    //page.setAttribute("style", "background: black;");

    var dark = document.getElementsByClassName("dark")[0];
    dark.setAttribute("style", "opacity: 1.0;");
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

    if(config != "null"){
        var configJSON = JSON.parse(config);
        var links = configJSON.links;

        links.forEach(function(link){
            var row = document.createElement("tr");

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
            i.setAttribute("id", "delete-icon");
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
        var row = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.setAttribute("scope", "row");
        td1.appendChild(document.createTextNode("-"));

        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode("-"));

        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode("-"));

        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode("-"));

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);

        tbody.appendChild(row);

        message.classList.add("message-no");
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    tableDiv.appendChild(table);

    var div = document.getElementById("config-data");
    div.appendChild(tableDiv);

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

function addNewPath(){
    var path = document.getElementById("config-path-input").value;

    if(path.trim() != ""){
        var today = new Date();

        var date = today.getDate();
        var month = today.getMonth()+1;
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();

        if (date < 10) {
            date = "0"+date;
        }
        if (month < 10) {
            month = "0"+month;
        }
        if (hours < 10) {
            hours = "0"+hours;
        }
        if (minutes < 10) {
            minutes = "0"+minutes;
        }
        if (seconds < 10) {
            seconds = "0"+seconds;
        }

        var time = date + "/" + month + "/" + today.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
        
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
    } else {
        var negMessage = document.getElementById("neg-message");
        negMessage.classList.remove("message-no");
        negMessage.classList.add("message");

        setTimeout(function(){
            negMessage.classList.remove("message");
            negMessage.classList.add("message-no");
        }, 5500);
    }
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