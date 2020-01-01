//Drag Drop
function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, slot, temp) {
	clearSlot(slot, temp);
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var nodeCopy = document.getElementById(data).cloneNode(true);
	document.getElementById(slot).appendChild(nodeCopy);
	checkRepeat(ev, nodeCopy.id);
	if (temp) {
		imgTempIds.push(nodeCopy.id);
	} else {
		imgIds.push(nodeCopy.id);
	}
	calcAddon(temp);
}

var imgIds = [];
var imgTempIds = [];
var prevKiller = '';
//Calculate Addon
function calcAddon(temp) {
	if (temp) {
		var ele1 = document.getElementsByName(imgTempIds[0] + "-stat-temp");
		var ele2 = document.getElementsByName(imgTempIds[1] + "-stat-temp");
	} else {
		var ele1 = document.getElementsByName(imgIds[0] + "-stat");
		var ele2 = document.getElementsByName(imgIds[1] + "-stat");
	}
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
			} else if (isNaN(parseFloat(val1)) === false && isNaN(parseFloat(val2)) === false) {
				val = val1 + val2;
			} else {
				val = val1 + '.' + val2;
			}
			assignVal(elem, val, temp);
		} catch (TypeError) {
			assignVal(elem, val1, temp);
		}
	}
}

function assignVal(elem, val, temp) {
	if (temp) {
		elem = elem.getElementsByClassName('stats-value-temp')[0];
	} else {
		elem = elem.getElementsByClassName('stats-value')[0];
	}
	elemVal = elem.getAttribute("value");
	staticVal = elem.parentNode.parentNode.getElementsByClassName('stats-addons')[1].textContent;

	if (elemVal.slice(-1) === '%' && val !== 'None') {
		elem.textContent = +elemVal.slice(0, -1) + +val.slice(0, -1) + '%';
		if (staticVal !== 'None') {
			elem.textContent = +elem.textContent.slice(0, -1) + +staticVal.slice(0, -1) + '%';
			elemVal = +elemVal.slice(0, -1) + +staticVal.slice(0, -1) + '%';
		}
		assignColor(elem, +elem.textContent.slice(0, -1), +elemVal.slice(0, -1));
	} else if (val !== 'None' && val.slice(-1) === '%') {
		elem.textContent = Number((Math.round((+elemVal + +elemVal * +val.slice(0, -1) / 100) * 200) / 200).toPrecision(2));
		if (staticVal !== 'None') {
			elem.textContent = +elem.textContent + +staticVal;
			elemVal = +elemVal + +staticVal;
		}
		assignColor(elem, +elem.textContent, +elemVal);
	} else if (isNaN(parseFloat(elemVal)) === false && isNaN(parseFloat(val)) === false) {
		elem.textContent = +elemVal + +val;
		assignColor(elem, +elem.textContent, elemVal);
	} else if (val !== 'None') {
		elem.innerHTML = '';
		val = val.split('.');
		val = Array.from(new Set(val));
		for (var v of val) {
			elem.innerHTML += v + "</br>";
		}
	} else {
		if (staticVal !== 'None') {
			elemVal = +elemVal + +staticVal;
		}
		elem.textContent = elemVal;
	}
}

function assignColor(elem, newVal, prevVal) {
	// console.log(newVal, prevVal);
	// console.log(elem);
	if (newVal > prevVal) {
		elem.style.color = 'green';
	} else if (newVal < prevVal) {
		elem.style.color = 'red';
	} else {
		elem.style.color = 'white';
	}
}

function assignDefaultVal(elem, temp) {
	if (temp) {
		var ele1 = document.getElementsByName(elem + "-stat-temp");
	} else {
		var ele1 = document.getElementsByName(elem + "-stat");
	}
	for (j = 0; j < ele1.length; j++) {
		parentElem = ele1[j].parentNode.parentNode;
		var val1 = ele1[j].textContent;
		if (temp) {
			statElem = parentElem.getElementsByClassName('stats-value-temp')[0];
		} else {
			statElem = parentElem.getElementsByClassName('stats-value')[0];
		}
		elemVal = statElem.textContent;
		elemDefVal = statElem.getAttribute("value");
		staticVal = statElem.parentNode.parentNode.getElementsByClassName('stats-addons')[1].textContent;

		if (elemVal.slice(-1) === '%' && val1 !== 'None') {
			statElem.textContent = +elemVal.slice(0, -1) + -val1.slice(0, -1) + '%';
			if (staticVal !== 'None') {
				elemDefVal = +elemDefVal.slice(0, -1) + +staticVal;
			}
			assignColor(statElem, +statElem.textContent.slice(0, -1), elemDefVal.slice(0, -1));
		} else if (val1 !== 'None' && val1.slice(-1) === '%') {
			statElem.textContent = Number((Math.round((+elemVal + +elemDefVal * -val1.slice(0, -1) / 100) * 200) / 200).toPrecision(2));
			if (staticVal !== 'None') {
				elemDefVal = +elemDefVal + +staticVal;
			}
			assignColor(statElem, +statElem.textContent, elemDefVal);
		} else if (isNaN(parseFloat(elemVal)) === false && isNaN(parseFloat(val1)) === false) {
			statElem.textContent = +elemVal + -val1;
			if (staticVal !== 'None') {
				elemDefVal = +elemDefVal + +staticVal;
			}
			assignColor(statElem, +statElem.textContent, elemDefVal);
		} else if (val1 !== 'None') {
			val1 = val1.split('.');
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
function clearSlot(slot, temp) {
	var elems = document.getElementById(slot).children;
	for (i = 0; i < elems.length; i++) {
		if (elems[i].nodeName !== "INPUT") {
			assignDefaultVal(elems[i].id, temp);
			if (temp) {
				imgTempIds = imgTempIds.filter(item => item !== elems[i].id);
			} else {
				imgIds = imgIds.filter(item => item !== elems[i].id);
			}
			elems[i].parentNode.removeChild(elems[i])
			i--;
		}
	}
}

function clearSlots(name) {
	var elems = document.getElementsByClassName("clear-img");
	for (var ele of elems) {
		ele.click();
	}
	try {
		var ele = document.getElementById(prevKiller + "-move");
		if (ele.classList.contains('active')) {
			ele.click();
		}
	} catch (TypeError) {}
	prevKiller = name;
}

//Move SLot
function moveSlot(slotName) {
	var elems = document.getElementsByClassName("tempSlot");
	for (i = 0; i < elems.length; i++) {
		if (elems[i].id.includes(slotName)) {
			elems[i].classList.toggle('fade');
		}
	}
	var tempElems = document.getElementsByClassName("stats-temp");
	for (i = 0; i < tempElems.length; i++) {
		if (tempElems[i].id.includes(slotName)) {
			tempElems[i].classList.toggle('hidden');
		}
	}
	var ele = document.getElementById(slotName + "-move");
	ele.classList.toggle('active');
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


function calcVal(ele, val1, val2) {
	var val;
	if (val2 === "None") {
		val = val1;
	} else if (val1.slice(-1) === "%") {
		val = +val1.slice(0, -1) + +val2.slice(0, -1) + "%";
	} else {
		val = val1 + "+" + val2;
		val = eval(val);
	}
	ele.setAttribute("value", val1);
	ele.textContent = val;
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
	// elem.scrollIntoView(true);
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
	var elems = this.document.getElementsByClassName("stats-value");
	for (var elem of elems) {
		elem.click();
	}
	var elems = this.document.getElementsByClassName("stats-value-temp");
	for (var elem of elems) {
		elem.click();
	}
}
