/*
 accepts parameters userID, contactID, sessionID
 outputs a users user table row indicate success. or else an empty query from the users table on a fail
 creates a session by inserting the user's sessionID
 doesnt run the function if userID is invalid, contactID is invalid for the user, or sessionID is expired (30 mins)
 updates date_lastLogin
*/

CREATE DEFINER=`root`@`%` PROCEDURE `deleteContact`(IN user_id INT, contact_id INT, sessionID VARCHAR(32))
BEGIN
DECLARE last_login DATETIME;
SET last_login = (SELECT date_last_login FROM user WHERE userid= user_id AND session_id= sessionID LIMIT 1);
IF  last_login IS NOT NULL THEN
	IF (timestampdiff(MINUTE, last_login, now()) > 30) THEN
		DELETE FROM contact WHERE contactid = contact_id;
	END IF;
END IF;
END
