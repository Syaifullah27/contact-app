const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/syehaDB',
{useNewUrlParser : true,
 useUnifiedTopology : true,
 useCreateIndex : true,
})




// menmabah 1 data
// const contact1 = new Contact({
//     nama: 'Sandhika',
//     noHP: '08343434343',
//     email: 'wpu@gmail.com',
// })


// simpan ke contact
// contact1.save().then((contact) => console.log(contact))