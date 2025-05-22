const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const Chats = require("./models/message.js");
const methodOverride = require("method-override");
const { randomUUID } = require("crypto");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

const Groq = require("groq-sdk") ;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });






app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

maindb().then(()=>{
    console.log("connected succesfully");
})

.catch(err => console.log(err));

async function maindb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/medai');

  
}


app.get("/", (req, res)=>{
  let sessionId = uuidv4();

    res.render("main.ejs", {sessionId});
});
app.get("/:sessionId", async (req, res)=>{
  let {sessionId} = req.params;
  const chats = await Chats.find({sessionId});
  console.log(chats);
  
  res.render("home.ejs", {chats, sessionId});
  
  
})

app.post("/chat/:sessionId", async (req, res)=>{
  let {sessionId} = req.params;
 
  const chats = await Chats.find({sessionId});
  
  let message = req.body.message;
  console.log(message);
  console.log(sessionId);
  async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
  let msg = chatCompletion.choices[0]?.message?.content || ""; 
  console.log("Sent by Bot");
  let chat = new Chats({
    message: msg,
    sender: "bot",
    sessionId: sessionId,
    created_at: new Date(),

  })
  chat.save().then((res)=>{
   console.log(res);
  })
  res.redirect(`/${sessionId}`);
  
  

}


  async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
  }
  
  
  let chat = new Chats({
    message: message,
    sender: "user",
    sessionId: sessionId,
    created_at: new Date(),

  })
  chat.save().then((res)=>{
   console.log(res);
  })

  main(); 
  

})

// let chat = new Chats({
//   message: "How Are You?",
//   sender: "user",
//   sessionId: "ggg",
//   created_at: new Date(),

// })
// chat.save().then((res)=>{
//   console.log(res);
// })

app.listen(8080, ()=>{
    console.log("Server is listening");
})
