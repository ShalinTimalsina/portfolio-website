fetch("http://localhost:3000/api/fix-seed", { method: "POST" })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
