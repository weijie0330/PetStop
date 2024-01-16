import express, { json } from "express";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Create an app object for Express
var app = express();

// Set port number to 3000
var port = 3000;

// Set the directory file path to the project
// Good to create a file path because different computer has different filepath 
var __dirname = dirname(fileURLToPath(import.meta.url));

// Set the file path for posts.txt, faqData.txt and contactReceived.txt
var filePath = {
    posts: __dirname + "/posts.txt",
    faqData: __dirname + "/faqData.txt",
    contactReceived: __dirname + "/contactReceived.txt",
}

// Look into public folder for static file (HTML, image, CSS)
app.use(express.static("public"));

// Create a body to store data (in array) from client 
app.use(express.urlencoded({extended:true}));


// Read the posts.txt and pass the array to index.ejs
app.get("/", (req, res) => {
    var fileContent = fs.readFileSync(filePath.posts);
    var data = JSON.parse(fileContent);
    res.render("index.ejs", { data });
});


// Render about page
app.get("/about", (req, res) => {
    res.render("about.ejs")
});


// Render FAQ page and pass faqData array from faqData txt file
app.get("/faq", (req, res) => {
    // Handle errors in reading the FAQ data file
    fs.readFile(filePath.faqData,(err, data) => {
        if (err) throw err;

        // Pass Json like data to JS object
        var faqData = JSON.parse(data);
        res.render("faq.ejs", { faqData });
    })
});


// Render contact page
app.get("/contact", (req, res) => {
    res.render("contact.ejs")
});


// Handle user submission from the contact form, add the data to an array, and save it in a text file
app.post("/contact/submit", (req, res) => {

    // Store the data received from client in array
    var contactReceived = req.body;

    // Read the contactReceived txt file
    var fileContent = fs.readFileSync(filePath.contactReceived, "utf8");

    try {
        var existingArray = JSON.parse(fileContent);

        // Modify the object (add the new item to the array)
        existingArray.push(contactReceived);
      
        // Stringify the modified object
        var updatedContent = JSON.stringify(existingArray);
      
        // Append the stringified object to the file
        fs.writeFileSync(filePath.contactReceived, updatedContent + '\n', 'utf8');
        
        console.log('Message has been sent successfully!');
        res.send("Submit Successful")

      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
})  


// Render add post page
app.get("/addpost",(req, res) =>{
    res.render("addpost.ejs")
})


//  Handle user submission from the add post form, append the new post with creation date to the existing array, and save it in a text file
app.post("/addpost/submit",(req, res) => {
    var newPost = req.body;
    
    var fileContent = fs.readFileSync(filePath.posts, "utf8");

    try{
        // Create date
        var date = new Date();
        // format the date (numeric: number , long: words)
        var format = { year: "numeric", month: "long", day: "numeric"};
        // A method to format date
        var formattedDate = date.toLocaleDateString('en-US', format);
        // Add the date of posting as object to the array of data received
        newPost.date = formattedDate;


        // Convert the array from posts.txt to JS array
        var existingArray = JSON.parse(fileContent);
        // Add the new item to the array
        existingArray.push(newPost);
        // Stringify the the array to JSON format
        const updatedPosts = JSON.stringify(existingArray);
        // Write the array to the file (posts.txt)
        fs.writeFileSync(filePath.posts,updatedPosts + "\n" , "utf8");
        
        console.log('Post added successfully!');
        res.send("Added Successful")

    } catch (error) {
        console.error('Error parsing JSON:', error.message);
    }
})


// Render update page
app.get("/updatepost",(req, res) => {
    res.render("updatepost.ejs")
})


// Handle updating a post by checking its title; if a match is found, update the content
app.post("/updatepost/submit", (req, res) => {
    var updateObject = req.body;

    var fileContent = fs.readFileSync(filePath.posts,"utf8");
    var existingArray = JSON.parse(fileContent);

    for (var i=0; i < existingArray.length; i++){
        if (updateObject.postTitle === existingArray[i].postTitle){
            existingArray[i].postContent = updateObject.postContent;

            console.log("Updated successfully")
        } 
    }

    var updatedContent = JSON.stringify(existingArray);
    fs.writeFileSync(filePath.posts,updatedContent,"utf8");
    res.send("Update Successful");
})


// render delete page
app.get("/deletepost", (req, res) => {
    res.render("deletepost.ejs")
})


// Handle post deletion by entering the title; if a match is found in the array, delete the post along with its data
app.post("/deletepost/submit",(req, res) => {
    var deleteObject = req.body;

    var fileContent = fs.readFileSync(filePath.posts);
    var existingContent = JSON.parse(fileContent);

    for (var i=0; i < existingContent.length;i++){
        if (deleteObject.postTitle === existingContent[i].postTitle){
            existingContent.splice(i,1);
            break;
        }
    }

    var updatedContent = JSON.stringify(existingContent);
    fs.writeFileSync(filePath.posts,updatedContent,"utf8")

    res.send("Post deleted successfully");
});


// listen to any instruction such as click/ keydown from client side
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});