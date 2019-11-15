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
}

//Clearing Slot
function clearSlot(slot) {
    var elems = document.getElementById(slot).children;
    for (i = 0; i < elems.length; i++) {
        if (elems[i].nodeName != "INPUT") {
            elems[i].parentNode.removeChild(elems[i]);
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
    ele.remove();
}