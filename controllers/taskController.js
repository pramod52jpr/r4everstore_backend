const Holiday = require("../models/holiday");
const Task = require("../models/task");
const TaskWork = require("../models/taskWork");
const User = require("../models/user");
const protocol = require("../protocol");


exports.uploadTask = async (req, res) => {
    try{
        const {link, category} = req.body;
        await Task.create({link, category});
        res.send({status: true, message: "Task uploaded successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.uploadNonYoutubeTask = async (req, res) => {
    try{
        const {category} = req.body;
        const video = req.file;
        const link = video.destination + video.filename;
        await Task.create({link, category});
        res.send({status: true, message: "Task uploaded successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.getAllTasks = async (req, res) => {
    try{
        const {category} = req.body;
        const userId = req.user.id;
        let tasks;
        if(category){
            tasks = await Task.find({category}).select('-__v');
        }else{
            tasks = await Task.find().select('-__v');
        }
        if(tasks.length == 0) return res.send({status : false, message : "No Task Available"});
        const baseUrl = `${protocol}://${req.get('host')}/`;
        tasks = tasks.map(e => e.category != 'youtube' ? {...e._doc, link: baseUrl+e.link}: e._doc);

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0);
        const taskWork = await TaskWork.find({userId: userId, createdAt: {$gte: startOfDay, $lt: endOfDay}});
        tasks = tasks.map(e => {            
            return {...e, assigned : taskWork.filter(ele => ele.taskId.toString() == e._id.toString()).length != 0};
        });
        res.send({status: true, message: "Data fetched successfully", data: tasks});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.updateTask = async (req, res) => {
    try{
        const {taskId, link, category} = req.body;
        const taskData = await Task.findById(taskId);
        taskData.link = link;
        taskData.category = category;
        await taskData.save();
        res.send({status: true, message: "Task updated successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.updateNonYoutubeTask = async (req, res) => {
    try{
        const {taskId, category} = req.body;
        const taskData = await Task.findById(taskId);
        const file = req.file;
        if(file){
            const link = file.destination + file.filename;
            taskData.link = link;
        }
        taskData.category = category;
        await taskData.save();
        res.send({status: true, message: "Task updated successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.deleteTask = async (req, res) => {
    try{
        const {taskId} = req.body;
        await Task.findByIdAndDelete(taskId);
        res.send({status: true, message: "Task deleted successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

// for normal users -----------------------

exports.addTaskWork = async (req, res) => {
    try{
        const {taskId} = req.body;
        const userId = req.user.id;
        const plan = req.plan;

        const taskData = await Task.findById(taskId);

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0);
        const taskWork = await TaskWork.find({userId: userId, createdAt: {$gte: startOfDay, $lt: endOfDay}}).populate('taskId');
        
        const todayDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

        const holiday = await Holiday.findOne({month: today.getMonth()+1, day: today.getDate()});
        if(holiday || todayDayName == 'Sunday') return res.send({status : false, message : "Today is holiday. No task added"});
        if(plan == null) return res.send({status : false, message : "Please purchase any plan first"});
        if(plan == 'silver' && taskWork.length >= 10) return res.send({status : false, message : "Your task quota has ended for today"});
        if(plan == 'gold' && taskWork.length >= 15) return res.send({status : false, message : "Your task quota has ended for today"});
        if(plan == 'platinum' && taskWork.length >= 40) return res.send({status : false, message : "Your task quota has ended for today"});
        
        if(taskData.category == 'youtube'){
            if((plan == 'silver' && taskWork.filter(e => e.taskId.category == 'youtube').length >= 6)
                || (plan == 'gold' && taskWork.filter(e => e.taskId.category == 'youtube').length >= 12)
                || (plan == 'platinum' && taskWork.filter(e => e.taskId.category == 'youtube').length >= 35)){
                return res.send({status : false, message : "Your maximum quota of youtube task has ended for today"});
            }
        }
        if(taskData.category != 'youtube'){
            if((plan == 'silver' && taskWork.filter(e => e.taskId.category != 'youtube').length >= 4)
                || (plan == 'gold' && taskWork.filter(e => e.taskId.category != 'youtube').length >= 3)
                || (plan == 'platinum' && taskWork.filter(e => e.taskId.category != 'youtube').length >= 5)){
                return res.send({status : false, message : "Your maximum quota of business and local business task has ended for today"});
            }
        }

        await TaskWork.create({userId, taskId});
        res.send({status: true, message: "Task added successfully", taskWork});
    }catch(e){
        res.send({status : false, message : e});
    }
}


exports.getMyTaskWork = async (req, res) => {
    try{
        const userId = req.user.id;

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0);
        let taskWorkData = await TaskWork.find({userId, createdAt: {$gte: startOfDay, $lt: endOfDay}}).populate('taskId');

        taskWorkData = taskWorkData.filter((e) => e.taskId != null);
        if(taskWorkData.length == 0) return res.send({status : false, message : "No Task Available"});
        const baseUrl = `${protocol}://${req.get('host')}/`;
        taskWorkData = taskWorkData.map(e => e.taskId.category != 'youtube' ? {...e._doc, taskId: {...e.taskId._doc, link: baseUrl+e.taskId.link}}: e);
        res.send({status: true, message: "Task fetched successfully", data: taskWorkData});
    }catch(e){
        res.send({status : false, message : e});
    }
}


exports.updateTaskWork = async (req, res) => {
    try{
        const {taskId} = req.body;
        const userId = req.user.id;
        const plan = req.plan;
        const user = await User.findById(userId);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        const image = req.file;
        const taskWorkData = await TaskWork.findById(taskId);
        if(!taskWorkData) return res.send({status: false, message: "Task not found"});
        taskWorkData.completed = true;
        if(image){
            taskWorkData.image = image.destination + image.filename;
        }
        await taskWorkData.save();
        if(plan == 'silver'){
            user.wallet+=5;
        }else if(plan == 'gold'){
            user.wallet+=10;
        }else if(plan == 'platinum'){
            user.wallet+=10;
        }
        await user.save();
        res.send({status: true, message: "Task updated successfully"});
    }catch(e){
        res.send({status : false, message : e});
    }
}