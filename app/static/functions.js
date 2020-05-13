//Drag Drop
function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function dropAddon(ev, slot, temp) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var nodeCopy = document.getElementById(data).cloneNode(true);
	if (nodeCopy.className.startsWith("addon")) {
		clearSlot(slot, temp);
		document.getElementById(slot).appendChild(nodeCopy);
		checkRepeat(ev, nodeCopy.id);
		if (temp) {
			addonTempIds.push(nodeCopy.id);
		} else {
			addonIds.push(nodeCopy.id);
		}
		calcAddon(temp, "addon");
	}
}

function dropItem(ev, slot, temp) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var nodeCopy = document.getElementById(data).cloneNode(true);
	if (nodeCopy.className.startsWith("item")) {
		clearSlot(slot, temp);
		document.getElementById(slot).appendChild(nodeCopy);
		if (temp) {
			itemTempIds.push(nodeCopy.id);
		} else {
			itemIds.push(nodeCopy.id);
		}
		calcAddon(temp, "item");
	}
}

var [addonIds, addonTempIds, itemIds, itemTempIds] = [[], [], [], []];
var prevKiller = "";
var activeItemSubTab = "";
var valItems = [];

//Calculate Addon
function calcAddon(temp, type) {
	if (type === "addon") {
		if (temp) {
			var ele1 = document.getElementsByName(addonTempIds[0] + "-stat-temp");
			var ele2 = document.getElementsByName(addonTempIds[1] + "-stat-temp");
		} else {
			var ele1 = document.getElementsByName(addonIds[0] + "-stat");
			var ele2 = document.getElementsByName(addonIds[1] + "-stat");
		}
	} else {
		if (temp) {
			var ele1 = document.getElementsByName(itemTempIds[0] + "-stat-temp");
		} else {
			var ele1 = document.getElementsByName(itemIds[0] + "-stat");
		}
	}
	for (i = 0; i < ele1.length; i++) {
		var elem = ele1[i].parentNode.parentNode;
		var val1 = ele1[i].textContent;
		if (val1 === "default") {
			continue;
		}
		try {
			var val2 = ele2[i].textContent;
			var val = "";
			if (val1 === "None") {
				val = val2;
			} else if (val2 === "None") {
				val = val1;
			} else if (val1.slice(-1) === "%" && val2.slice(-1) === "%") {
				val = +val1.slice(0, -1) + +val2.slice(0, -1) + "%";
			} else if (
				isNaN(parseFloat(val1)) === false &&
				isNaN(parseFloat(val2)) === false
			) {
				val = val1 + val2;
			} else {
				val = val1 + "." + val2;
			}
			assignVal(elem, val, temp);
		} catch (TypeError) {
			assignVal(elem, val1, temp);
			if (type === "item") {
				valItems.push(val1);
			}
		}
	}
	if (type === "item") {
		assignItems(temp);
		valItems = [];
	}
}

function assignVal(elem, val, temp) {
	if (temp) {
		elem = elem.getElementsByClassName("stats-value-temp")[0];
	} else {
		elem = elem.getElementsByClassName("stats-value")[0];
	}
	elemVal = elem.getAttribute("value");
	staticVal = elem.parentNode.parentNode.getElementsByClassName(
		"stats-addons"
	)[1].textContent;

	if (elemVal.slice(-1) === "%" && val !== "None") {
		elem.textContent = +elemVal.slice(0, -1) + +val.slice(0, -1) + "%";
		if (staticVal !== "None" && staticVal !== "speed") {
			elem.textContent =
				+elem.textContent.slice(0, -1) + +staticVal.slice(0, -1) + "%";
			elemVal = +elemVal.slice(0, -1) + +staticVal.slice(0, -1) + "%";
		}
		assignColor(elem, +elem.textContent.slice(0, -1), +elemVal.slice(0, -1));
	} else if (val !== "None" && val.slice(-1) === "%") {
		elem.textContent = getPreciseValue(
			+elemVal + (+elemVal * +val.slice(0, -1)) / 100
		);
		if (staticVal !== "None" && staticVal !== "speed") {
			elem.textContent = +elem.textContent + +staticVal;
			elemVal = +elemVal + +staticVal;
		}
		assignColor(elem, +elem.textContent, +elemVal);
		if (staticVal === "speed") {
			elem.setAttribute("hiddenval", elem.textContent);
			elem.textContent = getSpeedPercent(+elem.textContent);
		}
	} else if (
		isNaN(parseFloat(elemVal)) === false &&
		isNaN(parseFloat(val)) === false
	) {
		elem.textContent = +elemVal + +val;
		assignColor(elem, +elem.textContent, elemVal);
	} else if (val !== "None") {
		elem.innerHTML = "";
		val = val.split(".");
		val = Array.from(new Set(val));
		for (var v of val) {
			elem.innerHTML += v + "</br>";
		}
	} else {
		if (staticVal !== "None") {
			elemVal = +elemVal + +staticVal;
		}
		elem.textContent = elemVal;
	}
}

function assignColor(elem, newVal, prevVal) {
	if (newVal > prevVal) {
		elem.style.color = "green";
	} else if (newVal < prevVal) {
		elem.style.color = "red";
	} else {
		elem.style.color = "white";
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
			statElem = parentElem.getElementsByClassName("stats-value-temp")[0];
		} else {
			statElem = parentElem.getElementsByClassName("stats-value")[0];
		}
		elemVal = statElem.textContent;
		elemDefVal = statElem.getAttribute("value");
		staticVal = statElem.parentNode.parentNode.getElementsByClassName(
			"stats-addons"
		)[1].textContent;
		if (staticVal === "speed") {
			elemVal = statElem.getAttribute("hiddenval");
		}

		if (val1 === "default") {
			statElem.textContent = elemDefVal;
			assignColor(statElem, elemDefVal, elemDefVal);
		} else if (elemVal.slice(-1) === "%" && val1 !== "None") {
			statElem.textContent = +elemVal.slice(0, -1) + -val1.slice(0, -1) + "%";
			if (staticVal !== "None" && staticVal !== "speed") {
				elemDefVal = +elemDefVal.slice(0, -1) + +staticVal;
			}
			assignColor(
				statElem,
				+statElem.textContent.slice(0, -1),
				elemDefVal.slice(0, -1)
			);
		} else if (val1 !== "None" && val1.slice(-1) === "%") {
			statElem.textContent = getPreciseValue(
				+elemVal + (+elemDefVal * -val1.slice(0, -1)) / 100
			);
			if (staticVal !== "None" && staticVal !== "speed") {
				elemDefVal = +elemDefVal + +staticVal;
			}
			assignColor(statElem, +statElem.textContent, elemDefVal);
			if (staticVal === "speed") {
				statElem.setAttribute("hiddenval", statElem.textContent);
				statElem.textContent = getSpeedPercent(+statElem.textContent);
			}
		} else if (
			isNaN(parseFloat(elemVal)) === false &&
			isNaN(parseFloat(val1)) === false
		) {
			statElem.textContent = +elemVal + -val1;
			if (staticVal !== "None" && staticVal !== "speed") {
				elemDefVal = +elemDefVal + +staticVal;
			}
			assignColor(statElem, +statElem.textContent, elemDefVal);
		} else if (val1 !== "None") {
			val1 = val1.split(".");
			for (var v of val1) {
				statElem.innerHTML = statElem.innerHTML.replace(
					"<br>" + v + "<br>",
					""
				);
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
				addonTempIds = addonTempIds.filter((item) => item !== elems[i].id);
				itemTempIds = itemTempIds.filter((item) => item !== elems[i].id);
			} else {
				addonIds = addonIds.filter((item) => item !== elems[i].id);
				itemIds = itemIds.filter((item) => item !== elems[i].id);
			}
			elems[i].parentNode.removeChild(elems[i]);
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
		if (ele.classList.contains("active")) {
			ele.click();
		}
	} catch (TypeError) {}
	prevKiller = name;
}

//Move Slot
function moveSlot(slotName) {
	var elems = document.getElementsByClassName("tempSlot");
	for (i = 0; i < elems.length; i++) {
		if (elems[i].id.includes(slotName)) {
			elems[i].classList.toggle("fade");
		}
	}
	var tempElems = document.getElementsByClassName("stats-temp");
	for (i = 0; i < tempElems.length; i++) {
		if (tempElems[i].id.includes(slotName)) {
			tempElems[i].classList.toggle("hidden");
		}
	}
	var ele = document.getElementById(slotName + "-move");
	ele.classList.toggle("active");
}

function checkRepeat(ev, addonId) {
	currSlot = ev.currentTarget;

	if (currSlot.id.slice(-1) === "1") {
		otherSlotId = currSlot.id.slice(0, -1) + "2";
	} else if (currSlot.id.slice(-1) === "2") {
		otherSlotId = currSlot.id.slice(0, -1) + "1";
	}

	var otherSlotElems = document.getElementById(otherSlotId).children;

	for (i = 0; i < otherSlotElems.length; i++) {
		if (addonId === otherSlotElems[i].id) {
			clearSlot(otherSlotId);
		}
	}
}

//Items Functions
function assignItems(temp) {
	if (activeItemSubTab === "Toolbox") {
		return funcToolbox(temp, ...valItems);
	}
	if (activeItemSubTab === "Med-Kit") {
		return funcMedkit(temp, valItems[0], valItems[1]);
	}
}

function funcToolbox(temp, repairSpeed, charge, saboSpeed) {
	if (temp) {
		var ele = document.querySelectorAll(
			"#Toolbox-temp-stats > center:nth-child(1) > p"
		);
	} else {
		var ele = document.querySelectorAll(
			"#Toolbox-stats > center:nth-child(1) > p"
		);
	}
	var [baseRepairTime, baseCharge, baseSaboTime] = [80, 80, 2.5];

	charge = +charge.slice(0, -1);
	repairSpeed = +repairSpeed.slice(0, -1) / 100;
	var baseRepairSpeed = baseCharge / baseRepairTime;
	var finalRepairTime = getPreciseValue(
		charge / (baseRepairSpeed * (1 + repairSpeed)) +
			(baseCharge - charge) / baseRepairSpeed
	);
	var eleRepairTime = ele[0];
	eleRepairTime.textContent = finalRepairTime;
	assignColor(eleRepairTime, finalRepairTime, baseRepairTime);

	saboSpeed = +saboSpeed.slice(0, -1) / 100;
	var baseSaboSpeed = 100 / baseSaboTime;
	var finalSaboTime = getPreciseValue(100 / (baseSaboSpeed * (1 + saboSpeed)));
	var eleSaboTime = ele[ele.length - 2];
	eleSaboTime.textContent = finalSaboTime;
	assignColor(eleSaboTime, finalSaboTime, baseSaboTime);
}

function funcMedkit(temp, healingSpeedAlt, healingSpeedSlf) {
	if (temp) {
		var ele = document.querySelectorAll(
			"#Med-Kit-temp-stats > center:nth-child(1) > p"
		);
	} else {
		var ele = document.querySelectorAll(
			"#Med-Kit-stats > center:nth-child(1) > p"
		);
	}
	var baseHealingTime = 16;
	var baseHealingSpeed = 100 / baseHealingTime;

	healingSpeedAlt = +healingSpeedAlt.slice(0, -1) / 100;
	var finalHealingTimeAlt = getPreciseValue(
		100 / (baseHealingSpeed * (1 + healingSpeedAlt))
	);
	var eleHealingAlt = ele[0];
	eleHealingAlt.textContent = finalHealingTimeAlt;
	assignColor(eleHealingAlt, finalHealingTimeAlt, baseHealingTime);

	if (healingSpeedSlf != "None") {
		healingSpeedSlf = +healingSpeedSlf.slice(0, -1) / 100;
		var finalHealingTimeSlf = getPreciseValue(
			100 / (baseHealingSpeed * (1 + healingSpeedSlf))
		);
		var eleHealingSlf = ele[2];
		eleHealingSlf.textContent = finalHealingTimeSlf;
		assignColor(eleHealingSlf, finalHealingTimeSlf, baseHealingTime);
	}
}

function calcVal(ele, val1, val2) {
	var val;
	if (val2 === "None") {
		val = val1;
	} else if (val2 === "speed") {
		val = getSpeedPercent(val1);
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
function openSubTab(evt, sectionName, scrollValue) {
	var i, subtabcontent, subtablinks;
	subtabcontent = document.getElementsByClassName("subtabcontent");
	for (i = 0; i < subtabcontent.length; i++) {
		subtabcontent[i].style.display = "none";
	}
	subtablinks = document.getElementsByClassName("subtablinks");
	for (i = 0; i < subtablinks.length; i++) {
		subtablinks[i].className = subtablinks[i].className.replace(" active", "");
	}
	elem = document.getElementById(sectionName);
	elem.style.display = "block";
	if (scrollValue) {
		elem.scrollIntoView(true);
	}
	evt.currentTarget.className += " active";
	activeItemSubTab = evt.currentTarget.innerText;
}

// Open Items section as default section
function openDefault(evt, sectionName) {
	elem = document.getElementById(sectionName);
	elemsubtablink = elem.getElementsByClassName("subsubTabLinks")[0];
	elemsubtablink.click();
}

//Switch subsubtabs
function openSubSubTab(evt, sectionName, scrollValue) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("subsubTabContent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("subsubTabLinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(sectionName).style.display = "block";
	evt.currentTarget.className += " active";
}

//Pop Image
function dimElem(evt, targetClass) {
	var subtablinks = document.getElementsByClassName(targetClass);
	for (i = 0; i < subtablinks.length; i++) {
		subtablinks[i].className = subtablinks[i].className
			.replace(" opaque", "")
			.replace(" faded", "");
		subtablinks[i].className += " faded";
	}
	evt.currentTarget.className = evt.currentTarget.className.replace(
		" faded",
		""
	);
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
};

//Math Functions
function getPreciseValue(val) {
	return Number((Math.round(val * 200) / 200).toPrecision(4));
}

function getSpeedPercent(val) {
	var baseSpeed = 4;
	return getPreciseValue((+val * 100) / 4) + "%";
}

function getSpeedNumber(val) {
	var baseSpeed = 4;
	return getPreciseValue((+val.slice(-1) * 4) / 100);
}
