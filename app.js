const express = require('express')
var mongoose = require('mongoose');
const app = express()
const port = 8000
const cors = require('cors');
const postRoutes = require('./routes/post/post.routes');

mongoose.connect("mongodb://localhost:27017/assignment",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));;

app.use(cors());
app.use(express.json());

app.use(require("./routes"));
app.use("/api",postRoutes)

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

process.on('SIGINT', async function () {
    await mongoose.disconnect();
    process.exit(0)
});