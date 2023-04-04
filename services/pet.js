const Pet = require('../models/Pet');

async function getAllPets(){
    return Pet.find().populate('owner').lean();
}

async function getPetById(id){
    return Pet.findById(id).populate('owner').lean();
}

async function createPet(petData){
    const pet = new Pet(petData);

    await pet.save();

    return pet;
}

async function comment(userId, petId, comment){
    const pet = await Pet.findById(petId);
    pet.commentList.push({userId, comment});
    return pet.save();
}

async function editPet(id, petData){
    const pet = await Pet.findById(id);

    pet.name = petData.name;
    pet.imageUrl = petData.imageUrl;
    pet.age = petData.age
    pet.description = petData.description;
    pet.location = petData.location;

    return pet.save();

}

async function deletePet(id){
    return Pet.findByIdAndDelete(id);
}

async function commentPet(petId, userId){
    const pet = await Pet.findById(petId);

    pet.commentList.push(userId);

    return pet.save();
}

module.exports ={
    getAllPets,
    getPetById,
    createPet,
    editPet,
    deletePet,
    comment,
    commentPet
}