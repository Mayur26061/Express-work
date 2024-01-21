fetch('http://localhost:3000/todos',
    {
        method: "POST",
        body: JSON.stringify({title:"Buy book",
        description:"Buy book from grocery"}),
        headers: {
            "Content-Type": "application/json"
        }
}).then((res)=>{
    res.json().then((data)=>{
        console.log(data)
    })
})