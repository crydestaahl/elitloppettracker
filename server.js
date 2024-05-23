const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

// Använd cors middleware för att hantera CORS-problem
app.use(cors());

let cachedData = null;

// En funktion för att hämta data från det externa API:et
const fetchData = async () => {
    try {
        const response = await axios.get('https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=42RNFY');
        cachedData = response.data;
        console.log('Data updated successfully.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Hämta data vid serverstart och sedan var femte minut
fetchData(); // Första anropet vid serverstart
setInterval(fetchData, 5 * 60 * 1000); // Uppdatera var femte minut (300 000 millisekunder)

// En enkel route för att hämta data från det cachade datat
app.get('/api/data', async (req, res) => {
    try {
        // Returnera cachad data till klienten
        res.json(cachedData);
    } catch (error) {
        console.error('Error sending cached data:', error);
        res.status(500).json({ error: 'Could not send cached data' });
    }
});

// Starta servern
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});