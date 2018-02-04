import express from 'express';
import api from './routes';

const app = express();
const port = process.env.PORT || 5000;

app.use('/', express.static(`${__dirname}/../../client/build`));
app.use('/api', api);

app.listen(port, () => console.log(`Listening on port ${port}`));