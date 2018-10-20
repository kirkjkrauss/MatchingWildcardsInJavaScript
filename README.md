# MatchingWildcardsInJavaScript
Matching Wildcards in JavaScript

This file set includes a routine for matching wildcards in JavaScript (FastWildCompare.js), ported from the native code implementation here:
http://www.developforperformance.com/MatchingWildcards_AnImprovedAlgorithmForBigData.html

It also includes a routine for matching wildcards based on JavaScript's RegExp() regular expression methods, based on an extension of Don McCurdy's implementation here:
https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f

Also included are HTML/CSS/JavaScript forms for interacting with the above routines (see FastWildCompareForm.js and RegExWildCompareForm,js, respectively), along with an HTML/CSS/JavaScript test set (FastWildCompareTest.js) for correctness and performance comparison of these or similar routines.  A description of the implementation strategies, a discussion of performance findings, and thoughts about how to choose one routine over another appear here:
http://www.developforperformance.com/MatchingWildcardsInJavaScript.html
