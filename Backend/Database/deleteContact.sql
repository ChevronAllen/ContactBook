/*
 accepts parameters userID, contactID, sessionID
 outputs a single cell table with either a 1 or 0 to indicate success.
 creates a session by inserting the user's sessionID
 doesnt run the function if userID is invalid, contactID is invalid for the user, or sessionID is expired (30 mins)
 updates date_lastLogin
*/
/*
	Example output: SELECT 1 AS 'Result';
	Example output: SELECT 0 AS 'Result';
*/