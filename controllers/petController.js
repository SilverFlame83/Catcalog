const router = require("express").Router();
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");
const user = require("../services/user");

router.get("/create", async (req, res) => {
  res.render("create");
});

router.post("/create", isUser(), async (req, res) => {
  try {
    const petData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      age: req.body.age,
      description: req.body.description,
      location: req.body.location,
      owner: req.user,
    };

    await req.storage.createPet(petData);

    res.redirect("/pet/catalog");
  } catch (err) {
    console.log(err.message);

    const ctx = {
      errors: parseError(err),
      petData: {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location,
      },
    };

    res.render("create", ctx);
  }
});

router.get("/catalog", async (req, res) => {
  const pets = await req.storage.getAllPets();

  res.render("catalog", { pets });
});

router.get("/details/:id", async (req, res) => {
  const pet = await req.storage.getPetById(req.params.id);
  let creatorAndComment = pet.commentList;

  let creatorsName = [];
  for (let i of creatorAndComment) {
    let creator = await user.findById(i.userId);
    creatorsName.push({ creator: creator.username, comment: i.comment });
  }
  pet.isOwner = req.user && req.user._id == pet.owner._id;
  pet.isNotOwner = req.user && req.user._id != pet.owner._id;
  res.render("details", { pet, creatorsName });
});

router.post("/details/:id", async (req, res) => {
  const comment = req.body.comment;

  await req.storage.comment(req.user._id, req.params.id, comment);
  //console.log(req.params.id);
  res.redirect(`/pet/details/${req.params.id}`);
});

router.get("/delete/:id", isUser(), async (req, res) => {
  try {
    const pet = await req.storage.getPetById(req.params.id);

    if (pet.owner != req.user._id) {
      throw new Error("Not the owner can not delete!");
    }
    //console.log(pet)
    await req.storage.deletePet(req.params.id);
    res.redirect("/pet/catalog");
  } catch (err) {
    console.log(err.message);
    res.redirect("/pet/details/" + req.params.id);
  }
});

router.get("/edit/:id", isUser(), async (req, res) => {
  try {
    const pet = await req.storage.getPetById(req.params.id);

    // if (pet.owner != req.user._id) {
    //   throw new Error("Not the owner can not edit!");
    // }

    res.render("edit", { pet });
  } catch (err) {
    console.log(err.message);
    res.redirect("/pet/details/" + req.params.id);
  }
});

router.post("/edit/:id", isUser(), async (req, res) => {
  try {
    // const pet = await req.storage.getPetById(req.params.id);

    // if (pet.owner != req.user._id) {
    //   throw new Error("Not the owner can not edit!");
    // }
    await req.storage.editPet(req.params.id, req.body);

    res.redirect("/pet/details/" + req.params.id);
  } catch (err) {
    const ctx = {
      errors: parseError(err),
      pet: {
        _id: req.params.id,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location,
      },
    };
    res.render('edit', ctx)
  }
});

router.all('*', (req, res) => {
  res.render('404')
})

module.exports = router;
