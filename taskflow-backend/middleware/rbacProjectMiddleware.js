const Project = require("../models/Project");


async function rbacProjectAdmin(req,res,next){

    try{


    const projectid = req.params.id;

    const projects = await Project.findById({_id :projectid})

   

    if(!projects){
        throw new Error("Project not found");
    }

    let isowner ; 
    let isadmin; 



    isowner = projects.owner.toString() === req.user.id;
    isadmin = projects.members.some(
      (m) => m.user.toString() === req.user.id && m.role === 'admin'
    );

  

    if(!isowner || !isadmin){
        throw new Error("Admin or owner acesss required");
    }

    req.projects = projects;

    next();

    }catch(err){
        next(err);
    }
      
}

async function rbacProjectMember(req,res,next){

    try{

    const projectid = req.params.id;

    const projects = await Project.find({projectid});

    if(!projects){
        throw new Error("Project not found");
    }

    let isowner ; 
    let member; 

    isowner = projects.owner.toString() === req.user.id;
    member = projects.some((project)=> project.members.map((m)=> m.user === req.user.id));

    if(!isowner || !member){
        throw new error("member or owner acesss required");
    }

    req.projects = projects;

    next();

    }catch(err){
        next(err);
    }
      
}


module.exports = {rbacProjectAdmin , rbacProjectMember};