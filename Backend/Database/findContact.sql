/*
 accepts parameters userID, matchString , sessionID
 if the matchString is empty "". return all the users contact rows
 doesnt fetch if session is expired (30 mins), sessionID is invalid, or user doesnt exist
 if matchString isnt empty, returns a select of the user's Contacts using a LIKE relation.
 updates date_lastLogin
*/

CREATE DEFINER=`root`@`%` PROCEDURE `findContacts`(IN user_id INT, matchString VARCHAR(32), sessionID VARCHAR(32))
BEGIN
IF matchString IS NOT NULL AND matchString <> '' THEN
	SELECT * FROM contacts
	WHERE  userid = user_id;
ELSE
	SELECT * FROM contacts
	WHERE  userid = user_id
    LIKE matchString;
END IF;
END
