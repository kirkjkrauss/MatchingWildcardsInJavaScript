// FastWildCompare.js
// JavaScript(R) version of FastWildCompare().
//
// Copyright 2018 Zettalocity Software.  This is a Derivative Work based 
// on material that is copyright 2018 IBM Corporation and available at
//
//  http://developforperformance.com/MatchingWildcards_AnImprovedAlgorithmForBigData.html
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
// Compares two text strings.  Accepts '?' as a single-character wildcard.  
// For each '*' wildcard, seeks out a matching sequence of any characters 
// beyond it.  Otherwise compares the strings a character at a time.
//
function FastWildCompare(strWild, strTame)
{
	let  iWild = 0;     // Index for both tame and wild strings in upper loop
	let  iTame;         // Index for tame string, set going into lower loop
	let  iWildSequence; // Index for prospective match after '*' (wild string)
	let  iTameSequence; // Index for prospective match (tame string)

	// Find a first wildcard, if one exists, and the beginning of any  
	// prospectively matching sequence after it.
	do
	{
		// Check for the end from the start.  Get out fast, if possible.
		if (strTame[iWild] == undefined)
		{
			if (strWild[iWild] != undefined)
			{
				while (strWild[iWild++] == '*')
				{
					if (strWild[iWild] == undefined)
					{
						return true;   // "ab" matches "ab*".
					}
				}

			    return false;          // "abcd" doesn't match "abc".
			}
			else
			{
				return true;           // "abc" matches "abc".
			}
		}
		else if (strWild[iWild] == '*')
		{
			// Got wild: set up for the second loop and skip on down there.
			iTame = iWild;

			while (strWild[++iWild] == '*')
			{
				continue;
			}

			if (strWild[iWild] == undefined)
			{
				return true;           // "abc*" matches "abcd".
			}

			// Search for the next prospective match.
			if (strWild[iWild] != '?')
			{
				while (strWild[iWild] != strTame[iTame])
				{
					if (strTame[++iTame] == undefined)
					{
						return false;  // "a*bc" doesn't match "ab".
					}
				}
			}

			// Keep fallback positions for retry in case of incomplete match.
			iWildSequence = iWild;
			iTameSequence = iTame;
			break;
		}
		else if (strWild[iWild] != strTame[iWild] && strWild[iWild] != '?')
		{
			return false;              // "abc" doesn't match "abd".
		}

		++iWild;                       // Everything's a match, so far.
	} while (true);

	// Find any further wildcards and any further matching sequences.
	do
	{
		if (strWild[iWild] == '*')
		{
			// Got wild again.
			while (strWild[++iWild] == '*')
			{
				continue;
			}

			if (strWild[iWild] == undefined)
			{
				return true;           // "ab*c*" matches "abcd".
			}

			if (strTame[iTame] == undefined)
			{
				return false;          // "*bcd*" doesn't match "abc".
			}

			// Search for the next prospective match.
			if (strWild[iWild] != '?')
			{
				while (strWild[iWild] != strTame[iTame])
				{
					if (strTame[++iTame] == undefined)
					{
						return false;  // "a*b*c" doesn't match "ab".
					}
				}
			}

			// Keep the new fallback positions.
			iWildSequence = iWild;
			iTameSequence = iTame;
		}
		else if (strWild[iWild] != strTame[iTame] && strWild[iWild] != '?')
		{
			// The equivalent portion of the upper loop is really simple.
			if (strTame[iTame] == undefined)
			{
				return false;          // "*bcd" doesn't match "abc".
			}

			// A fine time for questions.
			while (strWild[iWildSequence] == '?')
			{
				++iWildSequence;
				++iTameSequence;
			}

			iWild = iWildSequence;

			// Fall back, but never so far again.
			while (strWild[iWild] != strTame[++iTameSequence])
			{
				if (strTame[iTameSequence] == undefined)
				{
					return false;      // "*a*b" doesn't match "ac".
				}
			}

			iTame = iTameSequence;
		}

		// Another check for the end, at the end.
		if (strTame[iTame] == undefined)
		{
			if (strWild[iWild] == undefined)
			{
				return true;           // "*bc" matches "abc".
			}
			else
			{
				return false;          // "*bc" doesn't match "abcd".
			}
		}

		++iWild;                       // Everything's still a match.
		++iTame;
	} while (true);
}
