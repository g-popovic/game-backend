// This file uses cron for deleting old "games" from the user's "recentGameDates" fields,
// as they are no longer needed for anything and only take up space.
// It runs every 24 hours at 00:00 server time
import { CronJob } from 'cron';
import User from '../models/user.model';

const job = new CronJob('0 0 0 * * *', () => {
	console.log("Cleaning up user's old game histories");
	const lastHour = new Date();
	lastHour.setMinutes(0, 0, 0);

	User.updateMany({}, { $pull: { $lt: lastHour } });
});

job.start();
