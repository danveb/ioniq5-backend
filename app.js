const express = require('express') 
const axios = require('axios') 
const cors = require('cors') 
const app = express()

const ExpressError = require("./expressError")

app.use(express.json()) // parse body as JSON 
app.use(cors()) // use CORS 

app.get('/', (req, res) => {
    res.status(200).send();
})

app.get('/finder', async (req, res) => {
    const zip = req.query.zip
    const year = req.query.year
    const model = req.query.model
    const radius = req.query.radius

    const url = "https://www.hyundaiusa.com/var/hyundai/services/inventory/vehicleList.json?zip=" + zip + "&year=" + year + "&model=" + model + "&radius=" + radius 

    const INVENTORY_REFERER_HEADER = "https://www.hyundaiusa.com/us/en/vehicles"

    const options = {
        method: "GET",
        headers: {
            Referer: INVENTORY_REFERER_HEADER
        }
    }

    const response = await axios.get(url, options)
    const { data } = response.data 
    res.send(data) 
})

/** 404 handler */
app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
});

/** Server startup */
app.listen(3000, function () {
  console.log("Listening on 3000");
});