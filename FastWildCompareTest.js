// FastWildCompareTest.js
// This is a set of performance comparison and correctness tests, for 
// routines for matching wildcards.
// Copyright 2018 Zettalocity Software.
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

// These values set up specific sets of tests for the "Run test set" button.
//
const bCompareWild = true;
const bCompareTame = true;
const bCompareEmpty = true;

// When this value is true, it sets up the run to compare the performance of 
// two routines for matching wildcards.  Otherwise, just one routine is 
// tested, for correctness.
//
const bComparePerformance = true;

// This next value sets a number of repetitions for performance comparison,
// but applies only if the above Boolean value is true.  Choose about as many 
// repetitions as you're expecting in the real world.
//
const nComparisonReps = 100;

// These values store performance comparison results. 
//
// To get meaningful results, be sure to disable any "reduced timer precision"
// environment feature (e.g. privacy.reduceTimerPrecision in the about:config 
// settings in FireFox(R)).
//
var tf_cumulative;
var tr_cumulative;

// Accessor for DOM elements.
//
var $ = function(id)
{
	return document.getElementById(id);
}

// This function compares a tame/wild string pair via each algorithm.
//
function Confirm(strTame, strWild, bExpectedResult)
{
	let bPassed = true;
	let tf_delta = performance.now();

	if (bExpectedResult != FastWildCompare(strWild, strTame))
	{
		bPassed = false;
	}

	tf_cumulative += (performance.now() - tf_delta);

	if (bComparePerformance)
	{
		let tr_delta = performance.now();

		if (bExpectedResult != RegExWildCompare(strWild, strTame))
		{
			bPassed = false;
		}

		tr_cumulative += (performance.now() - tr_delta);
	}

	return bPassed;
}

// A set of wildcard comparison tests.
//
function TestWild()
{
	let nReps = 1;
	let bAllPassed = true;

	if (bComparePerformance)
	{
		nReps = nComparisonReps;
	}

	while (nReps--)
	{
		// Case with first wildcard after total match.
		bAllPassed &= Confirm("Hi", "Hi*", true);

		// Case with mismatch after '*'
		bAllPassed &= Confirm("abc", "ab*d", false);

		// Cases with repeating character sequences.
		bAllPassed &= Confirm("abcccd", "*ccd", true);
		bAllPassed &= Confirm("mississipissippi", "*issip*ss*", true);
		bAllPassed &= Confirm("xxxx*zzzzzzzzy*f", "xxxx*zzy*fffff", false);
		bAllPassed &= Confirm("xxxx*zzzzzzzzy*f", "xxx*zzy*f", true);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxx*zzy*fffff", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxx*zzy*f", true);
		bAllPassed &= Confirm("xyxyxyzyxyz", "xy*z*xyz", true);
		bAllPassed &= Confirm("mississippi", "*sip*", true);
		bAllPassed &= Confirm("xyxyxyxyz", "xy*xyz", true);
		bAllPassed &= Confirm("mississippi", "mi*sip*", true);
		bAllPassed &= Confirm("ababac", "*abac*", true);
		bAllPassed &= Confirm("ababac", "*abac*", true);
		bAllPassed &= Confirm("aaazz", "a*zz*", true);
		bAllPassed &= Confirm("a12b12", "*12*23", false);
		bAllPassed &= Confirm("a12b12", "a12b", false);
		bAllPassed &= Confirm("a12b12", "*12*12*", true);

		// RegExWildCompare doesn't handle '?' wildcards.
		if (!bComparePerformance)
		{
			// From DDJ reader Andy Belf: a case of repeating text matching 
			// the different kinds of wildcards in order of '*' and then '?'.
			bAllPassed &= Confirm("caaab", "*a?b", true);
			// This similar case was found, probably independently, by Dogan 
			// Kurt.
			bAllPassed &= Confirm("aaaaa", "*aa?", true);
		}

		// Additional cases where the '*' char appears in the tame string.
		bAllPassed &= Confirm("*", "*", true);
		bAllPassed &= Confirm("a*abab", "a*b", true);
		bAllPassed &= Confirm("a*r", "a*", true);
		bAllPassed &= Confirm("a*ar", "a*aar", false);

		// More double wildcard scenarios.
		bAllPassed &= Confirm("XYXYXYZYXYz", "XY*Z*XYz", true);
		bAllPassed &= Confirm("missisSIPpi", "*SIP*", true);
		bAllPassed &= Confirm("mississipPI", "*issip*PI", true);
		bAllPassed &= Confirm("xyxyxyxyz", "xy*xyz", true);
		bAllPassed &= Confirm("miSsissippi", "mi*sip*", true);
		bAllPassed &= Confirm("miSsissippi", "mi*Sip*", false);
		bAllPassed &= Confirm("abAbac", "*Abac*", true);
		bAllPassed &= Confirm("abAbac", "*Abac*", true);
		bAllPassed &= Confirm("aAazz", "a*zz*", true);
		bAllPassed &= Confirm("A12b12", "*12*23", false);
		bAllPassed &= Confirm("a12B12", "*12*12*", true);
		bAllPassed &= Confirm("oWn", "*oWn*", true);

		// Completely tame (no wildcards) cases.
		bAllPassed &= Confirm("bLah", "bLah", true);
		bAllPassed &= Confirm("bLah", "bLaH", false);

		if (!bComparePerformance)
		{
			// Simple mixed wildcard tests suggested by Marlin Deckert.
			bAllPassed &= Confirm("a", "*?", true);
			bAllPassed &= Confirm("ab", "*?", true);
			bAllPassed &= Confirm("abc", "*?", true);

			// More mixed wildcard tests including coverage for false 
			// positives.
			bAllPassed &= Confirm("a", "??", false);
			bAllPassed &= Confirm("ab", "?*?", true);
			bAllPassed &= Confirm("ab", "*?*?*", true);
			bAllPassed &= Confirm("abc", "?**?*?", true);
			bAllPassed &= Confirm("abc", "?**?*&?", false);
			bAllPassed &= Confirm("abcd", "?b*??", true);
			bAllPassed &= Confirm("abcd", "?a*??", false);
			bAllPassed &= Confirm("abcd", "?**?c?", true);
			bAllPassed &= Confirm("abcd", "?**?d?", false);
			bAllPassed &= Confirm("abcde", "?*b*?*d*?", true);

			// Single-character-match cases.
			bAllPassed &= Confirm("bLah", "bL?h", true);
			bAllPassed &= Confirm("bLaaa", "bLa?", false);
			bAllPassed &= Confirm("bLah", "bLa?", true);
			bAllPassed &= Confirm("bLaH", "?Lah", false);
			bAllPassed &= Confirm("bLaH", "?LaH", true);
		}

		// Many-wildcard scenarios.
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", 
			"a*a*a*a*a*a*aa*aaa*a*a*b", true);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"*a*b*ba*ca*a*aa*aaa*fa*ga*b*", true);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"*a*b*ba*ca*a*x*aaa*fa*ga*b*", false);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"*a*b*ba*ca*aaaa*fa*ga*gggg*b*", false);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"*a*b*ba*ca*aaaa*fa*ga*ggg*b*", true);
		bAllPassed &= Confirm("aaabbaabbaab", "*aabbaa*a*", true);
		bAllPassed &= Confirm("a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*", 
			"a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*", true);
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaaa", 
			"*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*", true);
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaa", 
			"*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*", false);
		bAllPassed &= Confirm("abc*abcd*abcde*abcdef*abcdefg*abcdefgh*abcdefghi*abcdefghij*abcdefghijk*abcdefghijkl*abcdefghijklm*abcdefghijklmn", 
			"abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*", false);
		bAllPassed &= Confirm("abc*abcd*abcde*abcdef*abcdefg*abcdefgh*abcdefghi*abcdefghij*abcdefghijk*abcdefghijkl*abcdefghijklm*abcdefghijklmn", 
			"abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*", true);
		bAllPassed &= Confirm("abc*abcd*abcd*abc*abcd", "abc*abc*abc*abc*abc", 
			false);
		bAllPassed &= Confirm(
			"abc*abcd*abcd*abc*abcd*abcd*abc*abcd*abc*abc*abcd", 
			"abc*abc*abc*abc*abc*abc*abc*abc*abc*abc*abcd", true);
		bAllPassed &= Confirm("abc", "********a********b********c********", 
			true);
		bAllPassed &= Confirm("********a********b********c********", "abc", 
			false);
		bAllPassed &= Confirm("abc", "********a********b********b********", 
			false);
		bAllPassed &= Confirm("*abc*", "***a*b*c***", true);

		// A case-insensitive algorithm test.
		// bAllPassed &= Confirm("mississippi", "*issip*PI", true);
		if (!bComparePerformance)
		{
			// Tests suggested by other DDJ readers.
			bAllPassed &= Confirm("", "?", false);
			bAllPassed &= Confirm("", "*?", false);
			bAllPassed &= Confirm("", "", true);
			bAllPassed &= Confirm("a", "", false);
		}
	}

	return bAllPassed;
}

// A set of tests with no '*' wildcards.
//
function TestTame()
{
	let nReps = 1;
	let bAllPassed = true;

	if (bComparePerformance)
	{
		nReps = nComparisonReps;
	}
	
	while (nReps--)
	{
		// Case with last character mismatch.
		bAllPassed &= Confirm("abc", "abd", false);

		// Cases with repeating character sequences.
		bAllPassed &= Confirm("abcccd", "abcccd", true);
		bAllPassed &= Confirm("mississipissippi", "mississipissippi", true);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxxzzzzzzzzyfffff", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxxzzzzzzzzyf", true);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxxzzy.fffff", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "xxxxzzzzzzzzyf", true);
		bAllPassed &= Confirm("xyxyxyzyxyz", "xyxyxyzyxyz", true);
		bAllPassed &= Confirm("mississippi", "mississippi", true);
		bAllPassed &= Confirm("xyxyxyxyz", "xyxyxyxyz", true);
		bAllPassed &= Confirm("m ississippi", "m ississippi", true);
		bAllPassed &= Confirm("ababac", "ababac?", false);
		bAllPassed &= Confirm("dababac", "ababac", false);
		bAllPassed &= Confirm("aaazz", "aaazz", true);
		bAllPassed &= Confirm("a12b12", "1212", false);
		bAllPassed &= Confirm("a12b12", "a12b", false);
		bAllPassed &= Confirm("a12b12", "a12b12", true);

		// A mix of cases.
		bAllPassed &= Confirm("n", "n", true);
		bAllPassed &= Confirm("aabab", "aabab", true);
		bAllPassed &= Confirm("ar", "ar", true);
		bAllPassed &= Confirm("aar", "aaar", false);
		bAllPassed &= Confirm("XYXYXYZYXYz", "XYXYXYZYXYz", true);
		bAllPassed &= Confirm("missisSIPpi", "missisSIPpi", true);
		bAllPassed &= Confirm("mississipPI", "mississipPI", true);
		bAllPassed &= Confirm("xyxyxyxyz", "xyxyxyxyz", true);
		bAllPassed &= Confirm("miSsissippi", "miSsissippi", true);
		bAllPassed &= Confirm("miSsissippi", "miSsisSippi", false);
		bAllPassed &= Confirm("abAbac", "abAbac", true);
		bAllPassed &= Confirm("abAbac", "abAbac", true);
		bAllPassed &= Confirm("aAazz", "aAazz", true);
		bAllPassed &= Confirm("A12b12", "A12b123", false);
		bAllPassed &= Confirm("a12B12", "a12B12", true);
		bAllPassed &= Confirm("oWn", "oWn", true);
		bAllPassed &= Confirm("bLah", "bLah", true);
		bAllPassed &= Confirm("bLah", "bLaH", false);

		// RegExWildCompare doesn't handle '?' wildcards.
		if (!bComparePerformance)
		{
			// Single '?' cases.
			bAllPassed &= Confirm("a", "a", true);
			bAllPassed &= Confirm("ab", "a?", true);
			bAllPassed &= Confirm("abc", "ab?", true);

			// Mixed '?' cases.
			bAllPassed &= Confirm("a", "??", false);
			bAllPassed &= Confirm("ab", "??", true);
			bAllPassed &= Confirm("abc", "???", true);
			bAllPassed &= Confirm("abcd", "????", true);
			bAllPassed &= Confirm("abc", "????", false);
			bAllPassed &= Confirm("abcd", "?b??", true);
			bAllPassed &= Confirm("abcd", "?a??", false);
			bAllPassed &= Confirm("abcd", "??c?", true);
			bAllPassed &= Confirm("abcd", "??d?", false);
			bAllPassed &= Confirm("abcde", "?b?d*?", true);
		}

		// Longer string scenarios.
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", 
			"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", true);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", true);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"abababababababababababababababababababaacacacacacacacadaeafagahaiajaxalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", false);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaggggagaaaaaaaab", false);
		bAllPassed &= Confirm("abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", 
			"abababababababababababababababababababaacacacacacacacadaeafagahaiajakalaaaaaaaaaaaaaaaaaffafagaagggagaaaaaaaab", true);
		bAllPassed &= Confirm("aaabbaabbaab", "aaabbaabbaab", true);
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 
			"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", true);
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaaa", 
			"aaaaaaaaaaaaaaaaa", true);
		bAllPassed &= Confirm("aaaaaaaaaaaaaaaa", 
			"aaaaaaaaaaaaaaaaa", false);
		bAllPassed &= Confirm("abcabcdabcdeabcdefabcdefgabcdefghabcdefghiabcdefghijabcdefghijkabcdefghijklabcdefghijklmabcdefghijklmn", 
			"abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc", 
			false);
		bAllPassed &= Confirm("abcabcdabcdeabcdefabcdefgabcdefghabcdefghiabcdefghijabcdefghijkabcdefghijklabcdefghijklmabcdefghijklmn", 
			"abcabcdabcdeabcdefabcdefgabcdefghabcdefghiabcdefghijabcdefghijkabcdefghijklabcdefghijklmabcdefghijklmn", 
			true);

		if (!bComparePerformance)
		{	
			bAllPassed &= Confirm("abcabcdabcdabcabcd", "abcabc?abcabcabc", 
				false);
			bAllPassed &= Confirm(
				"abcabcdabcdabcabcdabcdabcabcdabcabcabcd", 
				"abcabc?abc?abcabc?abc?abc?bc?abc?bc?bcd", true);
			bAllPassed &= Confirm("?abc?", "?abc?", true);
		}
	}

	return bAllPassed;
}

// A set of tests with empty strings.
//
function TestEmpty()
{
	let nReps = 1;
	let bAllPassed = true;

	if (bComparePerformance)
	{
		nReps = nComparisonReps;
	}

	while (nReps--)
	{
		// A simple case.
		bAllPassed &= Confirm("", "abd", false);

		// Cases with repeating character sequences.
		bAllPassed &= Confirm("", "abcccd", false);
		bAllPassed &= Confirm("", "mississipissippi", false);
		bAllPassed &= Confirm("", "xxxxzzzzzzzzyfffff", false);
		bAllPassed &= Confirm("", "xxxxzzzzzzzzyf", false);
		bAllPassed &= Confirm("", "xxxxzzy.fffff", false);
		bAllPassed &= Confirm("", "xxxxzzzzzzzzyf", false);
		bAllPassed &= Confirm("", "xyxyxyzyxyz", false);
		bAllPassed &= Confirm("", "mississippi", false);
		bAllPassed &= Confirm("", "xyxyxyxyz", false);
		bAllPassed &= Confirm("", "m ississippi", false);
		bAllPassed &= Confirm("", "ababac*", false);
		bAllPassed &= Confirm("", "ababac", false);
		bAllPassed &= Confirm("", "aaazz", false);
		bAllPassed &= Confirm("", "1212", false);
		bAllPassed &= Confirm("", "a12b", false);
		bAllPassed &= Confirm("", "a12b12", false);

		// A mix of cases.
		bAllPassed &= Confirm("", "n", false);
		bAllPassed &= Confirm("", "aabab", false);
		bAllPassed &= Confirm("", "ar", false);
		bAllPassed &= Confirm("", "aaar", false);
		bAllPassed &= Confirm("", "XYXYXYZYXYz", false);
		bAllPassed &= Confirm("", "missisSIPpi", false);
		bAllPassed &= Confirm("", "mississipPI", false);
		bAllPassed &= Confirm("", "xyxyxyxyz", false);
		bAllPassed &= Confirm("", "miSsissippi", false);
		bAllPassed &= Confirm("", "miSsisSippi", false);
		bAllPassed &= Confirm("", "abAbac", false);
		bAllPassed &= Confirm("", "abAbac", false);
		bAllPassed &= Confirm("", "aAazz", false);
		bAllPassed &= Confirm("", "A12b123", false);
		bAllPassed &= Confirm("", "a12B12", false);
		bAllPassed &= Confirm("", "oWn", false);
		bAllPassed &= Confirm("", "bLah", false);
		bAllPassed &= Confirm("", "bLaH", false);

		// Both strings empty.
		bAllPassed &= Confirm("", "", true);

		// Another simple case.
		bAllPassed &= Confirm("abc", "", false);

		// Cases with repeating character sequences.
		bAllPassed &= Confirm("abcccd", "", false);
		bAllPassed &= Confirm("mississipissippi", "", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "", false);
		bAllPassed &= Confirm("xxxxzzzzzzzzyf", "", false);
		bAllPassed &= Confirm("xyxyxyzyxyz", "", false);
		bAllPassed &= Confirm("mississippi", "", false);
		bAllPassed &= Confirm("xyxyxyxyz", "", false);
		bAllPassed &= Confirm("m ississippi", "", false);
		bAllPassed &= Confirm("ababac", "", false);
		bAllPassed &= Confirm("dababac", "", false);
		bAllPassed &= Confirm("aaazz", "", false);
		bAllPassed &= Confirm("a12b12", "", false);
		bAllPassed &= Confirm("a12b12", "", false);
		bAllPassed &= Confirm("a12b12", "", false);

		// A mix of cases.
		bAllPassed &= Confirm("n", "", false);
		bAllPassed &= Confirm("aabab", "", false);
		bAllPassed &= Confirm("ar", "", false);
		bAllPassed &= Confirm("aar", "", false);
		bAllPassed &= Confirm("XYXYXYZYXYz", "", false);
		bAllPassed &= Confirm("missisSIPpi", "", false);
		bAllPassed &= Confirm("mississipPI", "", false);
		bAllPassed &= Confirm("xyxyxyxyz", "", false);
		bAllPassed &= Confirm("miSsissippi", "", false);
		bAllPassed &= Confirm("miSsissippi", "", false);
		bAllPassed &= Confirm("abAbac", "", false);
		bAllPassed &= Confirm("abAbac", "", false);
		bAllPassed &= Confirm("aAazz", "", false);
		bAllPassed &= Confirm("A12b12", "", false);
		bAllPassed &= Confirm("a12B12", "", false);
		bAllPassed &= Confirm("oWn", "", false);
		bAllPassed &= Confirm("bLah", "", false);
		bAllPassed &= Confirm("bLah", "", false);
	}

	return bAllPassed;
}

// Test runner for all the tests in the set.
//
function RunTests()
{
	// Any test failure will set this value false.
	// We'll exit quickly after that.
	let bPassed = true;

	// Reset global values that store performance comparison results.
	tf_cumulative = tr_cumulative = 0;

	// Invoke the tests.
	if (bCompareTame)
	{
		bPassed = TestTame();

		if (!bPassed)
		{
			$("testsetresult").firstChild.nodeValue = "Failed entirely-tame comparison test.";
		}
	}

	if (bPassed && bCompareEmpty)
	{
		bPassed = TestEmpty();

		if (!bPassed)
		{
			$("testsetresult").firstChild.nodeValue = "Failed entirely-empty comparison test.";
		}	
	}

	if (bPassed && bCompareWild)
	{
		bPassed = TestWild();

		if (!bPassed)
		{
			$("testsetresult").firstChild.nodeValue = "Failed wildcard comparison test.";
		}		
	}

	// When all tests pass, this is where we display the timings of the 
	// routines being performance-compared.
	if (bPassed)
	{
		let strResult = "All tests passed";
		
		if (bComparePerformance)
		{
			strResult += " (for both algorithms)";
		}

		strResult += ".";
		$("testsetresult").firstChild.nodeValue = strResult;
		
		if (bComparePerformance)
		{
			// Show the timing results.
			$("time1").firstChild.nodeValue = "FastWildCompare: " + tf_cumulative.toFixed(2) + " ms";
			$("time2").firstChild.nodeValue = "RegExWildCompare: " + tr_cumulative.toFixed(2) + " ms";	
		}		
	}

	// Done with testing.  Enable the button again.
	$("testset").disabled = false;
	return;
}

// Resets the DOM elements that may have been updated via the above code.
//
function ClearForm()
{
	//$("compare_form").reset();
	$("testsetresult").firstChild.nodeValue = "";
	$("time1").firstChild.nodeValue = "";
	$("time2").firstChild.nodeValue = "";
	return;
}

// Displays a "please wait" status message.
// Kicks off the set of tests defined by the global values set at TOF.
//
function MainTestRunner()
{
	ClearForm();

	// Disable the button that kicked off testing, until the testing is done.
	$("testset").disabled = true;

	if (bComparePerformance)
	{
		$("testsetresult").innerHTML = " &nbsp; &mdash; Running &mdash; Please wait &mdash; &nbsp; ";
	}

	// Start up the tests.
	setTimeout(RunTests, 100);
	return;
}

// Entry point.
//
window.onload = function()
{
	$("testset").onclick = MainTestRunner;
	return;
}