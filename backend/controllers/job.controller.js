import {Job} from "../models/job.model.js"
// all jobs will be posted by admin
export const postJob = async (req, res) =>{
  try{
const {title, description, requirements, salary, experience, location, jobType, position, company, created_by, applications, companyId } = await req.body;
const userId = req.id;

if(!title || !description || !requirements || !salary || !experience || !location || !jobType || !position ||!company || !created_by || !applications){
  return res.status(400).json({
    message:"Please enter all details for the job!",
    success:false
  });
}
const job = await Job.create({
  title,
  description,
  requirements:requirements.split(','),
  salary:Number(salary), 
  experienceLevel:experience,
  location,
  jobType,
  position, 
  company:companyId,
  created_by:userId, 
  applications
  });
  return res.status(201).json({
    message:"New job created successfully!",
    job,
    success:false
  });
}catch(error){
  console.log(error);
}
}

// getting all jobs for student/employee
export const getAllJobs = async (req, res) =>{
  try{
    const keyword = req.query.keyword || " ";
    const query = {
      $or:[
        {title:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}}
      ]
    }
    const job = await Job.find(query)
    if(!job){
      return res.status(404).json({
        message:" job not found",
        success:false
      })
    }
    return res.status(200).json({
      job,
      success:true
    })
  }catch(error){
    console.log(error)
  }
}

// getting job for student/employee by id
export const getJobById = async (req, res) =>{
  try{

    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if(!job){
      return res.status(404).json({
        message:" job not found",
        success:false
      })
    }
    return res.status(200).json({
      job,
      success:true
    })
  }catch(error){
    console.log(error)
  }
}

//get jobs for admin 

export const getAdminJobs = async(req, res) =>{
  try{

  const adminId = req.id;
  const jobs = await Job.find({created_by:adminId});

    if(!jobs){
      return res.status(404).json({
        message:" job not found",
        success:false
      })
}
return res.status(200).json({
  jobs,
  success:true
})
}catch(error){
  console.log(error);
}
}