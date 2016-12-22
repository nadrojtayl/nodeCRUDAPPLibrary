 TO DOS:

Change the ORM creator function so that if your example contains types that don't convert to mongo types, it gives you a verbose error message (COMPLETE)

2. Finish server side scripting to insert script tags for DB endpoints (COMPLETE);

4. Deal with foreign keys

5. Change API connection to take parameters for end of HTML string as obj 
(DONE - BUT NEED TO CHECK API HELPER STILL WORKS AFTER THIS UPDATE)
//MAKE SURE PARAMETERIZATION ROLES DOWN TO HELPER FUNCTIONS ON CLIENT SIDE

6. Split off code that identifies IP address into its own module and make sure it finds public ip not just ip on network, plus give people option of defining that address themselves, eg constructor should take IP address or if not defined attempt to find it