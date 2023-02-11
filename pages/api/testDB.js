import clientPromise from "@/lib/mongodb";


export default async function handler(req, res) {
  const client = await clientPromise;
  if (!process.env.MONGODB_DB) {
    throw new Error('Add MongoDB DATBASE NAME to .env.local')
  }else{
    const db = client.db(process.env.MONGODB_DB);
  
  switch (req.method) {
    case "POST":
      console.log(req.body)
      //let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("posts").insertOne(req.body);
      res.json(myPost);
      break;
    case "GET":
      const allPosts = await db.collection("allPosts").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}
}
