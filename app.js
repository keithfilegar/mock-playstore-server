const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('common'));
app.use(cors());

const appList = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { search = "", sort, genres } = req.query;

    console.log(genres)

    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app')
        }
    }


    if(genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres))
            return res
                .status(400)
                .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
    }

    let results = appList
        .filter(app =>
            app
                .app
                .toLowerCase()
                .includes(search.toLowerCase()));
    
    if(sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }

    if(genres) {
        results = results.filter(app => 
            app.genres.toLowerCase()
            .includes(genres.toLowerCase()))

        console.log(results)
    }

    res.json(results)

}) 


app.listen(8000, () => {
    console.log('Server started on PORT 8000')
})