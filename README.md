# fta-dev

This repository will contain the code for any software which gets developed for the From the Ashes III forum game. If there are multiple projects it may instead be used as an index for repositories.

## Projects
A brief list of projects which may be applicable for development:

 - interactive map
 - combat simulator
 - fleet/shipbuilder


## Deployment
So basically for these projects to be at all useful we obviously need a way to deploy them so they are available for players. There are two big options here:

 - Virtual Private Server: this would be a server that hosts the projects which can be connected to from the open internet
   - Pros: we would have total control over the code base that we want to deploy here, how it gets served, etc.
   - Cons: not free, quite a bit of overhead with setting up the server on top of the actual development efforts
  
 - Google Workspace: this would mostly rely on creating addons to different Google things (drive, sheets, docs, etc.) so that players can access the addons
   - Pros: free*, players are already familiar with Google products, no real development overhead
   - Cons: we would only be able to work with the APIs made available by Google for its workspace extensions. Also we need to set up a Google authentication project

*technically you need a Google developer's license to "publish" Workspace addons but I already have one from a while ago I think

**Resources:**
 - https://github.com/explorercorps/explorercorps.github.io
 - https://github.com/BrettlesSr/roas-ang-map
