require("dotenv").config();
const connectDB = require('./config/Db');
const express = require("express");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
const cors = require("cors");


const app = express(); 


connectDB().then(()=> {
    console.log("Data base connected")
    app.listen(8800, () => {
    console.log("server is successfully running on port 8800");
     });
  

}).catch((err)=> {

      console.log("DB connection failed")

})

app.use(helmet());
app.use(express.json());
app.use(cors({origin: 'https://localhost:3000', Credential: true }));
app.use(cookieparser());

app.use('/api/auth', require('./routes/authRoutes.js')); 
app.use('/api/project', require('./routes/projectRoutes.js')); 
app.use('/api/tasks', require('./routes/tasksRoutes.js')); 

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err , req ,res, next)=> {
    console.log(err);
    const status = err.status || 500 ;

    res.status(status).json({
        success: false,
        message: err.message || "Internal server error",
    })
})

module.exports =app;





