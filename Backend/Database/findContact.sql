/* 
 accepts parameters userID, matchString , sessionID
 if the matchString is empty "". return all the users contact rows
 doesnt fetch if session is expired (30 mins), sessionID is invalid, or user doesnt exist
 if matchString isnt empty, returns a select of the user's Contacts using a LIKE relation.
 updates date_lastLogin
*/