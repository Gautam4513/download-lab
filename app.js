import express from 'express'
import {fileURLToPath} from "url"
import {dirname} from 'path'
import path from 'path'
import * as fs from "fs"
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { generateFile } from './utils/genarateFile.js'
import cors from 'cors'

const fileAvilabe ={
    WP:["GY2","GX1","GY1"]
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
const app = express();

app.set("view engine","ejs")
app.use(cors({
    origin: 'https://download-lab.onrender.com' // only allow from your React frontend
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true,}));
app.use(express.static(path.join(__dirname,"public")));


app.get("/",async (req,res)=>{
    res.render("index")
})

app.post("/getFile",(req,res)=>{
    const {subject , name , enRollNo,batch} = req.body;
    if(!subject || !name || !enRollNo || !batch){
        return res.status(400).json({message:"some field is empty"})
    }
    if(!fileAvilabe[subject]){
        res.status(400).json({message: `sorry we only have ${Object.keys(fileAvilabe)} lab manual`})
        return
    }else if(!fileAvilabe[subject].includes(batch)){
        res.status(400).json({message: `sorry we only have ${fileAvilabe[subject]} lab manual`})
        return
    }
    // const textContent = fs.readFileSync(path.join(__dirname,"public",`./${subject}/Wp.docx`),"binary");
    const buffer = generateFile(subject,name,enRollNo,batch,__dirname);
    const outputPath = path.join(__dirname, "public", `${enRollNo}.docx`);
    fs.writeFileSync(outputPath, buffer);

    res.download(path.join(__dirname,"public",`${enRollNo}.docx`),"generated.docx",(err)=>{
        if(err){
            // res.status(500).json({message:"some error occures"});
            console.log(err)
        }
        
    })
    fs.rm(path.join(__dirname,"public",`${enRollNo}.docx`),(err)=>{
        console.log(err)
    })

})



export default app;