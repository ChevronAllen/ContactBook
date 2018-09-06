/*
 accepts parameters  FirstName, LastName, username, password, sessionID
 outputs the user Table row just created.
 doesnt insert the new user if a user under that username exists.
*/

CREATE DEFINER=`root`@`%` PROCEDURE `createUser`(IN u_fname VARCHAR(45), u_lname VARCHAR(45), uname VARCHAR(45), u_pass VARCHAR(45), sessionID VARCHAR(32))
BEGIN

INSERT INTO user (username, user_firstname, user_lastname, user_password, session_id)
VALUES (uname, u_fname, u_lname, u_pass, sessionID);

SELECT userid, username, user_firstname, user_lastname, date_added, date_last_login, sessionID
FROM user
WHERE userid = LAST_INSERT_ID();
END
