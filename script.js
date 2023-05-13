const drop_zone=document.querySelector(".drop-zone")
const browse=document.querySelector("#browseBtn")
const filein=document.querySelector(".file-in")
const bgprogress=document.querySelector(".bg-progress")
const perdiv=document.getElementById("per")
const progressCon=document.querySelector(".progress-container")
const fileURL=document.getElementById("fileURL")
const sharingcon=document.querySelector(".sharing-con")
const emailcon=document.querySelector(".email-part")
const copybtn=document.getElementById("copybtn")

const emailform=document.querySelector("#emailform")
const nextshare=document.getElementById("nshare")
const toast=document.querySelector(".toast")

const host = "https://dlink-share.vercel.app/"
const uploadURL =`${host}api/files`
const emailURL =`${host}api/files/send`

drop_zone.addEventListener("dragover",(e)=>{
    e.preventDefault()
    if(!drop_zone.classList.contains("dragged"))
     drop_zone.classList.add("dragged")
})

drop_zone.addEventListener("dragleave",(r)=>{
     drop_zone.classList.remove("dragged")
})

drop_zone.addEventListener("drop",(e)=>{
    e.preventDefault()
    drop_zone.classList.remove("dragged")
    const filesget=e.dataTransfer.files
    if(filesget.length)
    {
     filein.files= filesget
     uploadfile()
    }
})

filein.addEventListener("change",()=>{
    uploadfile()
})
browse.addEventListener("click",(e)=>{
    filein.click()
})
copybtn.addEventListener("click",(e)=>{
    fileURL.select()
    document.execCommand("copy")
    show_toast("Link Copied")
})

function uploadfile(){

  progressCon.style.display="block"

  const files = filein.files;
  const formData = new FormData();
  formData.append("myfile", files[0]);


  // upload file
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange=()=>{
      if(xhr.readyState===XMLHttpRequest.DONE)
        console.log(xhr.response)
        showlink(JSON.parse(xhr.response))
  }
  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror=()=>{
      filein.value=""
      show_toast(`Error in upload :${xhr.statusText}`)
  }
  xhr.open("POST",uploadURL)
  xhr.send(formData)
}

const updateProgress=(e)=>{
    const percent = Math.round((e.loaded/e.total)*100)
    bgprogress.style.width=`${percent}%`
    perdiv.innerText = percent;
}

const showlink=({file:url})=>{
    progressCon.style.display="none"
    fileURL.value=url
    sharingcon.style.display="block"
    emailcon.style.display="block"
    nextshare.style.display="block"
}

emailform.addEventListener("submit",(e)=>{
    e.preventDefault()
    const url=fileURL.value
    const formdata={
        uuid:url.split("/").splice(-1,1)[0],
        emailTo: emailform.elements["to-email"].value,
        emailFrom: emailform.elements["from-email"].value
       
    }
    

    fetch(emailURL,{
        method:"POST",
        headers:{
           "Content-Type":"application/json"
        },
        body:JSON.stringify(formdata)       
    }).then((res)=>res.json()).then(({success})=> {
          if(success)
          {
              emailcon.style.display="none"
              show_toast("Email Sent")
          }
          })
})

nextshare.addEventListener("click",()=>{
    emailcon.style.display="none"
    sharingcon.style.display="none"
    nextshare.style.display="none"
    filein.value=""
})

let toasttime;
const show_toast=(msg)=>{
    toast.innerText=msg
    toast.style.transform="translateY(0)"
    clearTimeout(toasttime)
     toasttime= setTimeout(()=>{
    toast.style.transform="translateY(-60px)"
    },2000)
}

























// -------------------------------------------------
function validate(){
    const form1=document.getElementById("form1")
    const form2=document.getElementById("form2")
    const sender=document.getElementById("sender")
    const reciever=document.getElementById("reciever")
    const pattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(sender.value.match(pattern)){
        form1.classList.add('valid')
    }
    else{
        form1.classList.remove('valid')
    }
    if(reciever.value.match(pattern))
    {
        form2.classList.add('valid')
    }
    else{
        form2.classList.remove('valid')
    }
}
