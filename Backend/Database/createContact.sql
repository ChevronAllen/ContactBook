/*
 accepts parameters userID, contactFirstName, contactLastName, contactEmail, contactAddress,
					contactCity, contactState, contactZipCode, sessionID
 outputs the created contact row.
 doesnt run the function if userID is invalid,or sessionID is expired (30 mins)
 updates date_lastLogin
*/

CREATE DEFINER=`root`@`%` PROCEDURE `createContact`(IN user_id INT, contactFirstName VARCHAR(32), contactLastName VARCHAR(32), contactPhone VARCHAR(32), contactEmail VARCHAR(32), contactAddress VARCHAR(32),
					contactCity VARCHAR(32), contactState VARCHAR(32), contactZipCode VARCHAR(32), sessionID VARCHAR(32))
BEGIN
DECLARE last_login DATETIME;

SET last_login = (SELECT date_last_login FROM user WHERE userid= user_id AND session_id= sessionID LIMIT 1);
	IF  last_login IS NOT NULL THEN
		IF (timestampdiff(MINUTE, last_login, now()) < 30) THEN

			UPDATE user
			SET	date_last_login = CURRENT_TIMESTAMP()
			WHERE username= uname AND user_password = pword
			LIMIT 1;

			INSERT INTO contact (contact_firstname, contact_lastname, contact_email, contact_phone, contact_address, contact_city, contact_state, contact_zipcode, userid)
			VALUES(contactFirstName, contactLastName, contactEmail, contactPhone, contactAddress, contactCity, contactState, contactZipCode, user_id);

			SELECT * FROM contact WHERE contactid= LAST_INSERT_ID();

		END IF;
	END IF;
END
