const express = require("express");
const fs = require("fs");
const path = require("path");

//Instance of express js
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const dbPath = path.join(__dirname, "db.json");

//home page
app.get("/", (req, res) => {
res.render('index')
});

//Adding the todo
app.post("/add", (req, res) => {
  const { day, todo ,id} = req.body;
  const newTodo={
    id:id,
    day:day,
    todo:todo
  }
//reading the data of db
  fs.readFile(dbPath,"utf8",(err,data)=>{
    if(err){
        res.send("server problem")
    }
    let todos=data ? JSON.parse(data) : []
    todos.push(newTodo)
    let newData=JSON.stringify(todos,null,2)
    
    //writing data to database
    fs.writeFile(dbPath,newData,(err,data)=>{
        if(err){
            res.status(500).send("server problem")
        }
    
        res.redirect('/show')
    })
    })    
});

//SHOWING data to users
app.get('/show',(req,res)=>{

  //reading the data
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("sever problem");
    }
    let todoData = data ? JSON.parse(data) : [];//string into js object
    res.render('todos',{
        todos:todoData
    }) 
});
})
// Deleting the todo
app.delete('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  
  // Reading the data from db
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Server problem while reading data");
    }
    
    let todos = data ? JSON.parse(data) : [];
    todos = todos.filter((d, i) => i !== id);

    // Writing the new data to the db
    fs.writeFile(dbPath, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Server problem while writing data");
      }

      // Sending success message only after file is successfully written
      res.json({
        "msg": "Todo deleted",
        "id": id
      });
    });
  });
});


app.listen(1111, () => console.log("sever started."));
