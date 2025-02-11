const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult,check } = require('express-validator')
const methodOverride = require('method-override')


const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')


require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// setup Method Override
app.use(methodOverride('_method'))



// gunakan ejs | setup ejs
app.set('view engine', 'ejs')
app.use(expressLayouts) // third party middlewere
app.use(express.static('public')) // build-in middlewere 
app.use(express.urlencoded({extended : true}))


// konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie : { maxAge : 6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
}))
app.use(flash())


// Halaman Home
app.get('/', (req, res) => {
    const mahasiswa = [
    {
        nama : 'syaifullah',
        email : 'syh@gmail.com',
    },
    {
        nama : 'Sandhika Galih',
        email : 'sandhikaGalih@gmail.com',
    },
    {
        nama : 'Esyeha',
        email : 'yeha48149@gmail.com',
    },]
    res.render('index', {
        nama : 'Esyeha',
        mahasiswa,
        title : 'Halaman Home',
        layout : 'layouts/main-layout',
    })
})

// Halaman About
app.get('/about',(req, res) => {
    res.render('about',{
       title : 'Halaman About', 
       layout : 'layouts/main-layout',
    })
})

// Halaman Contact
app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()

    res.render('contact', {
        title : 'Halaman Contact',
        layout : 'layouts/main-layout',
        contacts,
        msg : req.flash('msg'),
    })
})


// halaman form tambah data contact
app.get('/contact/add',(req,res) => {
    res.render('add-contact', {
        title : 'Form Tambah Data Contact',
        layout :'layouts/main-layout',
    })
})


// proses Tambah Data contact
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value })
        if(duplikat) {
            throw new Error('Nama Contact Sudah Ada!')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHP','Nomor Tidak Valid').isMobilePhone('id-ID')
], (req,res) => {
const errors = validationResult(req)
if(!errors.isEmpty()) {
    res.render('add-contact',{
        title : 'Form Tambah Data Contact',
        layout : 'layouts/main-layout',
        errors : errors.array(),
    })
}else {
       Contact.insertMany(req.body, (error, result) => {
           //  kirimkan  flash massage
            req.flash('msg', 'Data Contact Berahsil Ditambahkan')
            res.redirect('/contact')
       })
    }
})


// proses delete contact
// app.get('/contact/delete/:nama', async (req,res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama})

//     // jika contact tidak ada
//     if(!contact) {
//         res.status(404)
//         res.send('<h1>404</h1>')
//     }else{                   
//         Contact.deleteOne({_id:contact._id}).then((result)=> {
//             req.flash('msg', 'Data Contact Berahsil Dihapus')
//            res.redirect('/contact')
//         })
//     }
// })
app.delete('/contact',(req,res)=> {
    Contact.deleteOne({nama:req.body.nama}).then((result)=> {
          req.flash('msg', 'Data Contact Berahsil Dihapus')
          res.redirect('/contact')
    })
})


// form ubah data contact
app.get('/contact/edit/:nama', async (req,res) => {
    const contact = await Contact.findOne({nama:req.params.nama})
    
        res.render('edit-contact', {
            title : 'Form Ubah Data Contact',
            layout :'layouts/main-layout',
            contact,
        })
    })




// proses Data contact
app.put('/contact', [
    body('nama').custom(async(value ,{ req }) => {
        const duplikat = await Contact.findOne({nama:value})
        if(value !== req.body.oldNama && duplikat) {
            throw new Error('Nama Contact Sudah Ada!')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHP','Nomor Tidak Valid').isMobilePhone('id-ID')
],
 (req,res) => {
const errors = validationResult(req)
if(!errors.isEmpty()) {
    res.render('edit-contact',{
        title : 'Form Ubah Data Contact',
        layout : 'layouts/main-layout',
        errors : errors.array(),
        contact : req.body
    })
}else {
     Contact.updateOne(
        {_id: req.body._id},
        {
            $set:{
                nama:req.body.nama,
                email:req.body.email,
                noHP:req.body.noHP,
            },
        }
       ).then((result)=> {
           //  kirimkan  flash massage
           req.flash('msg', 'Data Contact Berahsil Diubah')
           res.redirect('/contact')
       })
    }
})


// halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })

    res.render('detail', {
        title : 'Halaman Detail Contact',
        layout : 'layouts/main-layout',
        contact,
    })
})


app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`)
})