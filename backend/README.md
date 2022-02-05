# Backend

## API Endpoints
*createUser*
Create a user in the database

*updateUser*
Change a user in the database

*createNation*



*getMapData*
Returns an object containing map information.
This will technically be pulled from Google sheets.

*moveFleet*
Moves a fleet from one system to another

*getSystemData/:sysId*
Returns more detailed information about a system.

*getSystemDeployments/:sysId*
Returns a list of fleets present in a system.

## Database

*Users*
 - Username
 - Password
 - moderator/administrator status
 - nation(s)

*Nations*
 - Name
 - Link to an Order of Battle
 - Link to Holdings/Static stuff

*Holdings*
 - System
 - Nation
 - Name (optional)
 - Status : mixed, total, contested, etc.

*Fleets*
 - Name
 - Nationality
 - Location

## Testing Commands

```
curl -X POST 0.0.0.0:9292/nation/createNation \
   -H 'Content-Type: application/json' \
   -d '{"name": "Samsaran Republic", "oobLink": "https://docs.google.com/spreadsheets/d/1w_0ZNnIJ9isBnTG2__wgWe9hgdqnGVENuWPEWfWFUPE/edit?usp=sharing"}'
```