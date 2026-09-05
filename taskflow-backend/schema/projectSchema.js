const {z}= require('zod');

const createProjectSchema = z.object({
    name: z.string().min(2, "Project should be to char long"),
    description : z.string().optional()
})

const updateProjectSchema = z.object({
    name: z.string().min(2, "Project should be to char long"),
    description : z.string().optional()
})

const addMemberSchema = z.object({
  user: z.string().min(1, 'userId is required'),
  role: z.enum(['admin', 'member']).default('member'),
});


module.exports = {createProjectSchema,updateProjectSchema,addMemberSchema};