# Foundation Phonics & Olympiad Academy

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Dual-role authentication: Student and Parent portals
- Home Dashboard with Quick Start cards for Phonics and Olympiad modules
- Phonics Module: interactive Sound Board (tap letters to hear sounds) and worksheet library
- Olympiad Module: timed mock test quiz engine, Question of the Day, and leaderboard
- Parent Portal: student progress tracking, announcements feed
- Notification system for class schedules, holiday alerts, and academy promotions
- Role-based access control (student vs parent roles)

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan

### Backend (Motoko)
- User profiles with role field (student | parent)
- Phonics progress tracking per student (letters mastered)
- Olympiad quiz data: questions, answers, categories
- Mock test sessions with scores and timestamps
- Question of the Day storage and rotation
- Leaderboard: top scores per student
- Announcements/notifications: title, body, type (schedule | holiday | promo), date
- Parent-child linking (parent can view linked student's progress)

### Frontend (React + TypeScript)
- Auth screen with role selection (Student / Parent)
- Home Dashboard with Quick Start cards
- Phonics module: Sound Board (alphabet grid, tap-to-play), worksheet library list
- Olympiad module: mock test flow (timed, multiple choice), Question of the Day card, leaderboard table
- Parent dashboard: progress summary, announcements list
- Bottom navigation: Home, Phonics, Olympiad, Profile
- Royal Blue, White, and Gold color palette; professional yet kid-friendly
