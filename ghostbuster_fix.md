# GhostBuster Fix Plan: Resolving Flaky Connection Chaos

This document outlines the critical issues identified in our chat application's connection management and the proposed "GhostBuster Fix" to be implemented.

## **The Core Problems (Flaky Connection Chaos)**

### **1. Ghost Presence Problems**
- **Symptom:** Users appear "🟢 Online" even when their socket died (e.g., 47 minutes ago).
- **Background:** iOS/Android background socket kills and laptop sleep modes create "zombie" WebSockets that the server doesn't immediately recognize as closed.
- **Impact:** Teams waste 15-60 minutes daily chasing "ghost" colleagues. Critical @mentions are missed because they are fired to dead sessions.

### **2. Duplicate Message Hell**
- **Symptom:** Reconnecting fires the same message or typing indicator 2-5 times.
- **Background:** Network hiccups cause clients to retry sends without server-side deduplication. Returning users are overwhelmed by duplicate notifications.
- **Impact:** Rage-quitting channels due to notification spam. No client-side UUID tracking means the server can't filter these duplicates.

### **3. Status & Context Desync**
- **Symptom:** "Sent ✓ Delivered" status is shown for offline users.
- **Background:** Lack of heartbeat verification makes all status unreliable.
- **Impact:** Message position is lost on reconnect, leading to scroll confusion and fragmented conversations. Mobile kill-switches desync desktop status.

### **4. Team Productivity Killers**
- **Impact:** $200/hr contractors spend hours coordinating around ghost statuses. Critical bugs are delayed waiting for "online" ghosts who aren't actually there. Engineers quit channels from notification fatigue.

---

## **The Root Cause**
**No server-side heartbeat + deduplication.** Every mobile sleep or network blip becomes team-wide chaos because the system lacks a mechanism to verify connection health and filter redundant data.

---

## **The GhostBuster Fix (3-Day Implementation)**

### **1. Heartbeat Mechanism (The "Pulse")**
- **Implementation:** 15s server-initiated heartbeat.
- **Enforcement:** Evict dead sockets within 30s if no pong is received.
- **Result:** Real-time presence accuracy.

### **2. Message Deduplication (The "De-Spammer")**
- **Implementation:** Every message/event carries a client-generated UUID.
- **Server Logic:** Server tracks recently processed UUIDs and drops duplicates.
- **Result:** 100% deduplication across reconnections and retries.

### **3. Live-Only @Mentions (The "Sanity Saver")**
- **Logic:** Instant response or "offline" status.
- **Refinement:** Ensure notifications only fire when the user is confirmed active via the heartbeat.
- **Result:** Reliable notification delivery and reduced noise.
