import AttendanceLog from "../models/AttendanceLog.js";
import MemberProfile from "../models/MemberProfile.js";
import User from "../models/User.js";
import { generatePlan } from "../services/groqService.js";

function todayStr(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function logAttendance(req, res, next){
  try{
    const date = todayStr();

    // unique per day
    await AttendanceLog.create({ user: req.user._id, date }).catch(()=>{});

    const profile = await MemberProfile.findOne({ user: req.user._id }).populate("user", "name email");
    if(!profile){ res.status(404); throw new Error("Profile not found"); }

    profile.attendanceCount = (profile.attendanceCount || 0) + 1;

    // refresh AI
    profile.aiPlan = await generatePlan({
      name: profile.user.name,
      planType: profile.planType,
      trainer: profile.trainer,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      goal: profile.goal,
      attendanceCount: profile.attendanceCount
    });

    await profile.save();
    res.json(profile);
  }catch(err){ next(err); }
}
