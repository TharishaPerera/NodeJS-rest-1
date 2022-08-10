const Joi = require('joi');				//validation package
const express = require('express');		//express framework
const app = express();					//use express framework

app.use(express.json());				//use json in express framework

const courses = [
	{id: 1, name: 'course1'},
	{id: 2, name: 'course2'},
	{id: 3, name: 'course3'},
];

// home
app.get('/', (req, res) => {
	res.send('Hellow World')
});

// get all courses
app.get('/api/courses', (req, res) => {
	res.send(courses)
});

// get course by id
app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if(!course)	return res.status(404).send('Course not found for given ID');
	
	res.send(course);
});

// create course
app.post('/api/courses', (req, res) => {
	const result = validateCourse(req.body);
	if(result.error) return res.status(400).send(result.error.details[0].message);
	
	const course = {
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(course);
	res.send(course);
});

// update course by id
app.put('/api/courses/:id', (req, res) => {
	//search for the course
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if(!course) return res.status(404).send('Course not found for given ID');

	//validate
	const result = validateCourse(req.body);
	if(result.error) return res.status(400).send(result.error.details[0].message);
	
	//update
	course.name = req.body.name;

	res.send(course);	
});

// delete course by id
app.delete('/api/courses/:id', (req, res) => {
	//search for course
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if(!course) res.status(404).send('Course not found for given ID');

	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
});

// function to validate inputs by using JOI package
function validateCourse(course){
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	});
	// return Joi.validate(course, schema);
	return schema.validate(course);
}

// set port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));