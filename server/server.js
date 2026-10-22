const express =require("express");
const cross = require("cors");

require("dotenv").config();

const {
    sperbase ,
    textfunc,
} = require("./supabase");

const app= express();
app.use(cross());
app.use(express.json());


app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Task manager is running.."
    })
})

//get all the tasks

// | GET    | `/api/tasks`     | `200 OK` — tasks ki list    -- done                         |
// | POST   | `/api/tasks`     | `201 Created` — naya task  --done                        |
// | PUT    | `/api/tasks/:id` | `200 OK` — updated task   -- working                          |
// | DELETE | `/api/tasks/:id` | `200 OK` or `204 No Content` — successful deletion |


app.get("/api/tasks",async(req,res) =>{
    try {
        const{ data,error} = await sperbase.from("tasks").select("*").order("created_at",{ascending: false});
        if(error){
            console.log("Featch data error", error.message);

            return res.status(500).json({
                success:false,
                message:"Failed to fetch tasks",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Data fetch succesfully",
            data,
        });
    } catch (error) {

        res.status(500).json({
            message:error.message,
        })
        
    }
})

app.post("/api/tasks",async(req,res)=>{
    try {
        const {title,status}= req.body;
        if(!title || !title.trim()){
          return  res.status(400).json({
                success:false,
                message:"Title is required"
            });
        }

        const {data , error}= await sperbase.from("tasks").insert([
           {
            title : title.trim(),
            status: status||"Pending",
           }

        ]).select().single();
        if(error){
            throw error;
        }

       return  res.status(200).json({
            success:true,
            message:"Tasked Created Sucess",
            data,
        });
    } catch (error) {
      return  res.status(500).json({
            success:500,
            message:error.message,
        });
        
    }
})

app.put("/api/tasks/:id",async(req,res)=>{
    try {
        const{id} = req.params;
        const{title, status} = req.body;

        const{data,error} = await sperbase.from("tasks").update({title,status}).eq("id",id).select();

        if(error) throw error;

       return res.status(200).json({
            success:true,
            message:"Data Updated sucessFully",
            data:data
        });
        
    } catch (error) {
      return  res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
})

app.delete("/api/tasks/:id", async(req, res)=>{
    try {

        const{id} = req.params;
        const {data ,error} = await sperbase.from("tasks").delete().eq("id",id).select();
        if(error) throw error;
    
        res.status(200).json({
            success:true,
            message:"Tasked deleted succfully",
            
        })
        
    } catch (error) {

        res.status(500).json({
            success:false,
            message: error.message
        })
        
    }
   
})
const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);

});