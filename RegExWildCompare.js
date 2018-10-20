// RegExWildCompare.js
// A routine for matching wildcards based on JavaScript's built-in regular 
// expression handler.  
//
// Copyright 2018 Zettalocity Software.  This is a Derivative Work based 
// on material that is copyright 2018 Don McCurdy and available at
//
//  https://gist.github.com/donmccurdy
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//  http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// For each '*' wildcard, seeks out a matching sequence of any characters 
// beyond it.  Otherwise compares the strings a character at a time.
// Any characters that would be specially treated as regular expression 
// matching patterns are preserved based on code derived from 
// donmccurdy/wildcard-to-regexp.js, at
//
//  https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
//
function EscapeTameRegExChars(strWild)
{
	return strWild.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

// Creates a RegExp from the given string, converting asterisks to .* 
// expressions, and escaping all other characters.
//
function RegExToWild(strInput)
{
	return new RegExp('^' + strInput.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');
}

// Compares two text strings.  For each '*' wildcard, seeks out a matching 
// sequence of any characters beyond it.  Otherwise compares the strings 
// character by character.
//
function RegExWildCompare(strWild, strTame)
{
	let strEscWild = new RegExp('^' + strWild.split(/\*+/).map(EscapeTameRegExChars).join('.*') + '$');
	return strEscWild.test(strTame);
}
