var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');


var coursesData = [
    {
        id: 1,
        title: 'Nodejs',
        author: 'Andrew Mead',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, and more!',
        topic: 'Node.js',
        url: 'http://study.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB',
        author: 'Brad Traversy',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, and more! 2', topic: 'Node.js',
        url: 'http://study.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'http://study.com/courses/understand-javascript/'
    }
];


var app = express();

// GraphQL schema
var schema_2 = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        createCourseTopic(course: CourseInput!): [Course]
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }

    input CourseInput {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }

`);

var getCourse = function (args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}
var getCourses = function (args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function ({ id, topic }) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

var createCourseTopic = function (args) {
    var course = args.course;
    coursesData.push(course);
    return coursesData;
}
var root_2 = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    createCourseTopic: createCourseTopic
};

app.use('/graphql2', express_graphql({
    schema: schema_2,
    rootValue: root_2,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));