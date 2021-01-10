// Import dependencies
import { config } from 'dotenv';
config();
import express from 'express';
import mongoose from 'mongoose';
import './helpers/cronSetup';

// Import routes
import gameRoutes from './routes/game';
import otherRoutes from './routes/other';

// Set up the server
const app = express();
app.use(express.json());

// Set up database
mongoose
	.connect(process.env.MONGO_URI!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log(err));

// Hook up routes with server
app.use('/game', gameRoutes);
app.use('/', otherRoutes);

// Listen on specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Server running on port ' + PORT);
});

export default app;
