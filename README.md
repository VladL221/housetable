### Hospital for adorable pets

To start run the following command: `npm run start`
To add a new patient use the following api as a post request: `YOUR-DOMAIN/api/patient/` and the request body should be as follows:
`{'petName': 'goodboi', 'petType': 'husky', 'petOwner': 'baba-G', 'petOwnerAddress': 'beer sheva', 'petOwnerPhone': '010101010'}`

Getting a list of all patients in the hospital use a get request as follows: `YOUR-DOMAIN/api/patient/`

Update patient details use the following put request as follows: `YOUR-DOMAIN/api/patient/` body: `{ petName: 'goodboi', petType: 'husky', petOwner: 'baba-G', petOwnerAddress: 'tel aviv', petOwnerPhone: '010101010', ObjectId: "object id" }` anything can be updated except the pet name

Delete patient details use the following delete request : `YOUR-DOMAIN/api/patient/` body: `{ ObjectId: 'ObjectId', }`

To add an appointment use the following api call as a post: `YOUR-DOMAIN/api/appointment/` body: `{ startTime: '2022-04-19T15:00:49+09:00', endTime: '2022-04-19T16:00:49+09:00', description: 'Dog is in urgent need of snackies', feePaid: 50, currency: "BTC", amount: 50, objectId: 'objectId', }`

Get a list of all appointments for a specific patient use the following api as get: `YOUR-DOMAIN/api/appointment/patient/` body: `{ objectId: 'objectId', }`

Update appointment details use a put api call as follows: `YOUR-DOMAIN/api/appointment/` body: `{ startTime: '2022-09-21T11:00:49+09:00', endTime: '2022-09-21T18:00:49+09:00', description: 'Doggie received lotsa pets so he good', feePaid: 25, currency: "USD", amount: 25, objectId: 'objectId', }`

Delete appointment details use the following delete api call: `YOUR-DOMAIN/api/appointment/` body: `{ ObjectId: appointment['_id'] }`

Get a list of appointments for a specific day use the following api call as a get: `YOUR-DOMAIN/api/appointment/day` body: `{ dayQuery: '2022-04-17' }`

Get a list of unpaid appointments use the following api call as a get: `YOUR-DOMAIN/api/appointment/unpaid`

Get a remaining bill for a specific patient use the following api call as a get: `YOUR-DOMAIN/api/appointment/remainingBill` body: `{ ObjectId: 'ObjectId' }`

### This api call works for the week that you are in week 1 week 2 week 3 etc... same for the month

Get the weekly and monthly amount paid, unpaid and balance of hospital in dollars use the following api call as a get: `YOUR-DOMAIN/api/appointment/month` `YOUR-DOMAIN/api/appointment/week`

Get the most popular pet type, and how much money the hospital makes from each pet type use the following api call as get: `YOUR-DOMAIN/api/appointment/populartype`

To clean the built folder run the following command: `npm run clean`
