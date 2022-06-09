const {Profile} = require('../models/profile')
const express = require('express');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function( req,  file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb){
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage})


router.post('/',uploadOptions.single('image'), async(req, res)=>{
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
let profile = new Profile({
name:req.body.name,
staffNumber:req.body.staffNumber,
rank:req.body.rank,
reportingTo:req.body.reportingTo,
birthCertificate:`${basePath}${fileName}`,
bscHndCertificate:`${basePath}${fileName}`,
nyscCertificate:`${basePath}${fileName}`,
nimcIdentification:`${basePath}${fileName}`,
cv:`${basePath}${fileName}`,
others:`${basePath}${fileName}`,
})
profile = await profile.save();
    
    if(!profile)
    return res.status(404).send('profile cannot be establish')

    res.send(profile);
});

//to update staff details
router.put('/:id', async(req, res)=>{

    let profile = await Profile.findByIdAndUpdate( req.params.id,{
    name:req.body.name,
    staffNumber:req.body.staffNumber,
    rank:req.body.rank,
    reportingTo:req.body.reportingTo,
    birthCertificate:req.body.birthCertificate,
    bscHndCertificate:req.body.bscHndCertificate,
    nyscCertificate:req.body.nyscCertificate,
    nimcIdentification:req.body.nimcIdentification,
    cv:req.body.cv,
    others:req.body.others
    },{new: true})
    
        if(!profile)
        return res.status(404).send('profile cannot be updated')
        
        res.send(profile);
    });
    
    
    //update gallery
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
         {
            
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!profile)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(profile);
    }
);



// find staff individually by staff id or name
router.post('/staff', async (req, res) => {
    const staff = await Profile.findOne({staffNumber: req.body.staffNumber})
    
    if(!staff) {
        return res.status(400).send('The user not found');
    }
    return res.status(200).send(staff);
})

//get full staff list
router.get('/', async(req, res)=>{
    const profileList = await Profile.find();

    if(!profileList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(profileList);
});


//this is use to get the number of in organisation
router.get(`/count`, async (req, res)=>{
    const profileCount = await Profile.countDocuments()
    
    if(!profileCount) {
        res.status(500).json({success: false,})
    }

    res.send({profileCount: profileCount})
} );


//delete individual staff
router.delete('/:id', (req, res)=>{
    Profile.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success: true, message: 'The profile has been deleted'})
        }else {
            res.status(404).json({success: false, message: 'profile not found' })
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
});


module.exports = router;