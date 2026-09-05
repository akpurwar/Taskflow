const express = require('express');
const validate = require('../middleware/validate');
const { createTasksSchema } = require('../schema/taskSchema');
const { createTasks, listtasksbasedonProjectid, getTask,updateTask, deleteTask, listtasksbasedonloggedinuser } = require('../controller/tasksController');
const { authMiddleWare } = require('../middleware/authMiddleware');
const { rbacProjectMember } = require('../middleware/rbacProjectMiddleware');


const router = express.Router();

router.use(authMiddleWare);

router.post('/:id', validate(createTasksSchema), rbacProjectMember , createTasks);

router.get('/:id/tasks' ,listtasksbasedonProjectid);

router.get("/mytasks", listtasksbasedonloggedinuser);

router.get('/:id',  getTask);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);




module.exports = router;