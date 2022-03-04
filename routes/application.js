const express = require('express');
const router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/';
const dbName = 'divvyDB';
const Trips = require('../models/Trips');
const mongoose = require('mongoose');
mongoose.connect(mongoUrl + dbName, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

/* GET application page. */
router.get('/', function (req, res) {
	res.send('Application page');
});

router.get('/common-dest', function (req, res) {
	Trips.aggregate(
		[
			{
				$group: { _id: '$from_station_id', count: { $sum: 1 } },
			},
			{
				$sort: { count: -1 },
			},
			{
				$limit: 1,
			},
		],
		function (err, docs) {
			docs.forEach(function (doc) {
				res.send(JSON.stringify(doc));
			});
		}
	);
});

router.post('/common-dest', function (req, res) {
	let from_station = req.body.from_station_name;

	let resultArr = [];

	Trips.aggregate(
		[
			{ $match: { from_station_name: { $eq: from_station } } },
			{ $group: { _id: '$to_station_name', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 1 },
		],
		function (err, docs) {
			JSON.stringify(docs);
			resultArr.push(
				`Common Destination from - From Station =  ${docs[0]._id}`
			);
		}
	);

	Trips.aggregate(
		[{ $match: { from_station_name: { $eq: from_station } } }],
		(err, docs) => {
			let bucket = [0, 0, 0, 0];
			docs.forEach((doc) => {
				if (doc.birthyear) {
					let age = new Date(Date.now()).getFullYear() - doc.birthyear;
					switch (true) {
					case age > 0 && age <= 15:
						bucket[0] = bucket[0] + 1;
						break;
					case age > 15 && age <= 30:
						bucket[1] = bucket[1] + 1;
						break;
					case age > 30 && age <= 45:
						bucket[2] = bucket[2] + 1;
						break;
					case age > 45:
						bucket[3] = bucket[3] + 1;
						break;
					}
				}
			});
			let max_index = bucket.indexOf(Math.max(...bucket));
			let msg = '';
			switch (max_index) {
			case 0:
				msg = 'Bucket 1 (Age group 1-15) is prevalent';
				break;
			case 1:
				msg = 'Bucket 2 (Age group 16-30) is prevalent';
				break;
			case 2:
				msg = 'Bucket 3 (Age group 31-45) is prevalent';
				break;
			default:
				msg = 'Bucket 4 (Age group 46+) is prevalent';
				break;
			}
			resultArr.push(`Prevelent Age Group at this station : ${msg}`);
		}
	);

	Trips.aggregate(
		[
			{ $match: { from_station_name: { $eq: from_station } } },
			{
				$group: {
					_id: '$from_station_name',
					// eslint-disable-next-line no-sparse-arrays
					revenue: { $sum: { $multiply: ['$tripduration', , 1 / 60, 0.1] } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		],
		(err, docs) => {
			let rev = JSON.stringify(docs);
			resultArr.push(`Revenue generated at this station = ${rev} `);
		}
	);
	setTimeout(function () {
		console.log(resultArr);
		res.status(200).send(JSON.stringify(resultArr));
	}, 3000);
});

router.get('/top-revenue-gen', function (req, res) {
	Trips.aggregate(
		[
			{
				$group: {
					_id: '$from_station_name',
					revenue: { $sum: { $multiply: ['$tripduration', 1 / 60, 0.1] } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
			{ $limit: 3 },
		],
		(err, docs) => {
			let station = [];
			docs.forEach((doc) => {
				station.push(doc._id);
			});
			res
				.status(200)
				.send(
					`The Top 3 revenue generating stations are : ${JSON.stringify(
						station
					)}`
				);
		}
	);
});

router.get('/bike-repair', (req, res) => {
	Trips.aggregate(
		[
			{
				$group: {
					_id: '$bikeid',
					count: { $sum: 1 },
					duration: {
						$sum: { $multiply: ['$tripduration', 1 / 60, 1 / 1000] },
					},
				},
			},
			{ $sort: { duration: -1 } },
		],
		(err, docs) => {
			let bike_ids = [];
			docs.forEach((doc) => {
				if (doc.duration.toFixed(2) > 1.0) {
					bike_ids.push(doc._id);
				}
			});
			res
				.status(200)
				.send(
					`The Bike Ids that need repairs are : ${JSON.stringify(bike_ids)}`
				);
		}
	);
});

module.exports = router;
