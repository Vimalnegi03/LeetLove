import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware.js'
import { getAllListDetails,getPlayListDetails,createPlaylist,addProblemToPlaylist,deletePlaylist,removeProblemFromPlaylist } from '../controllers/playlist.controller.js'
const playlistRouter=express.Router()
playlistRouter.get("/",jwtVerify,getAllListDetails)
playlistRouter.get("/:playlistId",jwtVerify,getPlayListDetails)
playlistRouter.post("/create-playlist",jwtVerify,createPlaylist)
playlistRouter.post("/:playlistId/add-problem",jwtVerify,addProblemToPlaylist)
playlistRouter.delete("/:playlistId",jwtVerify,deletePlaylist)
playlistRouter.delete("/:playlistId/remove-problem",jwtVerify,removeProblemFromPlaylist)
export default playlistRouter