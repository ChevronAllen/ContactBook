/*
 accepts parameters userID, matchString , sessionID
 if the matchString is empty "". return all the users contact rows
 doesnt fetch if session is expired (30 mins), sessionID is invalid, or user doesnt exist
 if matchString isnt empty, returns a select of the user's Contacts using a LIKE relation.
 updates date_lastLogin
*/

CREATE DEFINER=`root`@`%` PROCEDURE `findContact`(IN user_id INT, matchString VARCHAR(32), sessionID VARCHAR(32))
BEGIN

DECLARE last_login DATETIME;
SET last_login = (SELECT date_last_login FROM user WHERE userid= user_id AND session_id= sessionID LIMIT 1);
IF  last_login IS NOT NULL THEN
	IF (timestampdiff(MINUTE, last_login, now()) < 30) THEN
		IF matchString IS  NULL OR matchString = '' THEN
			SELECT * FROM contact
			WHERE  userid = user_id;
		ELSE
			SELECT * FROM contact
			WHERE  userid = user_id
			LIKE matchString;
		END IF;
	END IF;
END IF;
END
