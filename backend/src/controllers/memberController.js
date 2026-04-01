import User from "../models/User.js";
import MemberProfile from "../models/MemberProfile.js";
import { generatePlan } from "../services/groqService.js";

export async function getMe(req, res, next){
  try{
    const me = await MemberProfile.findOne({ user: req.user._id }).populate("user", "name email");
    res.json(me);
  }catch(err){ next(err); }
}

export async function listAll(req, res, next){
  try{
    const items = await MemberProfile.find().populate("user", "name email").sort({ updatedAt: -1 });
    res.json(items);
  }catch(err){ next(err); }
}

export async function upsertMember(req, res, next){
  try{
    const { email, planType, trainer, paymentStatus, heightCm, weightKg, goal } = req.body;

    const targetUser = await User.findOne({ email });
    if(!targetUser){ res.status(400); throw new Error("User not found"); }

    let profile = await MemberProfile.findOne({ user: targetUser._id });
    if(!profile){
      profile = await MemberProfile.create({ user: targetUser._id });
    }

    profile.planType = planType;
    profile.trainer = trainer;
    profile.paymentStatus = paymentStatus;
    profile.heightCm = heightCm;
    profile.weightKg = weightKg;
    profile.goal = goal;
    profile.updatedBy = req.user._id;

    profile.aiPlan = await generatePlan({
      name: targetUser.name,
      planType,
      trainer,
      heightCm,
      weightKg,
      goal,
      attendanceCount: profile.attendanceCount || 0
    });

    await profile.save();
    res.status(201).json(profile);
  }catch(err){ next(err); }
}
