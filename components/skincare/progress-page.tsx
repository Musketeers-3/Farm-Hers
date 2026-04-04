"use client"

import { useState } from "react"
import { Camera, Flame, Calendar, TrendingUp, ChevronLeft, ChevronRight, Plus, Star, Award, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const streakData = {
  currentStreak: 14,
  longestStreak: 21,
  totalDays: 45,
  completionRate: 87,
}

const weeklyData = [
  { day: "Mon", am: true, pm: true },
  { day: "Tue", am: true, pm: true },
  { day: "Wed", am: true, pm: false },
  { day: "Thu", am: true, pm: true },
  { day: "Fri", am: false, pm: true },
  { day: "Sat", am: true, pm: true },
  { day: "Sun", am: true, pm: true },
]

const achievements = [
  { title: "First Week", description: "Completed 7 days in a row", icon: Star, unlocked: true },
  { title: "Consistency King", description: "14-day streak", icon: Flame, unlocked: true },
  { title: "Routine Master", description: "30-day streak", icon: Award, unlocked: false },
  { title: "Skin Goals", description: "Track for 60 days", icon: Target, unlocked: false },
]

const progressPhotos = [
  { date: "Mar 1", label: "Week 1" },
  { date: "Mar 15", label: "Week 3" },
  { date: "Mar 29", label: "Week 5" },
]

export function ProgressPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Your Progress</h1>
        <p className="text-white/60 text-sm">Track your skincare journey</p>
      </header>

      {/* Streak Card */}
      <div className="liquid-glass-enhanced rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-sm text-white/60">Day Streak</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/50">Best: {streakData.longestStreak} days</div>
            <div className="text-sm text-white/50">Total: {streakData.totalDays} days</div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-white/40 mb-2">{day.day}</div>
              <div className="space-y-1.5">
                <div
                  className={cn(
                    "w-full h-8 rounded-lg flex items-center justify-center text-[10px] font-medium",
                    day.am
                      ? "bg-amber-500/30 text-amber-300 border border-amber-500/30"
                      : "bg-white/5 text-white/30"
                  )}
                >
                  AM
                </div>
                <div
                  className={cn(
                    "w-full h-8 rounded-lg flex items-center justify-center text-[10px] font-medium",
                    day.pm
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                      : "bg-white/5 text-white/30"
                  )}
                >
                  PM
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-border rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{streakData.completionRate}%</div>
          <div className="text-xs text-white/50">Completion Rate</div>
        </div>
        <div className="glass-border rounded-xl p-4 text-center">
          <Calendar className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{streakData.totalDays}</div>
          <div className="text-xs text-white/50">Total Days</div>
        </div>
        <div className="glass-border rounded-xl p-4 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-white/50">Best Streak</div>
        </div>
        <div className="glass-border rounded-xl p-4 text-center">
          <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {achievements.filter((a) => a.unlocked).length}
          </div>
          <div className="text-xs text-white/50">Achievements</div>
        </div>
      </div>

      {/* Progress Photos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-violet-400" />
            Progress Photos
          </h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
            <Plus className="w-4 h-4" />
            Add Photo
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {progressPhotos.map((photo, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <div className="aspect-[3/4] rounded-xl bg-white/5 border border-white/10 mb-2 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white/20" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white font-medium">{photo.label}</div>
                <div className="text-xs text-white/40">{photo.date}</div>
              </div>
            </div>
          ))}
          <button className="flex-shrink-0 w-32 aspect-[3/4] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:border-white/30 transition-all">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-xs">Add Photo</span>
          </button>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={cn(
                "glass-border rounded-xl p-4 text-center transition-all",
                achievement.unlocked ? "opacity-100" : "opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/30"
                    : "bg-white/5"
                )}
              >
                <achievement.icon
                  className={cn(
                    "w-6 h-6",
                    achievement.unlocked ? "text-yellow-400" : "text-white/30"
                  )}
                />
              </div>
              <h3 className="font-medium text-white text-sm mb-1">{achievement.title}</h3>
              <p className="text-xs text-white/50">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skin Journal Note */}
      <section className="glass-border rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-3">Today&apos;s Notes</h3>
        <textarea
          placeholder="How is your skin feeling today? Any observations or changes..."
          className="w-full h-24 bg-transparent text-white placeholder:text-white/40 resize-none focus:outline-none text-sm leading-relaxed"
        />
        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-all text-sm font-medium">
            Save Note
          </button>
        </div>
      </section>
    </div>
  )
}
