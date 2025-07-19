import { db } from "../libs/db.js";
export const getAllListDetails=async(req,res)=>{
try {
    const userId=req.user.id
    
    const playlists =await db.playlist.findMany({
        where:{
            userId: userId
        },
        include:{
            problems:{
                include:{
                problem:true
                }
            }
        }
    })
    res.status(200).json({success:true,message:"Successfully created Playlist",playlists})
} catch (error) {
    return res.status(500).json({error:error.message})
}
}

export const getPlayListDetails=async(req,res)=>{
try {
    const {playlistId}=req.params
    const playlist=await db.playlist.findUnique({
        where:{
            id: playlistId,
            userId:req.user.id,
        },
        include:{
            problems:{
                include:{
                    problem:true
                }
            }
        }
    })
    if(!playlist)
        return res.status(404).json({message:"Playlist not found"})
    res.status(200).json({success:true,message:"Playlist fetched successfully",playlist})
} catch (error) {
     return res.status(500).json({error:error.message})
}
}

export const createPlaylist=async(req,res)=>{
try {
    
    const {name,description}=req.body 
    const userId=req.user.id
    if(!name||!description){
        return res.status(400).json({success:false,message:"Please provide both name and description"})
    }
    const playlist =await db.playlist.create({
        data:{
            name,
            description,
            userId,
        }
    })
    res.status(200).json({success:true,message:"Successfully created Playlist",playlist})
} catch (error) {
    
    return res.status(500).json({error:error.message})
}
}

export const  addProblemToPlaylist=async(req,res)=>{
try {
    const {playlistId} =req.params
    const {problemIds}=req.body
    if(!Array.isArray(problemIds) || problemIds.length==0){
    return res.status.json(400).json({error:"invalid or missing problems id"})
    }
    const problemsInPlaylist=await db.problemsInPlaylist.createMany({
        data:problemIds.map((problemId)=>({
            playlistId,
           problemId
        }))
    })
    res.status(201).json({message:"Problems added to the playlist successfully",success:true,problemsInPlaylist})
} catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message})
}

}


export const deletePlaylist=async(req,res)=>{
const {playlistId} =req.params
try {
    const deletedPlaylist=await db.playlist.delete({
        where:{
            id:playlistId
        }
    })
    res.status(200).json({message:{success:true,message:"successfully deleted playlist"}});
} catch (error) {
    return res.status(400).json({message:error.message})
}
}

export const removeProblemFromPlaylist=async(req,res)=>{
const {playlistId}=req.params
const {problemIds}=req.body
try {
    try {
        if(!Array.isArray(problemIds)||problemIds.length===0) {
            return res.status(400).json({error:error.message})
        }
        const deletedProblem= await db.problemsInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds
                }
            }
        })
        res.status(200).json({success:true,message:"successfully removed  problem from playlist"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
} catch (error) {
    
}
}