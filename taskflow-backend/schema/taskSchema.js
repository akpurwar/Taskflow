const {z}= require('zod');

const createTasksSchema = z.object({
    title: z.string().min(2, "Project should be to char long"),
    description : z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
})

module.exports = {createTasksSchema}