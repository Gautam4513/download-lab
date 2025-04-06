import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path  from "path";
import PizZip from 'pizzip';




export const generateFile = (subject, name, enRollNo, batch,__dirname) => {
    if (subject === "WP") {
        const textContent = fs.readFileSync(path.join(__dirname, "public", `./WP/${batch}.docx`), "binary");
        const zip = new PizZip(textContent)
        const doc = new Docxtemplater(zip,{
            delimiters: {
                start: '[[',  // use [[name]] instead of {name}
                end: ']]'
            }})
        doc.render({
            NAME_OF_STUDENT:name,
            enrollment_no: enRollNo,
        });
        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        return buffer;
    }

}