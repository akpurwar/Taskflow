const { success } = require("zod");
const Project = require("../models/Project");





async function createProject(req,res,next){


    try{

    const {name , description } = req.body;

    const project  = await Project.create({
        name, description , owner : req.user.id , members: [{user: req.user.id , role : "admin"}]
    })

    res.json({
        success:true,
        data : project,
        message:"project created"
    });


}catch(err){
    next(err);
}


}

async function listProject(req,res,next){
    try{
        const projectlist = await Project.find({
            $or: [
                {
                    owner : req.user.id,
                   
                },
                {
                     'members.user' : req.user.id,

                }
            ]
        }).sort({createdAt: -1})

        res.json({ success: true, data: projectlist });

    }catch(err){
        next(err);
    }
}


async function projectbyid(req,res,next){
    try{

        const projectpouplateddata = await req.projects.populate("owner", "name email")


        res.json({
            success:true,
            message: "project fetched",
            data: projectpouplateddata
        })

    }catch(err){
        next(err);
    }
}


async function updateproject(req,res,next){
    try{

        const { name , description} = req.body;

        if (name !== undefined)  req.projects.name = name;
    if (description !== undefined)  req.projects.description = description;

        req.projects.save();

        res.json({
            success:true, 
            message: "updated sucessfully",
            data : req.projects
        })

    }catch(err){
        next(err);
    }

}

async function deleteproject(req,res,next){
    try{

        if(req.projects.owner.toString() !== req.user.id){
            throw new Error("Only owner can delete project ");
        }

        await req.projects.deleteOne();

        res.json({
            success:true,
            message:"project delete sucessfully"
        })
    }catch(err){
        next(err);
    }
}

async function addMembers(req,res,next){

    try{

        const {user , role} = req.body;



       const alreadyMember = req.projects.members.some((m) => m.user.toString() === user);
       
       if(alreadyMember){
        throw new Error("already a member")
       }


     req.projects.members.push({user , role});
       

     await  req.projects.save();


       res.json({
        success:true,
        message:"member added",
        data : req.projects

       })

       

        
    }catch(err){
        next(err);
    }

}

module.exports = {createProject,listProject,projectbyid,updateproject,deleteproject,addMembers};