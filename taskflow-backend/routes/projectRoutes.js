const express = require('express');
const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema, addMemberSchema } = require('../schema/projectSchema');
const { createProject, listProject,projectbyid, updateproject, deleteproject ,addMembers} = require('../controller/projectController');
const { authMiddleWare } = require('../middleware/authMiddleware');
const { rbacProjectAdmin, rbacProjectMember } = require('../middleware/rbacProjectMiddleware');


const router = express.Router();


router.use(authMiddleWare);


router.post("/create", validate(createProjectSchema) , createProject);
router.get("/projects", listProject);
router.get("/projects/:id",rbacProjectAdmin,projectbyid);
router.patch("/projects/:id",rbacProjectAdmin, validate(updateProjectSchema), updateproject);
router.delete("/projects/:id",rbacProjectAdmin, deleteproject);
router.post("/projects/:id/members", rbacProjectAdmin,validate(addMemberSchema) , addMembers)


module.exports = router;