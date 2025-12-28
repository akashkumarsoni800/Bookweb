const express=require("express");
const mongoose=require ("mongoose");
const bcrypt=require ("bcryptjs");
const jwt=require ("jsonwebtoken");
const cors=require ("cors");

const app=express();
const port=process.env.PORT ||5000;
const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecret";

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


mongoose.connect("mongodb+srv://akashkumarsoni800:8002546764@bookweb.8tz5tqf.mongodb.net/bookweb")
.then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));
//user schema
const userSchema=new mongoose.Schema({
    name:{type: String, required:true},
    mobileno:{type:String , unique:true },
    password:String,
    address: String,
});
const User= mongoose.model("User",userSchema);

//book schema
const bookSchema=new mongoose.Schema({
    bookname:String,
    bookauthor:String,
    bookpublication:String,
    booklanguage:String,
    bookvolume:String,
    bookprice:Number,
    user:{ 
    name:String,
    mobileno:String,
    email:{type:String , unique:true },
    address:String,
    }
})
const Book = mongoose.model("Book", bookSchema);

/*upload user schema
const uploadUserSchema=new mongoose.Schema({
    name:String,
    mobileno:String,
    email:{type:String , unique:true },
    address:String,
})
const UploadUser = mongoose.model("UploadUser", uploadUserSchema);*/
// Upload Book
app.post("/upload-book", async (req, res) => {
  try {
    const { bookname, bookauthor, bookpublication, booklanguage, bookvolume, bookprice,user } = req.body;

    const newBook = new Book({
      bookname,
      bookauthor,
      bookpublication,
      booklanguage,
      bookvolume,
      bookprice,
        
    user,
     /* name,
      mobileno,
      email,
      address,*/
    });

    await newBook.save();
    res.json({ message: "Book uploaded successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error uploading book", error: error.message });
  }
});
// Get all books (latest first)
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ _id: -1 }); // newest book upar
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//sign up
app.post ("/signup" , async (req,res)=>{
    const {name,mobileno,password,address}=req.body;
    try {
        const existingUser = await User.findOne({ mobileno });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, mobileno, password: hashedPassword, address });
        await newUser.save();
         const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "signup successful", token, name: newUser.name });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    });
    //login
    app.post ("/login" , async (req,res)=>{
        const {mobileno,password}=req.body;
        try {
            const existingUser = await User.findOne({ mobileno });
            if (!existingUser) {
                return res.status(400).json({ message: "User not found" });
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);
            res.json({ message: "Login successful", token, name: existingUser.name });
        } catch (error) {
            res.status(500).json({ message:"Server error", error: error.message });
        }
    });
