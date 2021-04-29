function changeMode(){
    var mode = localStorage.getItem("multiview-mode");

    var page = document.getElementsByClassName("page")[0];
    page.style.transition = "0.5s";

    setTimeout(function(){
        page.removeAttribute("style");
    }, 500);

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

    var menu = document.getElementById("menu-little");
    menu.classList.remove("background-div-dark");
    menu.classList.add("background-div-light");

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

    var widgetElements = document.getElementsByClassName("widget-summary");
    Array.prototype.slice.call(widgetElements).forEach(function(el){
        el.classList.remove("widget-dark");
        el.classList.add("widget-light");
    })

    var summaryElements = document.getElementsByClassName("widget-mode");
    Array.prototype.slice.call(summaryElements).forEach(function(el){
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

    var config = document.getElementById("config");
    config.classList.remove("background-div-dark");
    config.classList.add("background-div-light");

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

    var menu = document.getElementById("menu-little");
    menu.classList.remove("background-div-light");
    menu.classList.add("background-div-dark");

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

    var widgetElements = document.getElementsByClassName("widget-summary");
    Array.prototype.slice.call(widgetElements).forEach(function(el){
        el.classList.remove("widget-light");
        el.classList.add("widget-dark");
    })

    var summaryElements = document.getElementsByClassName("widget-mode");
    Array.prototype.slice.call(summaryElements).forEach(function(el){
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

    var config = document.getElementById("config");
    config.classList.remove("background-div-light");
    config.classList.add("background-div-dark");

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