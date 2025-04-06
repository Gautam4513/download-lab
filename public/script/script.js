
const button = document.getElementById("submit")
const form = document.getElementById("form")
const subjectAvilable = {
    WP:["GX2","GY2","GZ2"]
}
const subjectSelect = document.getElementById("subject");
const subjectAvilableArray = Object.keys(subjectAvilable);
subjectAvilableArray.forEach((item)=>{
    const option = new Option(item,item)
    subjectSelect.add(option)
})
// console.log(subjectAvilableLength)
subjectSelect.addEventListener("change",(e)=>{
    const batchSelect = document.getElementById("batch");
    batchSelect.options.length = 1;
    if(e.target.value !== "none"){ 
    
    const selectedSubject = e.target.value;
    console.log(selectedSubject)
    const batchAvilableArray = subjectAvilable[selectedSubject];
    console.log(batchAvilableArray)
    batchAvilableArray.forEach((item)=>{
        const option = new Option(item,item);
        batchSelect.add(option)
    })
}
})

const handleSubjectNone = ()=>{
    alert("please select the subject");
}
const handleBatchNone = ()=>{
    alert("please select the Batch")
}
const handleError =(message)=>{
    document.getElementById("error").innerText = message;
}
form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    button.innerText = "Generating file..."
    button.disabled = true;
    const subject = document.getElementById("subject").value;
    const studentName = document.getElementById("name").value;
    const enRollNumber = document.getElementById("enRollNumber").value;
    const batch = document.getElementById("batch").value;
    
    if(subject === "none"){
        handleSubjectNone();
        return;
    }
    if(batch === "none"){
        handleBatchNone();
        return;
    }
    try {
        const response = await fetch("https://download-lab.onrender.com/getFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject,
                name: studentName,
                enRollNo: enRollNumber,
                batch,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw data
        }
        // const data = await response.json();
        // console.log(data)
        // Convert the response to a blob
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${studentName+subject+Date.now()}.docx`;  // Set the file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Free up memory
        window.URL.revokeObjectURL(url);
        button.innerText = "Generate";
        button.disabled = false;
    } catch (error) {
        handleError(error.message);
        console.error("Error downloading file:", error.message);
    }


    console.dir(subject);
})