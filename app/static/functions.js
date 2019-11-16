//Drag Drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, slot) {
    clearSlot(slot);
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var nodeCopy = document.getElementById(data).cloneNode(true);
    document.getElementById(slot).appendChild(nodeCopy);
    imgIds.push(nodeCopy.id);
    calcAddon();
}

var imgIds = [];
//Calculate Addon
function calcAddon() {
    var ele1 = document.getElementsByName(imgIds[0]+"-stat");
    var ele2 = document.getElementsByName(imgIds[1]+"-stat");
    for (i = 0; i < ele1.length; i++) {

        var elem = ele1[i].parentNode.parentNode;
        var val1 = ele1[i].textContent;

        try { 
            var val2 = ele2[i].textContent;
            var val = '';
            if (val1 == 'None') {
                val = val2;
            }
            else if (val2 == 'None') {
                val = val1;
            }
            else if (val1.slice(-1) == '%' && val2.slice(-1) == '%') {
                val = +val1.slice(0,-1) + +val2.slice(0,-1) + '%';
            }
            else {
                val = val1 + '\n' + val2;
            }
            assignVal(elem, val);
        }
        catch(TypeError) {
            assignVal(elem, val1);
        }
    }
}

function assignVal(elem, val) {
    elem = elem.getElementsByClassName('stats-value')[0];
    elemVal = elem.getAttribute("value");

    if (elemVal.slice(-1) == '%' && val != 'None') {
        elem.textContent = +elemVal.slice(0,-1) + +val.slice(0,-1) + '%';
    }
    else if (val != 'None' && val.slice(-1) == '%') {
        elem.textContent = +elemVal + +elemVal*+val.slice(0,-1)/100;
    }
    else if (val != 'None') {
        elem.textContent = val;
    }
    else {
        elem.textContent = elemVal;
    }
}

//Clearing Slot
function clearSlot(slot) {
    var elems = document.getElementById(slot).children;
    for (i = 0; i < elems.length; i++) {
        if (elems[i].nodeName != "INPUT") {
            imgIds = imgIds.filter(item => item !== elems[i].id);
            elems[i].parentNode.removeChild(elems[i])
            i--;
        }
    }
    
}

//Switch tabs
function openTab(evt, sectionName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(sectionName).style.display = "block";
    evt.currentTarget.className += " active";
}
//Switch subtabs
function openSubTab(evt, sectionName) {
    var i, tabcontent, tablinks;
    subtabcontent = document.getElementsByClassName("subtabcontent");
    for (i = 0; i < subtabcontent.length; i++) {
        subtabcontent[i].style.display = "none";
    }
    subtablinks = document.getElementsByClassName("subtablinks");
    for (i = 0; i < subtablinks.length; i++) {
        subtablinks[i].className = subtablinks[i].className.replace(" active", "");
    }
    elem = document.getElementById(sectionName)
    elem.style.display = "block";
    elem.scrollIntoView(true);
    evt.currentTarget.className += " active";
}

//Pop Image
function dimElem(evt, targetClass) {
    var subtablinks = document.getElementsByClassName(targetClass);
    for (i = 0; i < subtablinks.length; i++) {
        subtablinks[i].className = subtablinks[i].className.replace(" opaque", "").replace(" faded", "");
        subtablinks[i].className += " faded";
    }
    evt.currentTarget.className = evt.currentTarget.className.replace(" faded", "");
    evt.currentTarget.className += " opaque";
}

//Loading
window.onload = function () {
    var ele = document.getElementsByClassName("loading")[0];
    ele.style.display = "none";
}