const router = require("express").Router();
const Contacts = require("../models/Contacts");
const fetchuser = require('../middleware/JWT')
const csvtojson = require("csvtojson");
const multer = require("multer");
const mongoose = require('mongoose');

//multer
const FileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const fileArr = file.originalname.split(".");
    cb(null, file.fieldname + Date.now() + "." + fileArr[fileArr.length - 1]);
  },
});

const upload = multer({ storage: FileStorage });

//post the contacts through csv
router.post("/contactpost", fetchuser, upload.single("file"), async (req, res) => {
  console.log(req.file);
  const file = req.file;
  await csvtojson()
    .fromFile(`./public/uploads/${file.filename}`)
    .then((csvdata) => {
      console.log(csvdata);
      // Contacts.user = req.user._id;
      lengthCsv = csvdata.length;
      for (let i = 0; i < lengthCsv; i++) {
        const newContact = new Contacts({
          name: csvdata[i].name,
          designation: csvdata[i].designation,
          company: csvdata[i].company,
          industry: csvdata[i].industry,
          email: csvdata[i].email,
          phoneNumber: csvdata[i].phoneNumber,
          country: csvdata[i].country,
          user: req.user._id,
        });
        newContact.save();
      }
    });
    if (req.file) {
      res.json({
        message: "file uploaded",
      });
    }
    else{
      res.json({
        message: "file not uploaded",
      });
    }
//   res.json({ message: "success" });
});


    

//fetch contacts

router.get("/mycontacts", fetchuser, async (req, res) => {
  try {
    const mycontacts = await Contacts.find({ user: req.user._id }).populate(
      "user",
      "-password"
    );
    console.log(mycontacts);
    return res.status(200).json({
      contacts: mycontacts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }

}
);

//delete a contact

// router.delete()


//update the contacts
router.put('/contactupdate/:id', async function (req, res) {
  const {name, designation, company, industry, email, phonenumber, country} = req.body;
  try {const newpost = {};
  if (name) {
    newpost.name = name;
  }
  if (designation) {
    newpost.designation = designation;
  }
  if (company) {
    newpost.company = company;
  }
  if (industry) {
    newpost.industry = industry;
  }
  if (email) {
    newpost.email = email;
  }
  if (phonenumber) {
    newpost.phonenumber = phonenumber;
  }
  if (country) {
    newpost.country = country;
  }
  //----------------------
  let contact = await Contacts.findById(req.params.id);
  if (!contact) {
    return res.status(404).send("Not Found");
  }
  if (contact.user.toString() !== req.user._id) {
    return res.status(401).send("Not Allowed");
  }
  contact = await Contacts.findByIdAndUpdate(
    req.params.id,
    { $set: newpost },
    { new: true }
  );
  res.json({ contact });
    
  } catch (error) {
    console.error(error)
    res.status(404).send("Internal error occurred")
  }
})


router.delete("/contact", fetchuser, async (req, res) => {
  console.log("Inside delete");
  console.log(req.body);
  
  try {
      const cont = await Contacts.findById(req.body._id);
      await Contacts.findByIdAndDelete(req.body._id);
      res.json({
        status: "sucess",
        data: req.body,
      });
  } catch (e) {
    res.status(403).json({
      status: "failed",
      message: e.message,
    });
  }
});

router.delete("/bulkDeleteContacts", fetchuser, async(request, response) => {
  try{
    for (let contactToDelete of request.body.contactsToDelete) 
      await Contacts.findByIdAndDelete(contactToDelete._id);      
    
    return response.json({
      status: "sucess",
    });
  }
  catch(e) {
    return response.status(500).json({
      status: "failed",
      message: e.message
    });
  }
});

//delete the contact
router.delete('/contactdelete/:id', fetchuser, async function(req, res){
  try {
    let contact = await Contacts.findById(req.params.id);
    if (!contact) {
      return res.status(404).send("Not Found");
    }
    // console.log(req.user)
    if (contact.user.toString() !== req.user._id) {
      return res.status(401).send("Not Allowed");
    }
    contact = await Contacts.findByIdAndDelete(req.params.id);
    res.json({ Success: "Deleted the post", contact });
  } catch (error) {
    // checking for errors
    console.error(error.message);
    res.status(500).send("Internal Error Occurred");
  }
})
module.exports = router;
