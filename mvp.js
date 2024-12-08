// spread string to convert to array in a UTF-16 safe way
// working with an array is easier
let alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

const NOTDONE = 0;
const DONE = 1;
const SKIPPED = 2;

class Pair {
	constructor (letters, status=NOTDONE) {
		this.letters = letters;	
		this.status = status;	
	}
}

let pairs = [];
for (let i of alphabet) {
	for (let j of alphabet) {
		if (i==j) continue;
		pairs.push(i + j);
	}
}

let uncomplete_pairs = localStorage.getItem('uncomplete_pairs');
if (uncomplete_pairs != null) {
	uncomplete_pairs = JSON.decode(uncomplete_pairs);
} else {
	uncomplete_pairs = [...pairs];
}

let complete_pairs = localStorage.getItem('complete_pairs');
if (complete_pairs != null) {
	complete_pairs = JSON.decode(complete_pairs);
} else {
	complete_pairs = {};
}
console.log(pairs)

const pairDisplay = document.getElementById("pairDisplay")

let currentPairIndex;
function doPair() {
	currentPairIndex = Math.floor(Math.random() * uncomplete_pairs.length);
	const pair = uncomplete_pairs[currentPairIndex];
	pairDisplay.innerText = pair;
}


const imageInput = document.getElementById("image_input")
imageInput.onkeypress = (e) => {if (e.key === 'Enter') enter()}
 
function enter() {
	let value = imageInput.value;
	console.log(value);
	imageInput.value = '';
	if (value === '') {
		uncomplete_pairs.splice(currentPairIndex, 1);
		skipped_pairs.push(complete_pairs[currentPairIndex]);
	} else {
		complete_pairs[uncomplete_pairs[currentPairIndex]] = value;
		console.log(uncomplete_pairs.length);
		uncomplete_pairs.splice(currentPairIndex, 1);
		console.log(uncomplete_pairs.length);
	}
	// updateExport()
	update()
	doPair();
}

const COLSEP = ',';
// const COLSEP = '\t';

function update() {
	localStorage.setItem('complete_pairs',JSON.stringify(complete_pairs))
	localStorage.setItem('uncomplete_pairs',JSON.stringify(uncomplete_pairs))
}

const exportBox = document.getElementById('export');
function updateExport() {
	update();
	let output = '';
	for (i in complete_pairs) {
		output += i + COLSEP + complete_pairs[i] + '\n';
	}

	exportBox.value = output;
}

function exportFull () {
	update();
	let output = '';

	for (let i of alphabet) {
		for (let j of alphabet) {
			const pair = i + j;
			if (pair in complete_pairs) {
				output += JSON.stringify(complete_pairs[i + j]) + COLSEP ;
			} else {
				output += COLSEP;
			}
		}
		output += '\n';
	}

	exportBox.value = output;
}

doPair();


copyButton.onclick = async (e) => {
	let original_text = e.target.textContent;
	e.target.textContent = 'Copied!';
	setTimeout(() => {
		e.target.textContent = original_text;
		console.log('done');
	}, 1000);
	try {
		const text = exportBox.value || "";
		await navigator.clipboard.writeText(text);
	} catch (err) {
		alert("Error trying to copy to clipboard");
		return;
	}
	//alert('Export copied');
};


function clearStorage() {
	if (confirm("This will completely clear all stored letter pairs and images! Are you sure?")
		&& confirm("Are you *really* sure?")) {
		localStorage.clear();	
	};
}
