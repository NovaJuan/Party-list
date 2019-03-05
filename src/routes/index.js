const express = require('express');
const router = express.Router();
const path = require('path');
const { randomizer } = require('../helps/helpers');
const fs = require('fs-extra');

const Guests = require('../models/guest.js');

router.get('/',async (req,res)=>{
    var guests = await Guests.find();
    res.render('index',{
        guests
    });
});

router.get('/add', (req,res)=>{
    res.render('add');
});

router.post('/upload', (req,res)=>{

    const savePhoto = async function (){
        const photoUrl = randomizer();
        const images = await Guests.find({photoHash: photoUrl});
        if(images.length > 0){
            savePhoto();
        }else{
            const photoPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const photoNewPath = path.resolve(`src/public/images/uploads/${photoUrl}${ext}`);
            if(ext === '.png' || ext === '.jpeg' || ext === '.jpg' || ext === '.gif'){
                await fs.rename(photoPath, photoNewPath);
                const guest = await new Guests({
                    name: req.body.name,
                    description: req.body.description,
                    photoHash: photoUrl,
                    photoName: photoUrl + ext,
                    photoPath: photoNewPath
                });
                await guest.save();
                res.redirect('/');
            }else{
                await fs.unlink(photoPath);
                res.status(500).json({error: 'Only images are allowed(png,jpg,jpeg,gif)'});
            }
        }
    }

    savePhoto();
});

router.get('/delete/:id',async (req,res)=>{
    const {id} = req.params;
    const guest = await Guests.findById(id);
    await fs.unlink(guest.photoPath);
    await Guests.remove({_id:id});
    res.redirect('/');
});

router.get('/edit/:id',async function(req,res){
    const {id} = req.params;
    const guest = await Guests.findById(id);
    res.render('edit',{guest});
});

router.post('/update/:id',async (req,res)=>{
    const savePhoto = async function (){
        const {id} = req.params;
        const guest = await Guests.findById(id);
        await fs.unlink(guest.photoPath);
        const photoUrl = randomizer();
        const images = await Guests.find({photoHash: photoUrl});
        if(images.length > 0){
            savePhoto();
        }else{
            const photoPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const photoNewPath = path.resolve(`src/public/images/uploads/${photoUrl}${ext}`);
            if(ext === '.png' || ext === '.jpeg' || ext === '.jpg' || ext === '.gif'){
                await fs.rename(photoPath, photoNewPath);
                await Guests.update({_id:id},{
                    name: req.body.name,
                    description: req.body.description,
                    photoHash: photoUrl,
                    photoName: photoUrl + ext,
                    photoPath: photoNewPath
                });
                res.redirect('/');
            }else{
                await fs.unlink(photoPath);
                res.status(500).json({error: 'Only images are allowed(png,jpg,jpeg,gif)'});
            }
        }
    }

    savePhoto();
});











module.exports = router;