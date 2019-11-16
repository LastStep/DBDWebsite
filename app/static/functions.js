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
    checkRepeat(ev, nodeCopy.id);
    imgIds.push(nodeCopy.id);
    calcAddon();
}

var imgIds = [];
//Calculate Addon
function calcAddon() {
    var ele1 = document.getElementsByName(imgIds[0] + "-stat");
    // console.log(ele1);
    var ele2 = document.getElementsByName(imgIds[1] + "-stat");
    // console.log(ele2);
    for (i = 0; i < ele1.length; i++) {

        var elem = ele1[i].parentNode.parentNode;
        var val1 = ele1[i].textContent;

        try {
            var val2 = ele2[i].textContent;
            var val = '';
            if (val1 === 'None') {
                val = val2;
            } else if (val2 === 'None') {
                val = val1;
            } else if (val1.slice(-1) === '%' && val2.slice(-1) === '%') {
                val = +val1.slice(0, -1) + +val2.slice(0, -1) + '%';
            } else {
                val = val1 + ', ' + val2;
            }
            assignVal(elem, val);
        } catch (TypeError) {
            assignVal(elem, val1);
        }
    }
}

function assignVal(elem, val) {
    elem = elem.getElementsByClassName('stats-value')[0];
    elemVal = elem.getAttribute("value");

    if (elemVal.slice(-1) === '%' && val !== 'None') {
        elem.textContent = +elemVal.slice(0, -1) + +val.slice(0, -1) + '%';
    } else if (val !== 'None' && val.slice(-1) === '%') {
        elem.textContent = (+elemVal + +elemVal * +val.slice(0, -1) / 100).toFixed(2);
    } else if (val !== 'None') {
        elem.innerHTML = '';
        val = val.split(', ');
        val = Array.from(new Set(val));
        for (var v of val) {
            elem.innerHTML += "</br>" + v + "</br>";
        }
    } else {
        elem.textContent = elemVal;
    }
}

function assignDefaultVal(elem) {
    var ele1 = document.getElementsByName(elem + "-stat");
    for (j = 0; j < ele1.length; j++) {
        parentElem = ele1[j].parentNode.parentNode;
        var val1 = ele1[j].textContent;
        statElem = parentElem.getElementsByClassName('stats-value')[0];
        elemVal = statElem.textContent;
        elemDefVal = statElem.getAttribute("value");

        if (elemVal.slice(-1) === '%' && val1 !== 'None') {
            statElem.textContent = +elemVal.slice(0, -1) + -val1.slice(0, -1) + '%';
        } else if (val1 !== 'None' && val1.slice(-1) === '%') {
            statElem.textContent = (+elemVal + +elemDefVal * -val1.slice(0, -1) / 100).toFixed(2);
        } else if (val1 !== 'None') {
            val1 = val1.split(', ');
            for (var v of val1) {
                statElem.innerHTML = statElem.innerHTML.replace("<br>" + v + "<br>", '');
                if (statElem.innerHTML === "") {
                    statElem.innerHTML = "None";
                }
            }
        } else {
            if (j !== ele1.length - 1) {
                statElem.textContent = elemVal;
            }
        }
    }
}

//Clearing Slot
function clearSlot(slot) {
    var elems = document.getElementById(slot).children;
    for (i = 0; i < elems.length; i++) {
        if (elems[i].nodeName !== "INPUT") {
            assignDefaultVal(elems[i].id);
            imgIds = imgIds.filter(item => item !== elems[i].id);
            elems[i].parentNode.removeChild(elems[i])
            i--;
        }
    }
}

function checkRepeat(ev, addonId) {
    currSlot = ev.currentTarget;

    if (currSlot.id.slice(-1) === '1') {
        otherSlotId = currSlot.id.slice(0, -1) + '2';
    } else if (currSlot.id.slice(-1) === '2') {
        otherSlotId = currSlot.id.slice(0, -1) + '1';
    }

    var otherSlotElems = document.getElementById(otherSlotId).children;

    for (i = 0; i < otherSlotElems.length; i++) {
        if (addonId === otherSlotElems[i].id) {
            clearSlot(otherSlotId);
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