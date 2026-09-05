const mongoose = require("mongoose");
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

//         const user = await User.create({
//     name: 'Akash',
//     email: 'akash@example.com',
//     passwordHash: 'temporary_hash_for_testing',
//   });
//   console.log('User created:', user._id.toString());
 
//   const project = await Project.create({
//     name: 'TaskFlow Demo Project',
//     owner: user._id,
//     members: [{ user: user._id, role: 'admin' }],
//   });
//   console.log('Project created:', project._id.toString());
 
//   const task = await Task.create({
//     title: 'Set up auth routes',
//     projectId: project._id,
//     assignee: user._id,
//     status: 'todo',
//   });
//   console.log('Task created:', task._id.toString());
 
    }catch(err){
        console.log("Failed to connect db", err.message);
        process.exit(1);

    }

    }
    
module.exports = connectDB;