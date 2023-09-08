const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models')

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

require('./routes/tank.routes')(app);

db.sequelize.sync({ })
    .then(() => {
        console.log('Database ready for use')})
    .catch(() => {
        console.log('Database Error')
    });


app.listen(8000, () => {
    console.log('Listening at port 8000')
});

