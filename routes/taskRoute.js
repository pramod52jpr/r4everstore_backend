const express = require("express");
const taskRouter = express.Router();

const {uploadTask, uploadNonYoutubeTask, generateUploadUrl, updateNonYoutubeTask, getAllTasks, updateTask, deleteTask, addTaskWork, getMyTaskWork, updateTaskWork} = require("../controllers/taskController");
const adminAuthVerify = require("../middlewares/adminAuth");
const authVerify = require("../middlewares/auth");
const uploads = require("../middlewares/multer_config");

taskRouter.post('/upload_task', adminAuthVerify, uploadTask);
taskRouter.post('/generate_upload_url', authVerify, generateUploadUrl);
taskRouter.post('/upload_non_youtube_task', adminAuthVerify, uploadNonYoutubeTask);
taskRouter.post('/update_non_youtube_task', adminAuthVerify, updateNonYoutubeTask);
taskRouter.get('/get_all_tasks', authVerify, getAllTasks);
taskRouter.post('/update_task', adminAuthVerify, updateTask);
taskRouter.post('/delete_task', adminAuthVerify, deleteTask);

taskRouter.post('/add_task_work', authVerify, addTaskWork);
taskRouter.get('/get_my_task_work', authVerify, getMyTaskWork);
taskRouter.post('/update_task_work', authVerify, updateTaskWork);

module.exports = taskRouter;