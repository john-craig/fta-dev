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
 - Username                   (userName)
 - Password                   (userPassHash)
 - Type                       (userType)
   - e.g., Admin, Moderator, Player
 - Nations                    (userNatIds)
 - Notifications              (userNotifs)
 - User ID                    (userId)

*Nations*
 - Nation Name                (natName)
 - Link to an OoB             (natMilLink)
 - Link to Holdings           (natHoldLink)
 - Nation type                (natType)
   - Player, NPC, etc.
 - Nation status              (natStatus)
   - Active, Destroyed, Abandoned
 - Belligerents               (natBellig)
   - List of Nation ID's
 - Allies                     (natAllies)
   - List of Nation ID's
 - Player                     (userId)
 - Nation Id                  (nationId)

*Atlas*†
- System Name                 (sysName)
- Position on Map             (sysPos)
- Short Description           (sysDesc)
- Status                      (sysStatus)
   - Single owner, multi-owner,
   contested, etc.
- System ID                   (sysId)

*Territories*†
 - Location                   (sysId)
 - Nation                     (natId)
 - Name (optional)            (terName)


*Deployments*
 - Fleet                      (fleetId)
 - Location                   (sysId)
 - Status                     (deployStatus)

*Visibility*

*Fleets*†
 - Name                       (fleetName)
 - Nationality                (natId)
 - Constituents               (fleetMembers)
   - This is an array
   of objects with designId's
   and quantities

*Designs*†
 - Name                       (designName)
 - Other info...

†Data which needs to be pulled from Google sheets

## To-Dos:
 - create *refreshTerritory* function
 - create *refreshMap* function
 - create *refreshDesign* function
 - finish *refreshFleet* function
 - plan *refreshDeployments* function
 - create *validateTerritory* function
 - create *validateFleet* function
 - create *validateDesign* function

## Done
 - user creation route
 - sign in route
 - nation creation route
 - get user nation(s) route

## Testing Commands

```
curl -X POST 0.0.0.0:9292/nation/createNation \
   -H 'Content-Type: application/json' \
   -d '{"name": "Samsaran Republic", "militaryLink": "https://docs.google.com/spreadsheets/d/1w_0ZNnIJ9isBnTG2__wgWe9hgdqnGVENuWPEWfWFUPE/edit?usp=sharing", "holdingsLink": "https://docs.google.com/spreadsheets/d/1IsXGoq3Mc51mlAU1UK08SE9Grk8sXm3wl0iGe00Waxo/edit?usp=sharing"}'
```

**Resources:**
 - https://www.npmjs.com/package/nedb