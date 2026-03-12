const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const companyRoutes = require('./CompanyRoute');
const Partnerroutes=require('./Partnerroute');
const Adminroute=require('./Admin');
const Comission=require('./Commision');
const Products=require('./Products');
const Payouts=require('./Payout');
const ManagerRoute=require('./ManagerRoutes.js');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api', companyRoutes); // All routes will be prefixed with /api
app.use('/partner', Partnerroutes);
app.use('/admin',Adminroute);
app.use('/api',Comission);
app.use('/api',Products);
app.use('/api',Payouts);
app.use('/manager',ManagerRoute);

const port = 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
