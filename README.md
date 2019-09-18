Divvy
===============

Introduction
------------
Divvy is an on-demand bike hire platform. The following project contains an attached datasets that comprises of Divvy's trip data for the first few days of January 2019.
Furthermore, the project contains code that imports the JSON dataset into mongoDB. The project contains specific endpoints that are being used to solve some interesting problems.

Libraries and Prerequisite
------------
Mongodb installed and running on default port 27017. <br>
*Nodejs*, *Express*, *mongoose* installed in the directory.

Setup
------------
For importing the database values, I have written importjson.js scripts. They can be found in ~/scripts/importjson.js <br>
Run it using `node importjson.js` <br>

APIs and Routes
------------
The default route has been updated to allow `/app` to be prepended to the requests.

| endpoint | Type | Description |
|----------|------|-------------|
| `/app/common-dest` | POST | Takes argument in form of body parameter `from_station_name`. Responds with Array of common destination From station name, Users' Prevelent Age group at this station and Revenue generated at this station (object)
| `/app/top-revenue-gen` | GET | Top three revenue generating station names
| `/app/bike-repair` | GET | he Bike Ids that need repairs depending upon the pre-defined conditions

Client
------------
I managed to write curl requests that would trigger the APIs. The APIs can be tested in similar way or through `POSTMAN` client.

###TODO
`Trip duration` vs `start time` can be plotted using libraries like plotly, etc. <br>
The start time need to be converted to Unix timestamp. ```new Date("dd mm yyyy hh mm ss").getTime()``` will do the trick.
The variables can be then passed to the graph.


