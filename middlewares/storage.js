const pet = require('../services/pet')

module.exports = () => (req,res,next)=>{

    req.storage = {
        ...pet
    }

    next();
}