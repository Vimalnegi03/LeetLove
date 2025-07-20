import multer from "multer";
const upload = multer({ dest: "uploads/" }); // Temporarily stores uploads on disk
export default upload;
