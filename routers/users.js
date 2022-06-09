const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');






// register route
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
});



router.post('/login', async (req, res) => {
    const user = await User.findOne({name: req.body.name})
    const secret = process.env.secret
    
    if(!user) {
        return res.status(400).send('The user not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {expiresIn : '1d'}
        )
        
        res.status(200).send({user: user.name, token: token})
    }else{
    res.status(400).send('wrong password') 
    }
    
});


module.exports = router;