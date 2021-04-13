function loadConfig() {

    var mode = localStorage.getItem("multiview-mode");

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
    header1.classList.add("widget-text-mode");
    header1.appendChild(document.createTextNode("#"));

    var header2 = document.createElement("th");
    header2.setAttribute("scope", "col");
    header2.setAttribute("class", "w-75");
    header2.classList.add("widget-text-mode");
    header2.appendChild(document.createTextNode("Path"));

    var header3 = document.createElement("th");
    header3.setAttribute("scope", "col");
    header3.classList.add("widget-text-mode");
    header3.appendChild(document.createTextNode("Last Modified"));

    var header4 = document.createElement("th");
    header4.setAttribute("scope", "col");
    header4.classList.add("widget-text-mode");
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
            td1.classList.add("widget-text-mode");
            td1.appendChild(document.createTextNode(link.id));

            var td2 = document.createElement("td");
            td2.classList.add("widget-text-mode");
            td2.appendChild(document.createTextNode(link.path));

            var td3 = document.createElement("td");
            td3.classList.add("widget-text-mode");
            td3.appendChild(document.createTextNode(link.last_modified));

            var td4 = document.createElement("td");
            var i = document.createElement("i");
            i.setAttribute("class", "fas fa-times");
            i.classList.add("widget-text-mode");
            i.setAttribute("id", "delete-icon");
            i.setAttribute("onclick", "deleteRow(" + link.id + ")");
            td4.appendChild(i);

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tbody.appendChild(row);
        })

        if(mode != null) {
            if(mode === 'dark'){
                if(configJSON.type == "directory"){
                    i1.classList.add("method-dark-active");
                    text1.classList.add("method-dark-active");
                    i2.classList.add("method-dark");
                    text2.classList.add("method-dark");
                    input1.checked = true;
                } else {
                    i2.classList.add("method-dark-active");
                    text2.classList.add("method-dark-active");
                    i1.classList.add("method-dark");
                    text1.classList.add("method-dark");
                    input2.checked = true;
                }
            } else if (mode === 'light') {
                if(configJSON.type == "directory"){
                    i1.classList.add("method-light-active");
                    text1.classList.add("method-light-active");
                    i2.classList.add("method-light");
                    text2.classList.add("method-light");
                    input1.checked = true;
                } else {
                    i2.classList.add("method-light-active");
                    text2.classList.add("method-light-active");
                    i1.classList.add("method-light");
                    text1.classList.add("method-light");
                    input2.checked = true;
                }
            }
        }
    
        if (mode == null){
            if(configJSON.type == "directory"){
                i1.classList.add("method-light-active");
                text1.classList.add("method-light-active");
                i2.classList.add("method-light");
                text2.classList.add("method-light");
                input1.checked = true;
            } else {
                i2.classList.add("method-light-active");
                text2.classList.add("method-light-active");
                i1.classList.add("method-light");
                text1.classList.add("method-light");
                input2.checked = true;
            }
        }

        message.classList.add("message-no");
    } else {
        var row = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.setAttribute("scope", "row");
        td1.classList.add("widget-text-mode");
        td1.appendChild(document.createTextNode("-"));

        var td2 = document.createElement("td");
        td2.classList.add("widget-text-mode");
        td2.appendChild(document.createTextNode("-"));

        var td3 = document.createElement("td");
        td3.classList.add("widget-text-mode");
        td3.appendChild(document.createTextNode("-"));

        var td4 = document.createElement("td");
        td4.classList.add("widget-text-mode");
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

    var radioElements = document.getElementsByClassName("radio-mode");
    Array.prototype.slice.call(radioElements).forEach(function(el){
        el.classList.remove("radio-dark");
        el.classList.add("radio-light");
    })

    var config = document.getElementById("config");
    config.classList.remove("background-div-dark");
    config.classList.add("background-div-light");

    var widgetTextElements = document.getElementsByClassName("widget-text-mode");
    Array.prototype.slice.call(widgetTextElements).forEach(function(el){
        el.classList.remove("widget-text-dark");
        el.classList.add("widget-text-light");
    })

    var methodElements = document.getElementsByClassName("method");
    Array.prototype.slice.call(methodElements).forEach(function(el){
        if(el.classList.contains("method-dark")) {
            el.classList.remove("method-dark");
            el.classList.add("method-light");
        }
        if(el.classList.contains("method-dark-active")) {
            el.classList.remove("method-dark-active");
            el.classList.add("method-light-active");
        }
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

    var radioElements = document.getElementsByClassName("radio-mode");
    Array.prototype.slice.call(radioElements).forEach(function(el){
        el.classList.remove("radio-light");
        el.classList.add("radio-dark");
    })

    var config = document.getElementById("config");
    config.classList.remove("background-div-light");
    config.classList.add("background-div-dark");

    var widgetTextElements = document.getElementsByClassName("widget-text-mode");
    Array.prototype.slice.call(widgetTextElements).forEach(function(el){
        el.classList.remove("widget-text-light");
        el.classList.add("widget-text-dark");
    })

    var methodElements = document.getElementsByClassName("method");
    Array.prototype.slice.call(methodElements).forEach(function(el){
        if(el.classList.contains("method-light")) {
            el.classList.remove("method-light");
            el.classList.add("method-dark");
        }
        if(el.classList.contains("method-light-active")) {
            el.classList.remove("method-light-active");
            el.classList.add("method-dark-active");
        }
    })
}

function turnActive(method){

    var mode = localStorage.getItem("multiview-mode");

    var i1 = document.getElementById("directory-method-icon");
    var text1 = document.getElementById("directory-method-text");

    var i2 = document.getElementById("files-method-icon");
    var text2 = document.getElementById("files-method-text");
    
    if(method == "directory-method"){
        if(mode != null) {
            if(mode === 'dark'){
                i1.classList.remove("method-dark");
                text1.classList.remove("method-dark");
                i1.classList.add("method-dark-active");
                text1.classList.add("method-dark-active");
                i2.classList.remove("method-dark-active");
                text2.classList.remove("method-dark-active");
                i2.classList.add("method-dark");
                text2.classList.add("method-dark");
            } else if (mode === 'light') {
                i1.classList.remove("method-light");
                text1.classList.remove("method-light");
                i1.classList.add("method-light-active");
                text1.classList.add("method-light-active");
                i2.classList.remove("method-light-active");
                text2.classList.remove("method-light-active");
                i2.classList.add("method-light");
                text2.classList.add("method-light");
            }
        }
    
        if (mode == null){
            i1.classList.remove("method-light");
                text1.classList.remove("method-light");
                i1.classList.add("method-light-active");
                text1.classList.add("method-light-active");
                i2.classList.remove("method-light-active");
                text2.classList.remove("method-light-active");
                i2.classList.add("method-light");
                text2.classList.add("method-light");
        }
    } else {
        if(mode != null) {
            if(mode === 'dark'){
                i2.classList.remove("method-dark");
                text2.classList.remove("method-dark");
                i2.classList.add("method-dark-active");
                text2.classList.add("method-dark-active");
                i1.classList.remove("method-dark-active");
                text1.classList.remove("method-dark-active");
                i1.classList.add("method-dark");
                text1.classList.add("method-dark");
            } else if (mode === 'light') {
                i2.classList.remove("method-light");
                text2.classList.remove("method-light");
                i2.classList.add("method-light-active");
                text2.classList.add("method-light-active");
                i1.classList.remove("method-light-active");
                text1.classList.remove("method-light-active");
                i1.classList.add("method-light");
                text1.classList.add("method-light");
            }
        }
    
        if (mode == null){
            i2.classList.remove("method-light");
            text2.classList.remove("method-light");
            i2.classList.add("method-light-active");
            text2.classList.add("method-light-active");
            i1.classList.remove("method-light-active");
            text1.classList.remove("method-light-active");
            i1.classList.add("method-light");
            text1.classList.add("method-light");
        }
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