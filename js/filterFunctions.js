//SEARCH (FILTER THROUGH NAMES)
function searchAPIs() {
    var input, filter, ul, li, p, i, txtValue;
    input = document.getElementById('search-input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("widgets");
    li = ul.getElementsByTagName('li');
    
    for (i = 0; i < li.length; i++) {
        p = li[i].querySelectorAll('#name, p')[0];
        txtValue = p.textContent || p.innerText;
        if(txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//ORDER BY
function getCorrectCriteria(arrayOfP, criteria){
    var res = 0;

    arrayOfP.forEach(function(p){
        var p2 = document.createElement("p");
        p2 = p;
        if(p2.getAttribute("id") === criteria){
            res = p2.innerText;
        }
    })

    return parseInt(res);
}

function showOrderedWidgets(){
    var criteria = document.getElementById("order-by-input").value;

    var divs = Array.prototype.slice.call(document.getElementsByClassName("api-summary"));

    function customSorter(a,b){
        var res = 0;
        var childrenA = Array.prototype.slice.call(a.childNodes);
        var childrenB = Array.prototype.slice.call(b.childNodes);
        
        pA = [  Array.prototype.slice.call(childrenA[0].childNodes)[2],
                Array.prototype.slice.call(childrenA[0].childNodes)[3],
                Array.prototype.slice.call(childrenA[0].childNodes)[4],
                Array.prototype.slice.call(childrenA[0].childNodes)[5],
                Array.prototype.slice.call(childrenA[0].childNodes)[6]];
        pB = [  Array.prototype.slice.call(childrenB[0].childNodes)[2],
                Array.prototype.slice.call(childrenB[0].childNodes)[3],
                Array.prototype.slice.call(childrenB[0].childNodes)[4],
                Array.prototype.slice.call(childrenB[0].childNodes)[5],
                Array.prototype.slice.call(childrenB[0].childNodes)[6]];

        specificPA = parseInt(getCorrectCriteria(pA, criteria));
        specificPB = parseInt(getCorrectCriteria(pB, criteria));
        if(specificPA > specificPB){
            res = -1;
        } else if (specificPA < specificPB){
            res = 1;
        }
        return parseInt(res);
    }

    function alphSorter(a,b){
        var res = 0;
        var childrenA = Array.prototype.slice.call(a.childNodes);
        var childrenB = Array.prototype.slice.call(b.childNodes);

        var titleA = Array.prototype.slice.call(Array.prototype.slice.call(childrenA[0].childNodes)[0].childNodes)[0].innerText;
        var titleB = Array.prototype.slice.call(Array.prototype.slice.call(childrenB[0].childNodes)[0].childNodes)[0].innerText;
    
        if(titleA > titleB){
            res = 1;
        } else if(titleA < titleB){
            res = -1;
        }
        return parseInt(res);
    }

    if(criteria == "A-Z"){
        var sortedDivs = Array.prototype.slice.call(divs).sort(alphSorter);
    } else {
        var sortedDivs = Array.prototype.slice.call(divs).sort(customSorter);
    }
    document.getElementById("widgets").innerHTML = "";
    var ul = document.getElementById("widgets");
    sortedDivs.forEach(function(li){
        ul.appendChild(li);
    })

}

//PAGINATION
function doPagination(){
    
    var pages = makePages();
    addPagesAccessToHtml(pages.length);
    goToPage(0);

}

function makePages(){

    var nElement = document.getElementById("page-input").value;

    var n = parseInt(nElement);

    var divs = Array.prototype.slice.call(document.getElementsByClassName("api-summary"));

    var arrayOfPages = [];

    var j = 0;

    for (i = 0; i < divs.length; i=i+n) {
        if(i+n < divs.length){
            arrayOfPages[j] = divs.slice(i, i+n);
            //console.log(arrayOfPages[j]);
        } else {
            arrayOfPages[j] = divs.slice(i, divs.length);
            //console.log(arrayOfPages[j]);
        }
        j = j + 1;
    }

    return arrayOfPages;
}

function addPagesAccessToHtml(nP){
    //var paginationDiv = document.getElementById("paginationDiv");
    var pagesAccess = document.getElementById("pages-access");

    /*if(document.getElementById("pages") == null){
        pagesAccess = document.createElement("div");
        pagesAccess.setAttribute("id", "pages");
    } else {
        pagesAccess = document.getElementById("pages")
        document.getElementById("pages").innerHTML = "";
    }*/

    pagesAccess.innerHTML = "";

    for(i = 0; i < nP; i++){
        var buttonAccessToPage = document.createElement("button");
        buttonAccessToPage.setAttribute("id", "btn-access-page");
        buttonAccessToPage.setAttribute("class", "btn");
        buttonAccessToPage.setAttribute("type", "button");
        buttonAccessToPage.setAttribute("value", i);
        buttonAccessToPage.setAttribute("onclick", "goToPage(" + i + ")");
        buttonAccessToPage.appendChild(document.createTextNode(i+1));

        pagesAccess.appendChild(buttonAccessToPage);
    }

    //paginationDiv.appendChild(pagesAccess);

}

function hideAllDivs(arrayOfDivs){
    arrayOfDivs.forEach(function(div){
        div.style.display = "none";
    })
}

function goToPage(i){
    var divs = Array.prototype.slice.call(document.getElementsByClassName("api-summary"));

    hideAllDivs(divs);

    var pages = makePages();

    var desiredPage = Array.prototype.slice.call(pages[i]);

    desiredPage.forEach(function(divForDisplay){
        divForDisplay.style.display = "";
    })
}