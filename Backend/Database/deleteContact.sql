/*
 accepts parameters userID, contactID, sessionID
 outputs a users user table row indicate success. or else an empty query from the users table on a fail
 creates a session by inserting the user's sessionID
 doesnt run the function if userID is invalid, contactID is invalid for the user, or sessionID is expired (30 mins)
 updates date_lastLogin
*/
