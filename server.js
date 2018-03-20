//SERVER
//connect mongodb server: mongod --dbpath data/db   -> localhost:27017   connect server
//npm install mongodb --save
//npm install mongoose --save
//npm install express
//npm install body-parser
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,// import Schema
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'); //this is for app.post to stringify object from react

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


mongoose.connect('mongodb://localhost/data/db/');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("Connected to db at /data/db/  ^_^")
})
app.listen(8081); //posgresSQL is listening 8080

app.use(function (req, res, next) {  //prevent "fail to load localhost"->"Access-Control-Allow-Origin" in localhost 
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type'); next();
}) //Browsers does not allowed you to talk to multiple servers. you can use the above codes or turn on / off chrome extension 'cors' (green button)
//------- Model-------- Schema constructor
let todoListSchema = new Schema({
    todo: String,
    done: Boolean
})
let TodoItems = mongoose.model('TodoItems', todoListSchema); //TodoItems is the connection point to talk to mongo
//Schema is just defining what types of objects like string, boolean and number

// let newTodoItems = TodoItems({
//     todo: 'Learn React',
//     done: false
// })

//-------Web API  & Mongoose --------


//Get All todos
app.get("/todolist", (req,res)=>{
    TodoItems.find((err,allItems)=>{
        if(err){
            res.send(err);
        }
    })
             .then((allItems)=>{
                console.log(allItems)
                res.json(allItems)
                
            })
})

app.post("/add",(req,res)=>{
    console.log(req.body) //request is from client side
    let newTodo = req.body
    let newTodoItems = TodoItems(newTodo)    
    newTodoItems.save()
                .then((addResult)=>{
                    res.json(addResult) //express only send response to client one time, cannot have multiple responses in here
                    console.log(addResult)
                    console.log('New todo is added.')
                    // console.log(req.body.todo)
                })
                .catch(err=>{
                    console.log(err);
                })
})

app.post("/done", (req,res)=>{
    console.log(req.body)
    // let done = req.body
    // let doneTodo = TodoItems(done)
    TodoItems.findByIdAndUpdate(req.body)
            .then((doneResult)=>{
                res.json(doneResult)
                console.log(doneResult)
                console.log('Done todo')
            })
})

app.delete("/delete",(req,res)=>{
    // let removeItem = req.params.id
    // let DeleteTodos = TodoItems(req.body)

    DeleteTodos.findByIdAndRemove(req.params.id)
             .then(removeResults =>{
                console.log(removeResults)
                console.log('removed')
             })
})



// newTodoItems.save()
//             .then((addTodo)=>{
//                 console.log(' new item added.')
//             })
//             .catch(err=>{
//                 console.log(err);
//             })

// let query = { '_id': '5a0f77bb0364e8126df0b276' }    
// let doc = { todo:'Do laundry', done: false}  
// let query = { '_id': '5a0f780c5c651812d04b2fcf' }
// let doc = { todo: 'Learn React', done: false }
// let options = {
//     new: true, 
//     runValidators: true 
// }  
// TodoItems.findOneAndUpdate(query, doc, options)
//          .then((updateItems) => {
//              console.log(updateItems)
//              console.log('Update items')
//          }).catch(err => {
//              console.log(err)
//          })

// TodoItems.findById('5a0f77f335c8e412b82f8d4b').then((foundItem) => {
//         console.log(foundItem)
//         console.log('foound here')
//     })

// let remove = { todo: 'Do luandry'}         
// let remove = { done: false}         
// TodoItems.findOneAndRemove(remove)
//          .then(removeItems =>{
//              console.log(removeItems)
//              console.log('removed')
//          })

// let removeItems = {todo: 'Go to parties'} //remove all items that match values
// TodoItems.remove(removeItems)
//          .then(removeResult=>{
//              console.log(removeResult)
//              console.log('removed')
//          })
