// Compares two text strings, the first of which may contain wildcards ('*' or '?').
// Copyright 2018 Zettalocity Software.
// This is a Derivative Work, licensed under the Apache 2.0 license.
// See comments for FastWildCompare.js, the human-readable form of this code.
function FastWildCompare(w, t)
{
	let i = 0;let j;let k;let l;
	do{if (t[i] == undefined){if (w[i] != undefined){while (w[i++] == '*')if (w[i] == undefined)return true;return false;}else return true;}else if (w[i] == '*'){j = i;while (w[++i] == '*')continue;if (w[i] == undefined)return true;if (w[i] != '?'){while (w[i] != t[j])if (t[++j] == undefined)return false;}k = i;l = j;break;}else if (w[i] != t[i] && w[i] != '?')return false;++i;} while (true);
	do{if (w[i] == '*'){while (w[++i] == '*')continue;if (w[i] == undefined)return true;if (t[j] == undefined)return false;if (w[i] != '?'){while (w[i] != t[j])if (t[++j] == undefined)return false;}k = i;l = j;}else if (w[i] != t[j] && w[i] != '?'){if (t[j] == undefined)return false;while (w[k] == '?'){++k;++l;}i = k;while (w[i] != t[++l])if (t[l] == undefined)return false;j = l;}if (t[j] == undefined){if (w[i] == undefined)return true;else return false;}++i;++j;} while (true);
}
