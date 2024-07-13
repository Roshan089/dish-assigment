const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { log } = require('console');


const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017", {
    dbName: "dishdb"
}).then(() => console.log("database connected"))
.catch((e) => console.log(e))

const dishSchema = new mongoose.Schema({
  dishId: String,
  dishName: String,
  imageUrl: String,
  isPublished: Boolean
});

const Dish = mongoose.model('Dish', dishSchema);

const io = new Server(server, {
   cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
}
,
}
)

io.on("connection", (socket) =>{
    console.log(`user connected:${socket.id}`);

    
    
})



    

 
  



app.get('/api/dishes', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});



app.post('/api/dishes/toggle', async (req, res) => {
  const { dishId } = req.body;
  const dish = await Dish.findOne({ dishId });
  if (dish) {
    dish.isPublished = !dish.isPublished;
    await dish.save();
    io.emit('update', dish);
    res.json(dish);
  } else {
    res.status(404).send('Dish not found');
  }
});





server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
