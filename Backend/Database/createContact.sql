/*
 accepts parameters userID, contactFirstName, contactLastName, contactEmail, contactAddress,
					contactCity, contactState, contactZipCode, sessionID
 outputs the created contact row.
 doesnt run the function if userID is invalid,or sessionID is expired (30 mins)
 updates date_lastLogin
*/

CREATE DEFINER=`root`@`%` PROCEDURE `findContact`(IN user_id INT, matchString VARCHAR(32), sessionID VARCHAR(32))
BEGIN

DECLARE last_login DATETIME;
SET last_login = (SELECT date_last_login FROM user WHERE userid= user_id AND session_id= sessionID LIMIT 1);
IF  last_login IS NOT NULL THEN
	IF (timestampdiff(MINUTE, last_login, now()) > 30) THEN
		IF matchString IS NOT NULL AND matchString <> '' THEN
			SELECT * FROM contacts
			WHERE  userid = user_id;
		ELSE
			SELECT * FROM contacts
			WHERE  userid = user_id
			LIKE matchString;
		END IF;
	END IF;
END IF;
END
