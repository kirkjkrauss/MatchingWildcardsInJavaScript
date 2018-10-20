// Accessor for DOM elements.
//
var $ = function(id)
{
	return document.getElementById(id);
}

// Resets the DOM elements that may get updated via the code below.
//
function ClearForm()
{
	//$("compare_form").reset();
	$("wild").value = "";
	$("tame").value = "";
	$("result").firstChild.nodeValue = ""
	$("tame").focus();
	return;
}

// Takes text strings from the two input fields.
// Passes them to FastWildCompare() to find out whether there's a match.
//
function ValidateAndCompareInput()
{
	var strWild = $("wild").value;
	var strTame = $("tame").value;
	var strMessage = "";
	
	// Validation: Make sure we have two input strings.
	if ((typeof strWild == 'string' || strWild instanceof String) &&
		(typeof strTame == 'string' || strTame instanceof String))
	{
		let bMatch = FastWildCompare(strWild, strTame);
		
		if (bMatch)
		{
			$("result").firstChild.nodeValue = "Match.";
		}
		else
		{
			$("result").firstChild.nodeValue = "No match.";
		}
	}
	else
	{
		$("result").firstChild.nodeValue = "Please enter 'tame' and 'wild' text strings.";
	}
	
	return;
}

// Entry point.
//
window.onload = function()
{
	ClearForm();	
	$("compare").onclick = ValidateAndCompareInput;
	$("clear").onclick = ClearForm;
	return;
}
