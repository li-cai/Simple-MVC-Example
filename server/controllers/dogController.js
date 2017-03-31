// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Dog = models.Dog.DogModel;

const defaultData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAdded = new Dog(defaultData);

const createDog = (req, res) => {
  const { name, age, breed } = req.body;

  if (!name || !age || !breed) {
    return res.status(400).json({ error: 'name, age and breed are all required' });
  }

  const dogData = { name, age, breed };
  const newDog = new Dog(dogData);

  const savePromise = newDog.save();
  savePromise.then(() => {
    lastAdded = newDog;
    res.json({ name: lastAdded.name, breed: lastAdded.breed, age: lastAdded.age });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};

const searchDog = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    const dog = doc;
    dog.age++;

    const savePromise = dog.save();
    return savePromise.then(() => {
      res.json({ name: dog.name, breed: dog.breed, age: dog.age });
    });
  });
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };
  readAllDogs(req, res, callback);
};

module.exports = {
  createDog,
  searchDog,
  page4: hostPage4,
};
