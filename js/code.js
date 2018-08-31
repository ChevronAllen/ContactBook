// testAlphaNumeric takes in a string and tests it for any char that is not alphanumeric or a underscore
// if a non-alphanumeric char is found the function will return false else true
function testAlphaNumeric(str)
{
	let regex = /\W/;	// regular expresion for any non alphanumeric or underscore character
	return !(regex.test(str));
}
