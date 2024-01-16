const People = require('../models/People');

exports.getAllPeople = async (req, res) => {
    const { search } = req.query;
    try {
        const people = await People.find({});
        
        const filteredPeople = search ? people.filter((person) => person.name.includes(search)) : people;
    
        res.status(200).json({ people: filteredPeople});
    } catch(err) {
        res.status(500).json({ error: 'Error trying to access users!' })
    }
}

