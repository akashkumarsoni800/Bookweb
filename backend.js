const express=require("express");
const mongoose=require ("mongoose");
const bcrypt=require ("bcryptjs");
const jwt=require ("jsonwebtoken");
const cors=require ("cors");

const app=express();
const port=5000;
const JWT_SECRET="mysecretkey"


console.log("backend started...");

// middleware 
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("backend is running");
});


app .listen(port,()=>{
    console.log(`server started at port ${port}`);
});


mongoose.connect("mongodb+srv://akashkumarsoni800:8002546764@bookweb.8tz5tqf.mongodb.net/")
.then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));
//user schema
const userschema=new mongoose.Schema({
    username:String,
    mobileno:{type:String , unique:true },
    password:String,
    address: String,
});
const user=new mongoose.model("user",userschema);

//book schema
const booschema=new mongoose.Schema({
    bookname:String,
    bookauthor:String,
    bookpublication:String,
    booklanguage:String,
    bookvolume:String,
    bookprice:Number,
})
//upload user schema
const uploadschema=new mongoose.Schema({
    yourname:String,
    mobileno:String,
    email:{type:String , unique:true },
    address:String,
})
//sign up
app.post ("/signup" , async (req,res)=>{
    const {name,mobileno,password,address}=req.body;
    try {
        const existingUser = await user.findOne({ mobileno });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = new user({ username, mobileno, password: hashedPassword, address });
        await newuser.save();
        res.json({ message: "signup successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });
    //login
    app.post ("/login" , async (req,res)=>{
        const {username,password}=req.body;
        try {
            const user = await user.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
