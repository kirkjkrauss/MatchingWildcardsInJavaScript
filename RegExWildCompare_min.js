function EscapeTameRegExChars(w){
	return w.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
function RegExToWild(strInput){
	return new RegExp('^' + strInput.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');
}
function RegExWildCompare(w, t){
	let strEscWild = new RegExp('^' + w.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');return strEscWild.test(t);
}
