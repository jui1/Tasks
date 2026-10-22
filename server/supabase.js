const {createClient} = require("@supabase/supabase-js");
require("dotenv").config();

const superBaseURL= process.env.SUPABASE_URL;
const superBaseKey = process.env.SUPABASE_KEY;

if(!superBaseKey || !superBaseKey){
    throw new Error("superBase url ot Key is missing");
}

const sperbase = createClient(superBaseURL,superBaseKey);

//text the connnection

async function textfunc() {
    const{error} = await sperbase.from("tasks").select("id").limit(1);
    if(error){
       throw new Error(`Database failed to check${error.message}`);
       
    }

    console.log("database connted succesfully");
    
}


textfunc();

module.exports = {
    sperbase ,
    textfunc,
};