const Project = require("../models/Project");
const Task = require("../models/Task");



async function createTasks(req,res,next){

    try{

    const projectid = req.params.id;

    

    const project = await Project.findById({_id:projectid});

    if(!project){
        throw new Error("project does not exisits");
    }

    // Find current user in project members
    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    
    if(!userMember){
        throw new Error("You are not a member of this project");
    }

    // Both admin and member can create tasks
    const allowedRoles = ['admin', 'member'];
    if(!allowedRoles.includes(userMember.role)){
        throw new Error("You don't have permission to create tasks");
    }

    const {title , description ,status } = req.body;

    const tasks = await Task.create({
        title , description, projectId: projectid , assignee : req.user.id , status
    })

    res.json({
        success:true,
        data : tasks,
        message:"task created"
    });

   }catch(err){
     next(err);
   }

    

}

async function listtasksbasedonProjectid(req,res,next){

    try{
    const projectId = req.params.id;

    console.log(projectId, "modi")
    
    const {assignee ,status, page=1 , limit=20}= req.query;

    let skip = (page -1 ) * limit;

    const filter  =  { projectId: projectId};
    if(assignee) filter.assignee = assignee;
    if(status) filter.status = status;

    console.log(filter)


    const [tasks, total] = await Promise.all([ Task.find(filter).sort({createdAt : -1}).skip(skip).limit(limit).populate('assignee','name email'), Task.countDocuments(filter)]);

    res.json({
        tasks:tasks,
        pagination: {
            page : Number(page),
            limit: Number(limit),
            total,
            totalPages : Math.ceil(total/limit)
        }
    })

    
    } catch(err){
        next(err);
    }

}


async function getTask(req,res,next){
    try{

    const taskid = req.params.id;



    const task = await Task.findById(taskid).populate('assignee', 'name email').populate("projectId","title description");

    res.json({
        success:true,
        data: task
    })
    }catch(err){
        next(err);
    }

}


async function updateTask(req,res,next){
    try{

        const {version , ...updated} = req.body;

        const allowedfieldstoupdate = [ "title",
             "description","assignee",
            "status"
        ]

        let patch = {};

        for(let fields of allowedfieldstoupdate){
            if(updated !== undefined){
             patch[fields] =  updated[fields] 
            }    
        }

        // Fetch the task to get the project ID
        const task = await Task.findById(req.params.id);
        if(!task){
            throw new Error("Task not found");
        }

        // Fetch the project
        const project = await Project.findById(task.projectId);
        if(!project){
            throw new Error("Project not found");
        }

        if(patch.assignee){
            const userMember = project.members.find(m => m.user.toString() === req.user.id);
            
            if(!userMember ){
                throw new Error("Only project admins can assign tasks");
            }
        }

        const patchupdates = await Task.findOneAndUpdate(
            {_id:req.params.id , version},
             {$set:patch , $inc :{version:1}},
            {returnDocument: 'after' ,runValidators:true})

            console.log(patchupdates)

            if(!patchupdates){

              const current = await Task.findById(req.params.id);
      if (!current) return res.status(404).json({ message: 'Task not found' });
 

      return res.status(409).json({
        message: 'Task was modified by someone else. Refresh and retry.',
        currentVersion: current.version,
        current,
      });
    }

 
    res.json({ data: patchupdates });

    }catch(err){
        next(err);
    }
}


async function deleteTask(req, res, next) {
    try {

        const task = await Task.findById(req.params.id);
        if (!task) {
            throw new Error("Task not found");
        }

        // Fetch the project
        const project = await Project.findById(task.projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        let userMember = project.members.find((m) => m.user.toString() === req.user.id.toString())

         console.log(userMember)
        if (!userMember) {
            throw new Error("Only project MEMBERS can DELETE tasks");
        }

        await Task.findByIdAndDelete(task._id)

        res.json({
            success: true,
            message:"task deleted"
        })

    }








    catch (err) {
        next(err);
    }
}

async function listtasksbasedonloggedinuser(req,res,next){

    try{
  
    const { status, page=1 , limit=20}= req.query;

    let skip = (page -1 ) * limit;

    const filter  =  { assignee : req.user.id.toString()};
   
    if(status) filter.status = status;

    console.log(filter)


    const [tasks, total] = await Promise.all([ Task.find(filter).sort({createdAt : -1}).skip(skip).limit(limit).populate('assignee','name email'), Task.countDocuments(filter)]);

    res.json({
        tasks:tasks,
        pagination: {
            page : Number(page),
            limit: Number(limit),
            total,
            totalPages : Math.ceil(total/limit)
        }
    })

    
    } catch(err){
        next(err);
    }

}

module.exports = {createTasks, listtasksbasedonProjectid,getTask,updateTask,deleteTask,listtasksbasedonloggedinuser}