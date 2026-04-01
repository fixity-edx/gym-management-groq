import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearToken, getUser } from "../lib/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Toast from "../components/Toast";
import ProgressBar from "../components/ProgressBar";
import { LogOut, Plus, Sparkles, Users, CalendarCheck, Wallet } from "lucide-react";

function Modal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-panel glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [me, setMe] = useState(null);
  const [members, setMembers] = useState([]);
  const [toast, setToast] = useState(null);
  const notify = (title, message="") => { setToast({ title, message }); setTimeout(()=>setToast(null), 3200); };

  const fetchAll = async () => {
    try{
      const [my, all] = await Promise.all([
        api.get("/members/me"),
        isAdmin ? api.get("/members") : Promise.resolve({ data: [] })
      ]);
      setMe(my.data);
      setMembers(all.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  useEffect(()=>{ fetchAll(); }, []);

  const logout = async () => {
    try{ await api.post("/auth/logout", {}); }catch{}
    clearToken();
    window.location.href = "/login";
  };

  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter(m => m.paymentStatus !== "paid").length;
    const avgAttend = total ? Math.round(members.reduce((a,m)=>a+(m.attendanceCount||0),0)/total) : 0;
    return { total, pending, avgAttend };
  }, [members]);

  // admin add member
  const [openMember, setOpenMember] = useState(false);
  const [mForm, setMForm] = useState({
    email:"",
    planType:"Monthly",
    trainer:"Trainer A",
    paymentStatus:"unpaid",
    heightCm:170,
    weightKg:70,
    goal:"Fat loss"
  });

  const saveMember = async (e) => {
    e.preventDefault();
    try{
      await api.post("/members", mForm);
      notify("Saved","Member updated with AI workout/diet plan");
      setOpenMember(false);
      setMForm({ email:"", planType:"Monthly", trainer:"Trainer A", paymentStatus:"unpaid", heightCm:170, weightKg:70, goal:"Fat loss" });
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const logAttendance = async () => {
    try{
      const res = await api.post("/attendance/log", {});
      notify("Attendance", "Logged successfully. AI plan refreshed.");
      setMe(res.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const adherence = useMemo(() => {
    const c = me?.attendanceCount || 0;
    return Math.min(100, Math.round((c/20)*100)); // assume 20 sessions/month
  }, [me]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-panel glass p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                <Sparkles size={16} />
                Gym Management System
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
                Fitness Dashboard
              </h1>
              <p className="text-slate-300 mt-2">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.role})
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {!isAdmin ? <Button onClick={logAttendance}><CalendarCheck size={18}/> Log Attendance</Button> : null}
              {isAdmin ? <Button onClick={()=>setOpenMember(true)}><Plus size={18}/> Add/Update Member</Button> : null}
              <Button variant="secondary" onClick={logout}><LogOut size={18}/> Logout</Button>
            </div>
          </div>
        </div>

        {!isAdmin ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-panel glass p-6">
              <h2 className="text-xl font-extrabold">My Membership</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-xs text-slate-400">Plan</div>
                  <div className="text-lg font-bold mt-1">{me?.planType || "-"}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-xs text-slate-400">Trainer</div>
                  <div className="text-lg font-bold mt-1">{me?.trainer || "-"}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-xs text-slate-400">Payment</div>
                  <div className="mt-2">
                    <span className={"px-2 py-1 rounded-full text-xs border "+(me?.paymentStatus==="paid"?"bg-emerald-500/15 border-emerald-500/30 text-emerald-200":"bg-amber-500/15 border-amber-500/30 text-amber-200")}>
                      {me?.paymentStatus || "unpaid"}
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-xs text-slate-400">Attendance</div>
                  <div className="text-lg font-bold mt-1">{me?.attendanceCount || 0} sessions</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-slate-200">Monthly Progress</div>
                <div className="mt-2"><ProgressBar value={adherence} /></div>
                <div className="text-xs text-slate-400 mt-2">{adherence}% adherence</div>
              </div>

              {me?.aiPlan ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="text-sm font-semibold">🤖 Personalized Workout/Diet Plan</div>
                  <div className="text-sm mt-2 text-slate-200 whitespace-pre-wrap">{me.aiPlan}</div>
                </div>
              ) : null}
            </div>

            <div className="rounded-panel glass p-6">
              <div className="text-lg font-bold inline-flex items-center gap-2"><Wallet size={18}/> Tips</div>
              <p className="text-sm text-slate-300 mt-3">
                Your plan refreshes whenever admin updates your profile or you log attendance.
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-200">
                <b>Fitness Pro Tip:</b><br/>
                Sleep 7-8 hrs + track water intake daily.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl glass p-5">
                <div className="text-xs text-slate-400 inline-flex items-center gap-2"><Users size={16}/> Total Members</div>
                <div className="text-3xl font-extrabold mt-2">{stats.total}</div>
              </div>
              <div className="rounded-2xl glass p-5">
                <div className="text-xs text-slate-400 inline-flex items-center gap-2"><Wallet size={16}/> Pending Payments</div>
                <div className="text-3xl font-extrabold mt-2">{stats.pending}</div>
              </div>
              <div className="rounded-2xl glass p-5">
                <div className="text-xs text-slate-400 inline-flex items-center gap-2"><CalendarCheck size={16}/> Avg Attendance</div>
                <div className="text-3xl font-extrabold mt-2">{stats.avgAttend}</div>
              </div>
            </div>

            <div className="mt-5 rounded-panel glass p-6">
              <h2 className="text-xl font-extrabold">Members</h2>
              <div className="mt-4 grid gap-3">
                {members.length===0 ? <div className="text-slate-400">No members.</div> : null}
                {members.map(m => (
                  <div key={m._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold">{m.user?.name} • {m.user?.email}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Plan: {m.planType} • Trainer: {m.trainer} • Attendance: {m.attendanceCount||0}
                        </div>
                      </div>
                      <div>
                        <span className={"px-2 py-1 rounded-full text-xs border "+(m.paymentStatus==="paid"?"bg-emerald-500/15 border-emerald-500/30 text-emerald-200":"bg-amber-500/15 border-amber-500/30 text-amber-200")}>
                          {m.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {m.aiPlan ? <div className="mt-3 text-sm text-slate-200 whitespace-pre-wrap border-t border-white/10 pt-3"><b>AI Plan:</b> {m.aiPlan}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Modal open={openMember} title="Add / Update Member (Admin)" onClose={()=>setOpenMember(false)}>
          <form onSubmit={saveMember} className="grid md:grid-cols-2 gap-4">
            <Input label="Member Email" required value={mForm.email} onChange={(e)=>setMForm(f=>({...f,email:e.target.value}))} placeholder="member@example.com" />
            <Select label="Plan Type" value={mForm.planType} onChange={(e)=>setMForm(f=>({...f,planType:e.target.value}))}>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </Select>
            <Select label="Trainer" value={mForm.trainer} onChange={(e)=>setMForm(f=>({...f,trainer:e.target.value}))}>
              <option>Trainer A</option>
              <option>Trainer B</option>
              <option>Trainer C</option>
            </Select>
            <Select label="Payment Status" value={mForm.paymentStatus} onChange={(e)=>setMForm(f=>({...f,paymentStatus:e.target.value}))}>
              <option>paid</option>
              <option>unpaid</option>
            </Select>
            <Input label="Height (cm)" type="number" value={mForm.heightCm} onChange={(e)=>setMForm(f=>({...f,heightCm:Number(e.target.value)}))} />
            <Input label="Weight (kg)" type="number" value={mForm.weightKg} onChange={(e)=>setMForm(f=>({...f,weightKg:Number(e.target.value)}))} />
            <Input label="Goal" value={mForm.goal} onChange={(e)=>setMForm(f=>({...f,goal:e.target.value}))} placeholder="Muscle gain / Fat loss" />
            <div className="flex items-end justify-end gap-2 md:col-span-2">
              <Button type="button" variant="secondary" onClick={()=>setOpenMember(false)}>Cancel</Button>
              <Button type="submit">Save + AI Plan</Button>
            </div>
          </form>
        </Modal>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
