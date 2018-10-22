// Compares two text strings, the first of which may contain wildcards ('*' or '?').
// Copyright 2018 Zettalocity Software.
// This is a Derivative Work, licensed under the Apache 2.0 license.
// See comments for RegExWildCompare.js, the human-readable form of this code.
function EscapeTameRegExChars(w){
	return w.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
function RegExToWild(strInput){
	return new RegExp('^' + strInput.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');
}
function RegExWildCompare(w, t){
	let strEscWild = new RegExp('^' + w.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');return strEscWild.test(t);
}
