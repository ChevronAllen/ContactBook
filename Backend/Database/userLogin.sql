/*
 accepts parameters username, password, sessionID
 outputs the user row (without the password)
 starts a session by setting the users sessionID and setting the date_lastLogin to the current Timestamp
*/

CREATE DEFINER=`root`@`%` PROCEDURE `userLogin`(IN uname VARCHAR(45), password VARCHAR(32), sessionID VARCHAR(32))
BEGIN
IF EXISTS (SELECT * FROM user WHERE username= uname AND user_password = pword) THEN
	UPDATE user
	SET session_id= sessionID, date_last_login = CURRENT_TIMESTAMP();
    SELECT   userid, username, user_firstname, user_lastname, date_added, date_last_login, session_id
    FROM user WHERE username= uname AND user_password = pword;
END IF;
END
